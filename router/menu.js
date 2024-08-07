const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

// const mysql = require('mysql2');

const database = require('scf-nodejs-serverlessdb-sdk').database
 
const fun = async () => {
  //use connection
  console.log('start connection mysql')
  const connection = await database('menu').connection()
  const result = await connection.queryAsync('select * from users')
  connection.release() //must release before return
  console.log('db2 query result:',result)
}
const host = process.env['DB_TESTDB2_HOST'];
console.log(host)

// process.env['DB_TESTDB2_HOST'] = 192.168.1.1
// process.env['DB_TESTDB2_PORT'] = 3306
// process.env['DB_TESTDB2_USER'] = ycp424c
// process.env['DB_TESTDB2_PASSWORD'] = pwd123321123
// process.env['DB_TESTDB2_DATABASE'] = db_name
// process.env['DB_TESTDB2_CONNECTION_LIMIT']

// const fun = async () => {
//   try {
//     const connection = await mysql.createConnection({
//       host: '172.16.0.15',
//       user: 'root',
//       port: 3306,
//       database: 'menu',
//       password: '366351&huo'
//     });

//     connection.query(
//       'SELECT * FROM `users`',
//       (err, results) => {
//         console.log(0, err); // 报错
//         console.log(11, results); // 结果集
//       }
//     );
//   } catch (e) {
//     console.log(e);
//   }
// }
fun();
// 菜单服务
router.post('/', async (req, res) => {
  const data = req.body;
  console.info(data);
  const value = process.env['DB_TESTDB2_HOST'];
  console.log(value)
  const result = { code: 0, data };
  res.json(result);
});


module.exports = router;
