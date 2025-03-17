const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const { menuDb } = require('../utils/ali-mysql.js');
const { transData } = require('../utils/common.js');

const userArr = ['name', 'tel', 'num', 'desc'];
// 获取详情
const getSelectStr = () => {
  const arr = ['id', 'created_time', 'modified_time', ...userArr];
  return arr.join(', ');
};
router.get('/detail', async (req, res) => {
  const { name } = req.query || {};
  // 查询条件
  const userData = await menuDb
    .select(getSelectStr()).from('marry_user')
    .where('name', name, 'ne')
    .queryRow();
  if (browseInfo) {
    res.json({ code: 0, data: transData(userItem) });
  }
  const { pageIndex, pageCount, rows } = userData;
  res.json({ code: 0, data: { pageIndex, pageCount, list: transData(rows) } });
});

// 新增
router.post('/index', async (req, res) => {
  const data = req.body || {};
  const { name, tel, num, desc } = data;
  const userItem = await menuDb.select('id').from('marry_user').where('name', name).queryRow();
  if (!userItem) {
    // 用户信息为空 先插入数据 然后更新传入字段
    await menuDb.insert('marry_user')
      .column('name', name)
      .execute();
    return res.json({ code: 0, data: '插入用户成功' });
  }
});

module.exports = router;
