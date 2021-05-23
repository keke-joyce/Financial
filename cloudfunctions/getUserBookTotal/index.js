// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command;
const $ = db.command.aggregate;
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('total_money_list').aggregate()
    .match({
      _openid: event.user_id
    }).project({
      _id: true,
      book_id: true,
      income_total: true,
      spend_total: true,
      store_total: true
    }).lookup({
      from: 'booklist',
      let: {
        bid: '$book_id'
      },
      pipeline: $.pipeline()
        .match(_.expr($.eq(['$_id', '$$bid'])))
        .group({
          _id: '$name',

        })
        .done(),
      as: 'bookList',
    }).end()
}