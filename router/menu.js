const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

const DB_HOST = '172.16.0.15';
const DB_PORT = 3306;
const DB_DATABASE = 'menu';
const DB_USER = 'root';
const DB_PASSWORD = '366351&huo';
// 创建连接池
const { database } = require('scf-nodejs-serverlessdb-sdk');

const mainHandler = async () => {
  // use connection
  const connection = await database('menu').connection();
  const result = await connection.queryAsync('select * from users');
  connection.release(); // must release before return
  console.log('db2 query result:', result);
};
// 菜单服务
router.post('/', async (req, res) => {
  const data = req.body;
  console.info(data);
  mainHandler();
  const result = { code: 0, data };
  res.json(result);
});
module.exports = router;
