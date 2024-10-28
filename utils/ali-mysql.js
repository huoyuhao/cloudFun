const DbClient = require('ali-mysql-client');
const config = require('config');

// 引入mysql
const mysqlConfig = config.get('mysqlConfig');
// 初始化
const menuDb = new DbClient({
  ...mysqlConfig,
  database: 'menu', // 数据库名称
});

module.exports = {
  menuDb,
};
