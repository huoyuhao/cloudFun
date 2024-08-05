const express = require('express');
const config = require('config');
const path = require('path');
const bodyParser = require('body-parser');
const routes = require('./router/index.js');

const app = express();
const port = config.get('systemConfig.port');

// 请求主体大小限制
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// 解析请求入参
// app.use(express.json());

app.use('/api/*', async (req, res, next) => {
  // res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With');
  res.setHeader('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  next();
});
// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
// checkHealth
app.get('/checkHealth', (req, res) => {
  res.json({ code: 0, data: `服务端口${port}检测正常!` });
});

// Error handler
// app.use((err, req, res) => {
//   console.error(res, err);
//   res.status(500).send('Internal Serverless Error');
// });

// api请求路由
routes(app);

app.listen(port, () => {
  console.log(`App started on port ${port}`);
});