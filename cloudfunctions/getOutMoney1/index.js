// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
const _=db.command;
const $ = db.command.aggregate;
// 云函数入口函数
exports.main = async (event, context) => {
  const bookId = event.bookId;
  return await db.collection('money_list').aggregate().match({
    book_id: bookId,
    tid: event.tid
  }).group({
    _id: '$classify_id',
    value: $.sum('$money'),
  }).end().then(res => {
    console.log(res)
  })
}