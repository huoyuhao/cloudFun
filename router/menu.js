const express = require('express');
const mysql = require('mysql2');
// eslint-disable-next-line new-cap
const router = express.Router();
const connection = await mysql.createConnection({
  host: '172.16.0.15',
  user: 'root',
  database: 'menu',
  password: '366351&huo'
});

connection.query(
  'SELECT * FROM `users`',
  (err, results, fields) => {
    console.log(11, results); // 结果集
    console.log(22, fields); // 额外的元数据（如果有的话）
  }
);
// 菜单服务
router.post('/', async (req, res) => {
  const data = req.body;
  console.info(data);
  const result = { code: 0, data };
  res.json(result);
});
module.exports = router;
