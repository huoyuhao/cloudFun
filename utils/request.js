// axios请求
import axios from 'axios';

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
class Interceptors {
  instance;
  constructor() {
    this.instance = axios.create({
      baseURL: '/',
      timeout: 120 * 1000,
      withCredentials: true,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json;charset=utf-8',
      },
    });
    this.setupInterceptors();
  }
  // 初始化拦截器
  setupInterceptors() {
    // 请求接口拦截器
    this.instance.interceptors.request.use(
      (config) => {
        const { method } = config;
        let url = config.url || '';
        // 解决入参中文问题
        if (method === 'get') url = encodeURI(url);
        return { ...config, url };
      },
      () => {
        // 错误抛到业务代码
        const error = { data: { code: -1, msg: '服务器异常' } };
        return Promise.resolve(error);
      },
    );
    // 响应拦截器
    this.instance.interceptors.response.use(
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
  }
  // 返回一下
  getInterceptors() {
    return this.instance;
  }
}

// 请求配置
export class HttpServer {
  static axios;
  // 获取axios实例
  constructor() {
    HttpServer.axios = new Interceptors().getInterceptors();
  }
  // 简单封装一下方法
  request(config) {
    return new Promise((resolve, reject) => {
      HttpServer.axios(config)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

const http = new HttpServer();

export default http;
