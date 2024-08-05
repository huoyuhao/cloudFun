const path = require('path');
const fs = require('fs');
const routers = (app) => {
  const currentDirPath = __dirname;
  const routes = fs.readdirSync(currentDirPath, 'utf-8');
  routes.forEach((item) => {
    if (item.indexOf('index') < 0) {
      const routerPath = path.join(currentDirPath, item);
      const route = require(routerPath);
      const [key] = item.split('.');
      app.use(`/api/${key}`, route);
    }
  });
};

module.exports = routers;
