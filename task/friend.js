const schedule = require('node-schedule');
const { menuDb } = require('../utils/ali-mysql');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Shanghai'); // 设置时区为上海，东八区，UTC + 8

const initHotNumber = async() => {
    // 获取近30天所有浏览数据
  const dateTime = dayjs().tz().subtract(30, 'day').format('YYYY-MM-DD HH:mm:ss');
  const collectList = await menuDb
    .select('*')
    .from('friend_browse')
    .where('created_time', dateTime, 'ge')
    .orderby('operate_user_id desc')
    .queryList();
  let id = 0;
  let hotNumber = 0;
  // 根据被浏览收藏数 计算hot数值 收藏为100 浏览单次为10 次数为1 累加计算
  collectList.forEach((item) => {
    if (item.operate_user_id !== id) {
      // 发现不同用户id 更新上一个用户id的hot值
      if (id > 0) {
        menuDb.update('friend_user')
          .column('hot_number', hotNumber)
          .where('id', id)
          .execute();
      }
      // 更新用户id和hot
      id = item.operate_user_id;
      hotNumber = 0;
    }
    if (item.operate_type === '浏览') {
      hotNumber += Math.min(item.operate_number, 30) + 10; // 浏览单次最多10次
    }
    if (item.operate_type === '收藏') {
      hotNumber += 100;
    }
  });
  if (id) {
    menuDb.update('friend_user')
      .column('hot_number', hotNumber)
      .where('id', id)
      .execute();
  }
};
const initScheduleTask = () => {
  // 存在问题 只能使用 */ 方式触发 时区是伦敦时区 需要 +8
  schedule.scheduleJob('*/60 */60 */8 * * *', () => {
    initHotNumber();
  });
};

module.exports = {
  initScheduleTask,
  initHotNumber,
};
