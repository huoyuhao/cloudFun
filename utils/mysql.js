const mysql = require('mysql');
const config = require('config');

// 引入mysql
const mysqlConfig = config.get('mysqlConfig');

// 新建数据库连接池
const menuPool = mysql.createPool({
  ...mysqlConfig,
  database: 'menu', // 数据库名称
});

// 新建数据库连接池
const marriagePool = mysql.createPool({
  ...mysqlConfig,
  database: 'marriage', // 数据库名称
});
// 封装sql执行函数
const executeQuery = (pool, sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }
      connection.query(sql, values, (queryErr, results) => {
        if (queryErr) {
          reject(queryErr);
        } else {
          resolve(results);
        }
      });
    });
  });
};
const menuQuery = (sql, values) => {
  return executeQuery(menuPool, sql, values);
};
const marriageQuery = (sql, values) => {
  return executeQuery(marriagePool, sql, values);
};

module.exports = { menuQuery, marriageQuery };
