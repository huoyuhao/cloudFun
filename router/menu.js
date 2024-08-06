const express = require('express');
const mysql = require('mysql2');
// eslint-disable-next-line new-cap
const router = express.Router();

const DB_HOST = '172.16.0.15';
const DB_PORT = 3306;
const DB_DATABASE = 'menu';
const DB_USER = 'root';
const DB_PASSWORD = '366351&huo';
// 创建连接池
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  port: DB_PORT,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  connectionLimit: 1
});
// 菜单服务
router.post('/', async (req, res) => {
  const data = req.body;
  console.info(data);
  const result = { code: 0, data: list };
  res.json(result);
});
module.exports = router;
