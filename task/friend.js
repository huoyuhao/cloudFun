const schedule = require('node-schedule');
const { menuDb } = require('../utils/ali-mysql');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

const cron = require('node-cron');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Shanghai'); // 设置时区为上海，东八区，UTC + 8

// const initHotNumber = async() => {
//     // 获取近30天所有浏览数据
//   const dateTime = dayjs().subtract(30, 'day').format('YYYY-MM-DD HH:mm:ss');
//   const collectList = await menuDb.from('friend_browse').where('created_time', dateTime, 'ge').queryList();
//   // 根据被浏览收藏数 计算hot数值 收藏为100 浏览单次为10 次数为1 累加计算
//   collectList.forEach((item) => {
    
//   })
// };
const initScheduleTask = () => {
  // 每天凌晨3点30分30秒触发定时任务
  schedule.scheduleJob('*/30 */52 */8 * * *', () => {
    const dateTime = dayjs().tz().format('HH:mm:ss');
    menuDb.insert('friend_browse')
      .column('openid', dateTime)
      .column('operate_number', 9)
      .execute();
  });
  cron.schedule('* */52 * * *', () => {
    menuDb.insert('friend_browse')
      .column('openid', dateTime)
      .column('operate_number', 10)
      .execute();
  });
};

module.exports = {
  initScheduleTask,
};
