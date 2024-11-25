import { isArray, isObject } from 'lodash';

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
  if (!isObject(data)) return data;
  Object.keys(data).forEach((key) => {
    obj[toHump(key)] = data[key];
  });
  return obj;
};
const transData = (data) => {
  if (isArray(data)) {
    return data.map((item) => transDataItem(item));
  }
  return transDataItem(data);
};
module.exports = {
  getUrlParam,
  transData
};
