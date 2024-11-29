const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const { menuDb } = require('../utils/ali-mysql');
const { transData, toHump } = require('../utils/common.js');
const { initHotNumber } = require('../task/friend.js');
const dayjs = require('dayjs');

const userArr = [
  'name', 'user_img', 'sex', 'birth_date', 'height', 'qualification', 'career',
  'location', 'residence_place', 'annual_income', 'home_car', 'weixin', 'person_desc',
  'license', 'child', 'cohabit', 'iphone', 'expectation_desc'
];
const pageSize = 10;
// 获取交友列表
const getSelectStr = () => {
  // 删除 电话 微信查询结果 单独加密查询
  const arr = ['id', 'openid', 'created_time', 'modified_time', ...userArr];
  const selectArr = arr.filter((e) => !['weixin', 'iphone'].includes(e));
  return selectArr.join(', ');
};
router.get('/list', async (req, res) => {
  const openid = req.headers['x-user-openid'];
  const data = req.query || {};
  const page = Number(data.page) || 1;
  const { age, sort } = data;
  const province = decodeURIComponent(data.province || '');
  const city = decodeURIComponent(data.city || '');
  const sex = decodeURIComponent(data.sex || '');
  if (!openid) {
    return res.json({ code: 200, msg: '未登录', data: null });
  }
  let startBirthDate = '';
  let endBirthDate = '';
  // age 根据年龄和用户本人差距 需要判断用户填写个人信息 0-3 比自己大 切3岁以内 -3 比自己小 或者大3岁以内
  if (age && age !== '-') {
    const [minAge, maxAge] = age.split('-');
    const userInfo = await menuDb.select('*').from('friend_user').where('openid', openid).queryRow();
    if (userInfo && userInfo.birth_date) {
      if (maxAge) {
        startBirthDate = dayjs(userInfo.birth_date).subtract(maxAge, 'year').format('YYYY-MM-DD');
      }
      if (minAge) {
        endBirthDate = dayjs(userInfo.birth_date).add(minAge, 'year').format('YYYY-MM-DD');
      }
    }
  }
  const orderData = sort === 'hot' ? 'hot_number desc' : 'modified_time desc';
  // 查询条件
  const userData = await menuDb
    .select(getSelectStr()).from('friend_user')
    .where('birth_date', '', 'isnotnull')
    .where('location', province, 'like', 'ifHave')
    .where('location', city, 'like', 'ifHave', 'and')
    .where('sex', sex, 'eq', 'ifHave', 'and')
    .where('birth_date', startBirthDate, 'ge', 'ifHave', 'and')
    .where('birth_date', endBirthDate, 'le', 'ifHave', 'and')
    .where('openid', openid, 'ne')
    .orderby(orderData)
    .queryListWithPaging(page, pageSize);
  const { pageIndex, pageCount, rows } = userData;
  res.json({ code: 0, data: { pageIndex, pageCount, list: transData(rows) } });
});

// 获取交友列表
router.get('/detail', async (req, res) => {
  const openid = req.headers['x-user-openid'];
  const data = req.query;
  const id = Number(data.id);
  if (!openid) {
    return res.json({ code: 200, msg: '未登录', data: null });
  }
  const userInfo = await menuDb.select('*').from('friend_user').where('openid', openid).queryRow();
  // 如果没有id 返回个人信息，有id 返回用户详情
  if (id && userInfo && userInfo.id !== id) {
    const userItem = await menuDb.select(getSelectStr()).from('friend_user').where('id', id).queryRow();
    if (userItem) {
    // 判断是否已经浏览过
      const browseInfo = await menuDb
        .select('id, operate_number')
        .from('friend_browse')
        .where('openid', openid)
        .where('operate_user_id', id)
        .where('operate_type', '浏览')
        .queryRow();
      if (browseInfo) {
        // 浏览过 更新浏览次数
        await menuDb.update('friend_browse')
          .column('operate_number', browseInfo.operate_number + 1)
          .where('id', browseInfo.id)
          .execute();
      } else {
        // 插入用户访问详情记录
        await menuDb.insert('friend_browse')
          .column('openid', openid)
          .column('user_id', userInfo.id)
          .column('operate_user_id', id)
          .column('operate_type', '浏览')
          .column('operate_number', 1)
          .execute();
      }
      // 获取用户是否被收藏
      const collectInfo = await menuDb
        .select('id')
        .from('friend_browse')
        .where('openid', openid)
        .where('operate_user_id', id)
        .where('operate_type', '收藏')
        .queryRow();
      userItem.collect = Boolean(collectInfo);
      res.json({ code: 0, data: transData(userItem) });
    }
    res.json({ code: 0, data: {} });
  }
  res.json({ code: 0, data: transData(userInfo || {}) });
});
// 新增用户
router.post('/index', async (req, res) => {
  const openid = req.headers['x-user-openid'];
  const data = req.body || {};
  if (!openid) {
    return res.json({ code: 200, msg: '未登录', data: null });
  }
  const userItem = await menuDb.select('id').from('friend_user').where('openid', openid).queryRow();
  if (!userItem) {
    // 用户信息为空 先插入数据 然后更新传入字段
    await menuDb.insert('friend_user').column('openid', openid).execute();
    return res.json({ code: 0, data: '插入用户成功' });
  }
  if (Object.keys(data).length === 0) return res.json({ code: 0, data: '更新信息为空' });
  const updateObj = {};
  userArr.forEach((key) => {
    if (data[toHump(key)]) {
      updateObj[key] = data[toHump(key)];
    }
  });
  try {
    const result = await menuDb
      .update('friend_user', updateObj)
      .where('openid', openid)
      .execute();
    // 获取更新数据 进行更新
    res.json({ code: 0, data: result });
  } catch (err) {
    res.json({ code: 300, msg: '更新失败', data: null });
  }
});

