// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command;
const $ = db.command.aggregate;
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('money_list').aggregate()
    .project({
      book_id: true,
      money: true,
      time: true,
      tid: true,
      classify_id: true,
      year: $.substr(['$time', 0, 4]),
      month: $.substr(['$time', 5, 2]),
    })
    .match({
      book_id: event.book_id,
      year: event.year,

    })
    .group({
      _id: '$year',
      yearTotalMoney: $.sum('$money'),
    })
    .sort({
      _id: -1
    })
    .end()
}