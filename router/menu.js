const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const { menuDb } = require('../utils/ali-mysql');

// 获取列表
router.get('/list', async (req, res) => {
  const openid = req.headers['x-user-openid'];
  const bindOpenid = req.headers['x-user-bind-openid'];
  let data = [];
  if (!openid) {
    return res.json({ code: 200, msg: '未登录', data: null });
  }
  const menus = await menuDb
    .select('*').from('menu')
    .where('openid', openid, 'eq')
    .where('openid', bindOpenid, 'eq', 'ifHave', 'or')
    .queryList();
  const images = await menuDb
    .select('*').from('menu_image')
    .queryList();
  const obj = {};
  images.forEach((item) => {
    if (!obj[item.menu_id]) obj[item.menu_id] = {};
    if (!obj[item.menu_id].images) obj[item.menu_id].images = [];
    obj[item.menu_id].images.push(item.content);
  });
  data = menus.map((item) => {
    return { ...item, images: (obj[item.id] && obj[item.id].images) || [], };
  });
  const result = { code: 0, data };
  res.json(result);
});
// 创建菜单 事务性提交
router.post('/add', async (req, res) => {
  const openid = req.headers['x-user-openid'] || '';
  const data = req.body;
  const { name, condiment, images, tag, step, material } = data;
  if (!name || !condiment) {
    return res.json({ code: 100, msg: '菜单名称和菜单调料不能为空', data: null });
  }
  // 连接数据库连接池 获取事务提交 回滚方法
  const trans = await menuDb.useTransaction();
  try {
    // 存储用户信息
    const menuItem = await trans.insert('menu')
      .column('name', name)
      .column('condiment', condiment)
      .column('tag', tag)
      .column('material', material)
      .column('step', step)
      .column('openid', openid)
      .execute();
      console.log('menuItem', menuItem);
    const { insertId } = menuItem;
    // 获取菜单id 插入子表
    if (images && images.length > 0) {
      images.forEach(async (item) => {
        await trans.insert('menu_image')
          .column('menu_id', insertId)
          .column('content', item)
          .execute();
      });
    }
    await trans.commit();
    const result = { code: 0, data: 'success' };
    res.json(result);
  } catch (err) {
    await trans.rollback();
    res.json({ code: 300, msg: '菜单创建失败', data: null });
  }
});

// 修改菜单 重新提交所有内容

// 删除菜单
router.delete('/delete', async (req, res) => {
  const openid = req.headers['x-user-openid'];
  const data = req.query;
  const id = Number(data.id);
  if (!id) {
    return res.json({ code: 100, msg: '菜单ID为空', data: null });
  }
  const result = await menuDb.select('*').from('menu').where('id', id).queryRow();
  if (!result) {
    return res.json({ code: 100, msg: '菜单ID找不到', data: null });
  } else if (result.openid !== openid) {
    return res.json({ code: 201, msg: '没有权限', data: null });
  }
  // 连接数据库连接池 获取事务提交 回滚方法
  const trans = await menuDb.useTransaction();
  try {
    await trans.delete('menu').column('id', id).execute();
    await trans.delete('menu_image').column('menu_id', id).execute();
    await trans.commit();
    const result = { code: 0, data: 'success' };
    res.json(result);
  } catch (err) {
    await trans.rollback();
    res.json({ code: 300, msg: '菜单删除失败', data: null });
  }
});
module.exports = router;
