// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command;
const $ = db.command.aggregate;
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('money_list').aggregate().match({
    book_id: event.book_id
  }).group({
    _id: '$tid',
    totalMoney: $.sum('$money'),
  }).end()

}