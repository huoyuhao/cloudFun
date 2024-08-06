const express = require('express');
const { main_handler } = require('../utils/mysql');

const router = express.Router();
// 菜单服务
router.post('/', async (req, res) => {
  const data = req.body;
  console.info(data);
  const result = { code: 0, data };
  res.json(result);
});

// 菜单服务
router.post('/test', async (req, res) => {
  const data = req.body;
  console.info(data);
  main_handler();
  const result = { code: 0, data };
  res.json(result);
});
module.exports = router;
