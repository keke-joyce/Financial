// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command;
const $ = db.command.aggregate;
// 云函数入口函数
exports.main = async (event, context) => {
  const {
    currentTime
  } = event;
  const date_time = currentTime.split('-');
  return await db.collection('money_list').aggregate()
    .project({
      book_id: true,
      money: true,
      time: true,
      tid: true,
      detail:true,
      classify_id: true,
      year: $.substr(['$time', 0, 4]),
      month: $.substr(['$time', 5, 2]),
    })
    .lookup({
      from: 'classify_list',
      localField: 'classify_id',
      foreignField: 'cid',
      as: 'classify',
    }).match({
      book_id: event.book_id,
      year: date_time[0],
      month: date_time[1]
    }).sort({
      time: -1
    })
    .end()
}