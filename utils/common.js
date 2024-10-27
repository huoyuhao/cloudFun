export const getUrlParam = (obj) => {
  let url = '';
  if (!obj) return url;
  Object.keys(obj).forEach((key) => {
    if (obj[key]) url += `&${key}=${obj[key]}`;
  });
  if (!url) return '';
  return url ? `?${url.slice(1)}` : '';
};
