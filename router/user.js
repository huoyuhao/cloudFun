const express = require('express');
const config = require('config');
const request = require('../utils/request.js');
const { getUrlParam } = require('../utils/common.js');
const { menuDb } = require('../utils/ali-mysql');

// eslint-disable-next-line new-cap
const router = express.Router();
const miniConfig = config.get('mini');

// 获取列表
router.get('/login', async (req, res) => {
  const queryData = req.query;
  const { code } = queryData;
  if (!code) return { code: -1, msg: '用户信息为空' };
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
    request.get(`${api}${str}`)
      .then(async (res) => {
        const { openid } = res;
        // 生成token 用户后续请求验证实效性
        const trans = await menuDb.useTransaction();
        try {
          const result = await menuDb
          .select('*')
          .from('user')
          .where('openid', openid, 'eq')
          .queryRow();
          console.log(111, result);
        } catch (err) {
          await trans.rollback();
          res.json({ code: 300, msg: '用户创建失败', data: null });
        }
        resolve({ code: 0, data: openid });
      })
      .catch((error) => {
        resolve({ code: -1, msg: '获取用户信息失败', error });
      });
    // 查询用户是否存在
    // 判断是否注册 如果没有存储用户信息 后期更新用户头像、用户昵称
  });
  res.json(result);
});

module.exports = router;
