const express = require('express');

import http from '../utils/request';
import { getUrlParam } from '../utils/common';

// eslint-disable-next-line new-cap
const router = express.Router();
// 获取列表
router.get('/login', async (req, res) => {
  const queryData = req.query;
  const { code } = queryData;
  // 通过appId code secret验证用户凭证
  const result = await new Promise((resolve) => {
    const api = 'https://api.weixin.qq.com/sns/jscode2session';
    const postData = {
      appid: 'wx252aafa23cc60538',
      secret: '00823c3fddcf5f94ff78146a38e5b479',
      // eslint-disable-next-line camelcase
      js_code: code,
      // eslint-disable-next-line camelcase
      grant_type: 'authorization_code',
    };
    const str = getUrlParam(postData);
    http
      .request({ url: `${api}${str}` })
      .then((res) => {
        console.log(111, res);
        resolve({ code: -1, data: res });
      })
      .catch((error) => {
        resolve(error);
      });
  });
  res.json(result);
});
module.exports = router;
