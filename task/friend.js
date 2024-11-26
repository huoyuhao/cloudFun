const schedule = require('node-schedule');
const { menuDb } = require('../utils/ali-mysql');

const initScheduleTask = () => {
  // 每天凌晨3点30分30秒触发定时任务
  schedule.scheduleJob('* 10 * * * *', () => {
    console.log(`${new Date()} 定时任务开始。`);
    const dateTime = dayjs().format('HH:mm:ss')
    if (dateTime === '16:10:00') {
      menuDb.insert('friend_browse')
        .column('openid', 'test')
        .column('operate_number', 1)
        .execute();
    }
  });
};

module.exports = {
  initScheduleTask,
};
