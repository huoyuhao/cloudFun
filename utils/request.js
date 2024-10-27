// axios请求
const axios = require('axios');

const showStatus = (status) => {
  let message = '';
  switch (status) {
    case 400:
      message = '请求错误400';
      break;
    case 401:
      message = '未授权，请重新登录401';
      break;
    case 403:
      message = '拒绝访问403';
      break;
    case 404:
      message = '请求出错404';
      break;
    case 408:
      message = '请求超时408';
      break;
    case 500:
      message = '服务器错误500';
      break;
    case 501:
      message = '服务未实现501';
      break;
    case 502:
      message = '网络错误502';
      break;
    case 503:
      message = '服务不可用503';
      break;
    case 504:
      message = '网络超时504';
      break;
    case 505:
      message = 'HTTP版本不受支持505';
      break;
    default:
      message = `连接出错${status}!`;
  }
  return `${message}，请检查网络或联系管理员！`;
};
const instance = axios.create({
  baseURL: '/',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json;charset=utf-8',
  },
});

// 拦截器
instance.interceptors.response.use(
  (response) => Promise.resolve(response.data),
  (error) => {
    const { status } = error.response || {};
    if (status < 200 || status >= 300) {
      // 处理http错误，抛到业务代码
      const msg = showStatus(status);
      return Promise.reject({ msg, code: Number(status), error });
    }
    const msg = error.message ? `接口访问失败，${error.message}` : '请求发送失败';
    return Promise.reject({ msg, code: -1, error });
  },
);

module.exports = instance;
