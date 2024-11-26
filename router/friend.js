const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const { menuDb } = require('../utils/ali-mysql');
const { transData, toHump } = require('../utils/common.js');

const userArr = [
  'name', 'user_img', 'sex', 'birth_date', 'height', 'qualification', 'career',
  'location', 'residence_place', 'annual_income', 'home_car', 'weixin', 'desc',
  'license', 'child', 'cohabit', 'iphone', 'expectation_desc'
];
// 获取交友列表
router.get('/list', async (req, res) => {
  const openid = req.headers['x-user-openid'];
  const data = req.query;
  const page = Number(data.page) || 1;
  // , age, sort
  const { province, city, sex } = data || {};
  if (!openid) {
    return res.json({ code: 200, msg: '未登录', data: null });
  }
  // todo 待定 根据修改时间排序 热度 根据 90天 用户详情访问次数/人次/收藏数 排序（排除自己访问）
  // 定时任务 每天获取最近90天 用户详情访问量 统计到user表 hotNumber字段
  // age 根据年龄和用户本人差距 需要判断用户填写个人信息
  // 查询条件
  const userData = await menuDb
    .select('*').from('friend_user')
    .where('location', province, 'like', 'ifHave')
    .where('location', city, 'like', 'ifHave', 'and')
    .where('sex', sex, 'eq', 'ifHave', 'and')
    .orderby('modified_time desc')
    .queryListWithPaging(page, 2);
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
    const userItem = await menuDb.select('*').from('friend_user').where('id', id).queryRow();
    // 插入用户访问详情记录
    await menuDb.insert('friend_browse')
      .column('openid', openid)
      .column('user_id', userInfo.id)
      .column('operate_user_id', id)
      .column('operate_type', '浏览')
      .execute();
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
  res.json({ code: 0, data: transData(userInfo) });
});
// 新增用户
router.post('/index', async (req, res) => {
  const openid = req.headers['x-user-openid'];
  const data = req.body;
  if (!openid) {
    return res.json({ code: 200, msg: '未登录', data: null });
  }
  const userItem = await menuDb.select('id').from('friend_user').where('openid', openid).queryRow();
  if (!userItem) {
    // 用户信息为空 先插入数据 然后更新传入字段
    await menuDb.insert('friend_user').column('openid', openid).execute();
  }
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
  const userInfo = await menuDb.select('*').from('friend_user').where('openid', openid).queryRow();
  if (userInfo.id !== id) {
    // 判断是否已经收藏过了 如果已经收藏 则取消收藏
    const collectInfo = await menuDb
      .select('id')
      .from('friend_browse')
      .where('user_id', userInfo.id)
      .where('operate_user_id', id)
      .where('operate_type', '收藏')
      .queryRow();
    console.log('collectInfo', collectInfo);  
    if (collectInfo) {
      try {
        await menuDb.delete('friend_browse').where('id', collectInfo.id).execute();
        res.json({ code: 0, data: null });
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
        res.json({ code: 0, data: null });
      } catch (err) {
        res.json({ code: 300, msg: '收藏失败', data: null });
      }
    }
  }
  res.json({ code: 0, data: null });
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
  const { type } = data || {};
  if (!openid) {
    return res.json({ code: 200, msg: '未登录', data: null });
  }
  const result = {};
  const userInfo = await menuDb.select('id').from('friend_user').where('openid', openid).queryRow();
  // 看过我的
  if (type === '浏览') {
    // 统计浏览数量 合并
    result.browseList = await menuDb
      .select('*')
      .from('friend_browse')
      .where('user_id', userInfo.id)
      .where('operate_type', '浏览')
      .queryList();
    result.browsedList = await menuDb
      .select('*')
      .from('friend_browse')
      .where('operate_user_id', userInfo.id)
      .where('operate_type', '浏览')
      .queryList();
  } else {
    result.collectList = await menuDb
      .select('*')
      .from('friend_browse')
      .where('user_id', userInfo.id)
      .where('operate_type', '收藏')
      .queryList();
    result.collectedList = await menuDb
      .select('*')
      .from('friend_browse')
      .where('operate_user_id', userInfo.id)
      .where('operate_type', '收藏')
      .queryList();
  }
  res.json({ code: 0, data: result });
});
module.exports = router;
