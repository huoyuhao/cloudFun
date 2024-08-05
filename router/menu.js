const express = require('express');
const router = express.Router();

// 菜单服务
router.post('/', async (req, res) => {
  const data = req.body;
  console.info(data);
  const result = { code: 0, data };
  res.json(result);
});

module.exports = router;
