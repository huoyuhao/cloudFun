const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

const database = require('scf-nodejs-serverlessdb-sdk').database
 
const fun = async () => {
  //use connection
  console.log('start connection mysql')
  const connection = await database('menu').connection()
  const result = await connection.queryAsync('select * from users')
  connection.release() //must release before return
  console.log('db2 query result:',result)
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
