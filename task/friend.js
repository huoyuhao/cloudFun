const schedule = require('node-schedule');
const { menuDb } = require('../utils/ali-mysql');
const dayjs = require('dayjs');

const initHotNumber = async() => {
    // 获取近30天所有浏览数据
  const dateTime = dayjs().subtract(30, 'day').format('YYYY-MM-DD HH:mm:ss');
  const collectList = await menuDb.from('friend_browse').where('created_time', dateTime, 'ge').queryList();
  // 根据被浏览收藏数 计算hot数值 收藏为100 浏览单次为10 次数为1 累加计算
};
const initScheduleTask = () => {
  // 每天凌晨3点30分30秒触发定时任务
  schedule.scheduleJob('*/50 */55 * * * * *', () => {
    console.log(`${new Date()} 定时任务开始。`);
    const dateTime = dayjs().format('HH:mm:ss');
    menuDb.insert('friend_browse')
      .column('openid', dateTime)
      .column('operate_number', 2)
      .execute();
  });
};

module.exports = {
  initScheduleTask,
};
