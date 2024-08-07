const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

// const database = require('scf-nodejs-serverlessdb-sdk').database
 
// const fun = async () => {
//   //use connection
//   console.log('start connection mysql')
//   const connection = await database('menu').connection()
//   const result = await connection.queryAsync('select * from users')
//   connection.release() //must release before return
//   console.log('db2 query result:',result)
// }



const mysql = require('mysql')

const fun = async () => {
  try {
    const connection =  mysql.createConnection({
      host: '172.16.0.15',
      user: 'root',
      port: 3306,
      database: 'menu',
      password: '366351&huo'
    })
    connection.connect();

    connection.query(
      'SELECT * FROM `users`',
      (err, results) => {
        console.log(0, err); // 报错
        console.log(11, results); // 结果集
      }
    );
  } catch (e) {
    console.log(e);
  }
}
// 菜单服务
router.post('/', async (req, res) => {
  const data = req.body;
  console.info(data);
  fun();
  const result = { code: 0, data };
  res.json(result);
});


module.exports = router;
