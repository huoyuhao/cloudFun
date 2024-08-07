const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

// const mysql = require('mysql2');
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
// fun();
// 菜单服务
router.post('/', async (req, res) => {
  const data = req.body;
  console.info(data);
  const result = { code: 0, data };
  res.json(result);
});
module.exports = router;