// 收藏
router.post('/collect', async (req, res) => {
  const openid = req.headers['x-user-openid'];
  const data = req.body;
  const { id } = data;
  if (!openid) {
    return res.json({ code: 200, msg: '未登录', data: null });
  }
  if (!id) {
    return res.json({ code: 300, msg: 'ID为空', data: null });
  }
  const userInfo = await menuDb.select('id').from('friend_user').where('openid', openid).queryRow();
  if (userInfo.id !== id) {
    // 判断是否已经收藏过了 如果已经收藏 则取消收藏
    const collectInfo = await menuDb
      .select('id')
      .from('friend_browse')
      .where('user_id', userInfo.id)
      .where('operate_user_id', id)
      .where('operate_type', '收藏')
      .queryRow();
    if (collectInfo) {
      try {
        await menuDb.delete('friend_browse').where('id', collectInfo.id).execute();
        res.json({ code: 0, data: '取消收藏成功' });
      } catch (err) {
        res.json({ code: 300, msg: '取消失败', data: null });
      }
    } else {
      // 插入用户访问详情记录
      try {
        await menuDb.insert('friend_browse')
          .column('openid', openid)
          .column('user_id', userInfo.id)
          .column('operate_user_id', id)
          .column('operate_type', '收藏')
          .execute();
        res.json({ code: 0, data: '收藏成功' });
      } catch (err) {
        res.json({ code: 300, msg: '收藏失败', data: null });
      }
    }
  }
  res.json({ code: 0, data: '无法收藏个人' });
});

// 获取个人中心详情
router.get('/user/info', async (req, res) => {
  const openid = req.headers['x-user-openid'];
  if (!openid) {
    return res.json({ code: 200, msg: '未登录', data: null });
  }
  const userInfo = await menuDb.select('id, name, user_img').from('friend_user').where('openid', openid).queryRow();
  // 看过我的
  userInfo.browsedNum = await menuDb
    .select('count(1)')
    .from('friend_browse')
    .where('operate_user_id', userInfo.id)
    .where('operate_type', '浏览')
    .queryValue();
  // 我看过的
  userInfo.browseNum = await menuDb
    .select('count(1)')
    .from('friend_browse')
    .where('user_id', userInfo.id)
    .where('operate_type', '浏览')
    .queryValue();
  // 我收藏别人的数量
  userInfo.collectNum = await menuDb
    .select('count(1)')
    .from('friend_browse')
    .where('user_id', userInfo.id)
    .where('operate_type', '收藏')
    .queryValue();
  // 我被收藏的数量
  userInfo.collectedNum = await menuDb
    .select('count(1)')
    .from('friend_browse')
    .where('operate_user_id', userInfo.id)
    .where('operate_type', '收藏')
    .queryValue();
  // 如果没有id 返回个人信息，有id 返回用户详情
  res.json({ code: 0, data: transData(userInfo) });
});

// 获取 收藏、被浏览详情
router.get('/user/browse', async (req, res) => {
  const openid = req.headers['x-user-openid'];
  const data = req.query;
  const { isOperate } = data || {};
  const type = decodeURIComponent(data.type) || '';
  const page = Number(data.page) || 1;
  if (!openid) {
    return res.json({ code: 200, msg: '未登录', data: null });
  }
  const userInfo = await menuDb.select('id').from('friend_user').where('openid', openid).queryRow();
  // 查询条件的key 和 查询结果的key type 收藏/浏览
  const findKey = isOperate === 'true' ? 'user_id' : 'operate_user_id';
  const selectKey = isOperate === 'true' ? 'operate_user_id' : 'user_id';
  const browseData = await menuDb
      .select(selectKey)
      .from('friend_browse')
      .where(findKey, userInfo.id)
      .where('operate_type', type)
      .orderby('modified_time desc')
      .queryListWithPaging(page, pageSize);
  const { pageIndex, pageCount, rows } = browseData;
  const idArr = rows.map((e) => e[selectKey]);
  const userList = await menuDb
    .select(getSelectStr())
    .from('friend_user')
    .where('id', idArr, 'in')
    .queryList();
  res.json({ code: 0, data: { pageIndex, pageCount, list: transData(userList) } });
});

// 获取 收藏、被浏览详情
router.get('/refresh/browse', async (req, res) => {
  initHotNumber();
  res.json({ code: 0, data: [] });
});
module.exports = router;
