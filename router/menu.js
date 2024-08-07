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

// 创建菜单 事务性提交
router.post('/add', async (req, res) => {
  const data = req.body;
  const { name, condiment, images, tags, steps, materials } = data;
  if (!name || !condiment) {
    return res.json({ code: 100, msg: '菜单名称和菜单调料不能为空', data: null });
  }
  // 连接数据库连接池 获取事务提交 回滚方法
  const connection = getMenuTransaction();
  try {
    const menuItem = await queryConnection(connection, `
      insert into menu (name, condiment) values ('${name}', '${condiment}');
    `);
    const { insertId } = menuItem;
    // 获取菜单id 插入子表
    if (tags && tags.length > 0) {
      const arr = tags.map((item) => `(${insertId}, '${item}')`);
      const sql = `insert into menu_tag (menu_id, content) values ${ arr.join(',') };`;
      await queryConnection(connection, sql);
    }
    if (steps && steps.length > 0) {
      const arr = steps.map((item) => `(${insertId}, '${item}')`);
      const sql = `insert into menu_step (menu_id, content) values ${ arr.join(',') };`;
      await queryConnection(connection, sql);
    }
    if (materials && materials.length > 0) {
      const arr = materials.map((item) => `(${insertId}, '${item.name}', '${item.number}')`);
      const sql = `insert into menu_material (menu_id, content, number) values ${ arr.join(',') };`;
      await queryConnection(connection, sql);
    }
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
  const connection = getMenuTransaction();
  try {
    const menuItem = await queryConnection(connection, `delete from menu where id =${id};`);
    console.log(menuItem);
    await commitTransaction(connection);
    const result = { code: 0, data: 'success' };
    res.json(result);
  } catch (err) {
    if (connection) {
      await rollbackTransaction(connection);
    }
    console.log(err);
    res.json({ code: 300, msg: '菜单删除失败', data: null });
  } finally {
    if (connection) connection.release();
  }
});
//
module.exports = router;
