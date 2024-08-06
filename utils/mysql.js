// 'use strict';
// const DB_HOST = '172.16.0.15';
// const DB_PORT = 3306;
// const DB_DATABASE = 'menu';
// const DB_USER = 'root';
// const DB_PASSWORD = '366351&huo';
// const pool = require('mysql2').createPool({
//   host: DB_HOST,
//   user: DB_USER,
//   port: DB_PORT,
//   password: DB_PASSWORD,
//   database: DB_DATABASE,
//   connectionLimit: 1
// });

// // 获取数据库连接的函数
// const connect = () => {
//   return new Promise((resolve, reject) => {
//       pool.getConnection((err, connection) => {
//           // 从连接池中获取连接
//           !err ? resolve(connection) : reject(err); // 若成功获取连接，返回连接对象，否则返回错误
//       });
//   });
// };

// // 需要传入sql语句和参数
// const query = (sql, params) => {
//   return new Promise((resolve, reject) => {
//      // 获取数据库连接
//       connect().then((connection) => {
//         connection.query(sql, params, (err, results) => {
//             // 执行 SQL 查询语句
//             !err ? resolve(results) : reject(err); // 若查询成功，返回查询结果，否则返回错误
//              connection.release(); // 释放连接
//         });
//       });
//   });
// };
// // 导出 connect 和 query 函数
// module.exports = { connect, query };
