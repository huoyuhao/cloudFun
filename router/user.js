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
    request.get(`${api}${str}`).then(async (res) => {
      const { openid } = res;
      // 查询用户是否存在
      const result = await menuDb.select('*').from('user').where('openid', openid, 'eq').queryRow();
      if (!result) {
        await menuDb.insert("user").column("user_img", openid).execute();
        const trans = await menuDb.useTransaction();
        try {
          // 存储用户信息
          await trans.insert("user").column("openid", openid).execute();
          await trans.commit();
          resolve({ code: 0, data: openid });
        } catch (err) {
          await trans.rollback();
          throw '用户注册失败';
        }
      }
    })
    .catch((error) => {
      resolve({ code: -1, msg: '用户登录失败', error });
    });
    // 判断是否注册 如果没有存储用户信息 后期更新用户头像、用户昵称
  });
  res.json(result);
});

module.exports = router;
