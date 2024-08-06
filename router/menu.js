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
  pool.getConnection((err, connection) => {
    if (err) return err;
    connection.query('select * from users where id = ?', [1], (error, results) => {
      if (error) {
        return error;
      }
         res.json({ code: 200, data: results[0], msg: '0k' }); // 成功返回的数据

      // 将连接返回到连接池中, 准备让其他人重复使用
      connection.release();
    });
  });
  // const result = { code: 0, data: list };
  // res.json(result);
});
module.exports = router;
