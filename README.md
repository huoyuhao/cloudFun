# cloudFun
云函数

# 初始化配置

+ express 初始化
+ 接入eslint
+ 接入数据库
+ 加密访问 访问权限验证
+ 数据库访问封装 增删改 不同数据库的封装连接
+ 数据库表创建
+ 数据库事务 多个提交一个失败 全部回滚
+ 图片上传 获取链接
+ 接口封装 中间件 请求权限
+ 小程序 测试接口请求 上传文件 以及是否需要服务器部署前端
+ 注册小程序
+ 分析前后端页面分工

# 报错

引入axios Must use import to load ES Module
node版本比较低 axios需要通过commonjs方式引入
const axios = require('axios/dist/node/axios.cjs');

