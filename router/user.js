const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
// 获取列表
router.get('/login', async (req, res) => {
  const queryData = req.query;
  const code = queryData.code;
  let data = [];
  console.log(code);
  // 通过appId code secret验证用户凭证
  const result = { code: 0, data };
  res.json(result);
});
module.exports = router;
