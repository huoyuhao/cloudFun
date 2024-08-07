const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const { menuQuery, marriageQuery } = require('../utils/mysql');

// 菜单服务
router.post('/', async (req, res) => {
  const data = req.body;
  console.info(data);
  const list = await menuQuery('SELECT * FROM `users`');
  const result = { code: 0, data: list };
  res.json(result);
});

router.post('/a', async (req, res) => {
  const data = req.body;
  console.info(data);
  const list = await marriageQuery('SELECT * FROM `users`');
  const result = { code: 0, data: list };
  res.json(result);
});
module.exports = router;
