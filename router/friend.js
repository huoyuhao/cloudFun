const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const { menuDb } = require('../utils/ali-mysql');
const { transData } = require('../utils/common.js');

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
  const userList = await menuDb
    .select('*').from('friend_user')
    .where('location', province, 'like', 'ifHave')
    .where('location', city, 'like', 'ifHave', 'and')
    .where('sex', sex, 'eq', 'ifHave', 'and')
    .orderby('modified_time desc')
    .queryListWithPaging(page, 2);
  res.json({ code: 0, data: transData(userList) });
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
  if (id && userInfo.id !== id) {
    const userItem = await menuDb.select('*').from('friend_user').where('id', id).queryRow();
    // 插入用户访问详情记录
    menuDb.insert('friend_Browse')
      .column('openid', openid)
      .column('user_id', userInfo.id)
      .column('operate_user_id', id)
      .column('operate_type', '浏览')
      .execute();
    res.json({ code: 0, data: transData(userItem) });
  }
  res.json({ code: 0, data: transData(userList) });
});

module.exports = router;
