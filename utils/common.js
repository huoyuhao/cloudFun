const dayjs = require('dayjs');
const _ = require('lodash');

const getUrlParam = (obj) => {
  let url = '';
  if (!obj) return url;
  Object.keys(obj).forEach((key) => {
    if (obj[key]) url += `&${key}=${obj[key]}`;
  });
  if (!url) return '';
  return url ? `?${url.slice(1)}` : '';
};
const toHump = (name) => {
  return name.replace(/_(\w)/g, (all, letter) => {
    return letter.toUpperCase();
  });
};
const transDataItem = (data) => {
  const obj = {};
  if (!_.isObject(data)) return data;
  Object.keys(data).forEach((key) => {
    // 将数据库时间进行格式化
    if (['created_time', 'modified_time'].includes(key)) {
      obj[toHump(key)] = dayjs(data[key]).format('YYYY-MM-DD HH:mm:ss');
    } else {
      obj[toHump(key)] = data[key];
    }
  });
  return obj;
};
// 数据转换 将下划线转换成驼峰
const transData = (data) => {
  if (_.isArray(data)) {
    return data.map((item) => transDataItem(item));
  }
  return transDataItem(data);
};
module.exports = {
  getUrlParam,
  transData,
  toHump
};
