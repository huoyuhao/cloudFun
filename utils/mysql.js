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

const beginTransaction = (connection) => { // 開啟一個新交易事件
  return new Promise((resolve, reject) => {
    connection.beginTransaction((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};
const commitTransaction = (connection) => { // 完整的提交
  return new Promise((resolve, reject) => {
    connection.commit((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

const rollbackTransaction = (connection) => { // 失誤的話要滾動返回
  return new Promise((resolve) => {
    connection.rollback(() => {
      resolve();
    });
  });
};
const queryConnection = (connection, query) => { // 增加參數 connection的調用，後面方便使用query來寫SQL語句
  return new Promise((resolve, reject) => {
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
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
const getMenuTransaction = async () => {
  const connection = await getConnection(menuPool);

  await beginTransaction(connection);
  return {
    connection,
    queryConnection,
    commitTransaction,
    rollbackTransaction,
  };
};

module.exports = { menuQuery, marriageQuery, getMenuTransaction };
