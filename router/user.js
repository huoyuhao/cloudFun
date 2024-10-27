const express = require('express');
const config = require('config');
const http = require('../utils/request.js');
const { getUrlParam } = require('../utils/common.js');

// eslint-disable-next-line new-cap
const router = express.Router();
const miniConfig = config.get('mini');

// 获取列表
router.get('/login', async (req, res) => {
  const queryData = req.query;
  const { code } = queryData;
  console.log('code', code);
  // 通过appId code secret验证用户凭证
  const result = await new Promise((resolve) => {
    const api = 'https://api.weixin.qq.com/sns/jscode2session';
    const postData = {
      appid: miniConfig.appid,
      secret: miniConfig.secret,
      // eslint-disable-next-line camelcase
      js_code: code,
      // eslint-disable-next-line camelcase
      grant_type: 'authorization_code',
    };
    const str = getUrlParam(postData);
    // http
    //   .request({ url: `${api}${str}` })
    //   .then((res) => {
    //     console.log(111, res);
        resolve({ code: -1, data: postData });
    //   })
    //   .catch((error) => {
    //     resolve(error);
    //   });
  });
  res.json(result);
});
module.exports = router;
