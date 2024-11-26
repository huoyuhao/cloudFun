const schedule = require('node-schedule');
const { menuDb } = require('../utils/ali-mysql');

const initScheduleTask = () => {
  menuDb.insert('friend_browse')
    .column('openid', 'test')
    .column('operate_number', 3)
    .execute();
  // 每天凌晨3点30分30秒触发定时任务
  schedule.scheduleJob('10 30 * * * *', () => {
    console.log(`${new Date()} 定时任务开始。`);
    const dateTime = dayjs().format('HH:mm:ss')
    menuDb.insert('friend_browse')
      .column('openid', dateTime)
      .column('operate_number', 2)
      .execute();
    if (dateTime === '16:30:10') {
      // 统计
      menuDb.insert('friend_browse')
      .column('openid', dateTime)
      .column('operate_number', 1)
      .execute();
    }
  });
};

module.exports = {
  initScheduleTask,
};
