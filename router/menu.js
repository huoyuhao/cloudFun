const express = require('express');
const db = require('../utils/mysql');

const router = express.Router();
// 菜单服务
router.post('/', async (req, res) => {
  const data = req.body;
  console.info(data);
  
  const sql = `SELECT *  FROM users;`;
  const list = await db.query(sql, '');
  console.info(list);
  
  const result = { code: 0, data: list };
  res.json(result);
});
module.exports = router;
