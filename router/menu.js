const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {
  menuQuery,
  queryConnection,
  commitTransaction,
  rollbackTransaction,
  getMenuTransaction
} = require('../utils/mysql');

// 获取列表
router.get('/list', async (req, res) => {
  const queryData = req.query;
  const id = Number(queryData.id);
  let data = [];
  if (id) {
    const [menu, imageList] = await Promise.all([
      menuQuery(`select * from menu where id = ${id}`),
      menuQuery(`select * from menu_image where menu_id = ${id}`),
    ]);
    const images = imageList.map(item => item.content);
    data = { ...menu[0], images };
  } else {
    const [menus, images] = await Promise.all([
      menuQuery('select * from menu'),
      menuQuery('select * from menu_image'),
    ]);
    const obj = {};
    images.forEach((item) => {
      if (!obj[item.menu_id]) obj[item.menu_id] = {};
      if (!obj[item.menu_id].images) obj[item.menu_id].images = [];
      obj[item.menu_id].images.push(item.content);
    });
    data = menus.map((item) => {
      return { ...item, images: (obj[item.id] && obj[item.id].images) || [], };
    });
  }
  const result = { code: 0, data };
  res.json(result);
});
// 创建菜单 事务性提交
router.post('/add', async (req, res) => {
  const data = req.body;
  const { name, condiment, images, tag, step, material } = data;
  if (!name || !condiment) {
    return res.json({ code: 100, msg: '菜单名称和菜单调料不能为空', data: null });
  }
  // 连接数据库连接池 获取事务提交 回滚方法
  const connection = await getMenuTransaction();
  try {
    const menuItem = await queryConnection(connection, `
      insert into menu (name, condiment, tag, material, step) values
      ('${name}', '${condiment}', '${tag}', '${material}', '${step}');
    `);
    const { insertId } = menuItem;
    // 获取菜单id 插入子表
    if (images && images.length > 0) {
      const arr = images.map((item) => `(${insertId}, '${item}')`);
      const sql = `insert into menu_image (menu_id, content) values ${ arr.join(',') };`;
      await queryConnection(connection, sql);
    }
    await commitTransaction(connection);
    const result = { code: 0, data: 'success' };
    res.json(result);
  } catch (err) {
    if (connection) {
      await rollbackTransaction(connection);
    }
    res.json({ code: 300, msg: '菜单创建失败', data: null });
  } finally {
    if (connection) connection.release();
  }
});

// 修改菜单 重新提交所有内容

// 删除菜单
router.delete('/delete', async (req, res) => {
  const data = req.query;
  const id = Number(data.id);
  if (!id) {
    return res.json({ code: 100, msg: '删除菜单的ID不能为空', data: null });
  }
  // 连接数据库连接池 获取事务提交 回滚方法
  const connection = await getMenuTransaction();
  try {
    await queryConnection(connection, `delete from menu where id=${id};`);
    await Promise.all([
      queryConnection(connection, `delete from menu_image where menu_id=${id};`),
    ]);
    await commitTransaction(connection);
    const result = { code: 0, data: 'success' };
    res.json(result);
  } catch (err) {
    console.info(err);
    if (connection) {
      await rollbackTransaction(connection);
    }
    res.json({ code: 300, msg: '菜单删除失败', data: null });
  } finally {
    if (connection) connection.release();
  }
});
module.exports = router;
