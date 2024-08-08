const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const { menuQuery } = require('../utils/mysql');

// 菜单服务
router.post('/', async (req, res) => {
  const data = req.body;
  console.info(data);
  const list = await menuQuery('SELECT * FROM `menu`');
  const result = { code: 0, data: list };
  res.json(result);
});

// 搜索菜单 名称 标签 原料 搜索后返回 menuId 然后获取列表

// 获取列表
router.get('/list', async (req, res) => {
  const list = await menuQuery('SELECT * FROM `menu`');
  // 联表查询 名称 图片 标签 原料
  const result = { code: 0, data: list };
  res.json(result);
});

// 获取详情 联表查询

// 创建菜单
router.post('/add', async (req, res) => {
  const data = req.body;
  console.info(data);
  const { name, condiment } = data;
  if (!name || !condiment) {
    return res.json({ code: 1, msg: '菜单名称和菜单调料不能为空', data: null });
  }
  const list = await menuQuery(`
    insert into menu (name, condiment) values ('${name}', '${condiment}');
  `);
  // 获取菜单id 插入子表
  console.info(list);
  const result = { code: 0, data: list };
  res.json(result);
});

// 修改菜单 重新提交所有内容

// 删除菜单

// 
module.exports = router;
