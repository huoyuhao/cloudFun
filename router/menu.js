const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const { menuQuery } = require('../utils/mysql');

// 菜单服务
router.post('/', async (req, res) => {
  const data = req.body;
  console.info(data);
  menuQuery('SELECT * FROM `users`');
  const result = { code: 0, data };
  res.json(result);
});

module.exports = router;
