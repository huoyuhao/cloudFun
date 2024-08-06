'use strict';
const DB_HOST       = '172.16.0.15'
const DB_PORT       = 3306
const DB_DATABASE   = 'menu'
const DB_USER       = 'root'
const DB_PASSWORD   = '366351&huo'
const promisePool = require('mysql2').createPool({
  host              : DB_HOST,
  user              : DB_USER,
  port              : DB_PORT,
  password          : DB_PASSWORD,
  database          : DB_DATABASE,
  connectionLimit   : 1
}).promise();

exports.main_handler = async (event, context, callback) => {
  let result = await promisePool.query('select * from users');
  console.log(result);
}
