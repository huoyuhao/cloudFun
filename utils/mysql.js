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
});// 事务性
const getConnection = (pool) => { // 單獨一個connect才可以用rollback
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject(error);
      } else {
        resolve(connection);
      }
    });
  });
};
// 封装单独sql执行函数 每次执行是一个单独的连接池连接 执行完成释放
const executeQuery = (pool, sql) => {
  return new Promise((resolve, reject) => {
    getConnection(pool).then((connection) => {
      connection.query(sql, (queryErr, results) => {
        connection.release();
        if (queryErr) {
          reject(queryErr);
        } else {
          resolve(results);
        }
      });
    });
  });
};

const menuQuery = (sql) => {
  return executeQuery(menuPool, sql);
};
const marriageQuery = (sql) => {
  return executeQuery(marriagePool, sql);
};

module.exports = { menuQuery, marriageQuery };
