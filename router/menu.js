const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const { menuDb } = require('../utils/ali-mysql');

const checkDeleteData = async(req, tableName) => {
  const openid = req.headers['x-user-openid'];
  const data = req.query;
  const id = Number(data.id);
  let result;
  if (!id) {
    return res.json({ code: 100, msg: 'ID为空', data: null });
  }
  const res = await menuDb.select('*').from(tableName).where('id', id).queryRow();
  if (!res) {
    result = { code: 100, msg: '没有找到', data: null };
  } else if (result.openid !== openid) {
    result = { code: 201, msg: '没有权限', data: null };
  } else {
    // 连接数据库连接池 获取事务提交 回滚方法
    const trans = await menuDb.useTransaction();
    try {
      await trans.delete(tableName).where('id', id).execute();
      await trans.commit();
      result = { code: 0, data: 'success' };
    } catch (err) {
      await trans.rollback();
      result = { code: 300, msg: '删除失败', data: null };
    }
  }
  return result;
};

// 获取菜单列表
router.get('/index', async (req, res) => {
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
router.post('/index', async (req, res) => {
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
      .column('sale_count', 0)
      .column('openid', openid)
      .execute();
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
    res.json({ code: 300, msg: '创建失败', data: null });
  }
});

// 修改菜单 重新提交所有内容
router.put('/index', async (req, res) => {
  const openid = req.headers['x-user-openid'] || '';
  const data = req.body;
  const { id, name, condiment, images, tag, step, material } = data;
  if (!id) {
    return res.json({ code: 100, msg: '菜单ID为空', data: null });
  }
  if (!name || !condiment) {
    return res.json({ code: 100, msg: '菜单名称和菜单调料不能为空', data: null });
  }
  const result = await menuDb.select('*').from('menu').where('id', id).queryRow();
  if (!result) {
    return res.json({ code: 100, msg: '没有找到菜单', data: null });
  } else if (result.openid !== openid) {
    return res.json({ code: 201, msg: '没有权限', data: null });
  }
  // 连接数据库连接池 获取事务提交 回滚方法
  const trans = await menuDb.useTransaction();
  try {
    // 更新用户信息
    await trans.update('menu')
      .column('name', name)
      .column('condiment', condiment)
      .column('tag', tag)
      .column('material', material)
      .column('step', step)
      .where('id', id)
      .execute();
    // 删除所有图片 重新插入
    await trans.delete('menu_image').where('menu_id', id).execute();
    if (images && images.length > 0) {
      images.forEach(async (item) => {
        await trans.insert('menu_image').column('menu_id', id).column('content', item).execute();
      });
    }
    await trans.commit();
    const result = { code: 0, data: 'success' };
    res.json(result);
  } catch (err) {
    await trans.rollback();
    res.json({ code: 300, msg: '菜单修改失败', data: null });
  }
});

// 删除菜单
router.delete('/index', async (req, res) => {
  const data = req.query;
  const id = Number(data.id);
  const result = checkDeleteData(req, 'menu');
  await menuDb.delete('menu_image').where('menu_id', id).execute();
  res.json(result);
});

// 新增订单
router.post('/order', async (req, res) => {
  const openid = req.headers['x-user-openid'] || '';
  const data = req.body;
  const { menuIds, text } = data;
  if (!menuIds) {
    return res.json({ code: 100, msg: '订单不能为空', data: null });
  }
  // 连接数据库连接池 获取事务提交 回滚方法
  const trans = await menuDb.useTransaction();
  try {
    // 存储用户信息
    await trans.insert('menu_order')
      .column('menu_ids', menuIds)
      .column('text', text || '')
      .column('status', '待下单')
      .column('openid', openid)
      .execute();
    await trans.commit();
    const result = { code: 0, data: 'success' };
    res.json(result);
  } catch (err) {
    await trans.rollback();
    res.json({ code: 300, msg: '创建失败', data: null });
  }
});

// 删除订单
router.delete('/order', async (req, res) => {
  const openid = req.headers['x-user-openid'];
  const data = req.query;
  const id = Number(data.id);
  if (!id) {
    return res.json({ code: 100, msg: '订单ID为空', data: null });
  }
  const result = await menuDb.select('*').from('menu_order').where('id', id).queryRow();
  if (!result) {
    return res.json({ code: 100, msg: '没有找到订单', data: null });
  } else if (result.openid !== openid) {
    return res.json({ code: 201, msg: '没有权限', data: null });
  }
  // 连接数据库连接池 获取事务提交 回滚方法
  const trans = await menuDb.useTransaction();
  try {
    await trans.delete('menu_order').where('id', id).execute();
    await trans.commit();
    const result = { code: 0, data: 'success' };
    res.json(result);
  } catch (err) {
    await trans.rollback();
    res.json({ code: 300, msg: '删除失败', data: null });
  }
});

// 结束订单
router.put('/order', async (req, res) => {
  // 修改订单状态
  const openid = req.headers['x-user-openid'];
  const data = req.query;
  const id = Number(data.id);
  if (!id) {
    return res.json({ code: 100, msg: '订单ID为空', data: null });
  }
  const result = await menuDb.select('*').from('menu_order').where('id', id).queryRow();
  if (!result) {
    return res.json({ code: 100, msg: '没有找到订单', data: null });
  } else if (result.openid !== openid) {
    return res.json({ code: 201, msg: '没有权限', data: null });
  }
  // 连接数据库连接池 获取事务提交 回滚方法
  const trans = await menuDb.useTransaction();
  try {
    await trans.delete('menu_order').where('id', id).execute();
    await trans.commit();
    const result = { code: 0, data: 'success' };
    res.json(result);
  } catch (err) {
    await trans.rollback();
    res.json({ code: 300, msg: '删除失败', data: null });
  }
  // 修改菜单销量
});
module.exports = router;
