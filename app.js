const express = require('express');
const config = require('config');
const path = require('path');
const bodyParser = require('body-parser');
const routes = require('./router/index.js');
const { initScheduleTask } = require('./task/friend.js');

const app = express();
const port = config.get('systemConfig.port');

// 请求主体大小限制
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// 解析请求入参
app.use(express.json());
app.use('/api/*', async (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type, Accept");
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
// api请求路由
routes(app);

// 初始化定时任务
initScheduleTask();

// 需要处理其他api请求没有匹配到路径的数据 返回404
app.use((req, res) => {
  res.status(404).json({ code: 404, msg: '没有找到接口' });
});
// 添加全局错误处理
app.use((err, req, res) => {
  res.status(500).json({ code: 500, msg: '内部错误' });
});

app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
