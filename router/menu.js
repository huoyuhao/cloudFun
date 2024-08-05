const express = require('express');
const router = express.Router();

// 菜单服务
router.post(['/', '/*'], async (req, res) => {
  const { api, data } = req.body;
  const result = { code: 0, data: { api, data } };
  res.json(result);
});

module.exports = router;
