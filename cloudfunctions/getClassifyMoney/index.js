// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command;
const $ = db.command.aggregate;
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('money_list').aggregate().match({
    book_id: event.book_id,
    tid: event.tid
  }).group({
    _id: '$classify_id',
    totalMoney: $.sum('$money'),
  }).project({
    _id: true,
    totalMoney: true
  })
  .lookup({
    from: 'classify_list',
    let: {
      cid: '$_id',
      money: '$totalMoney'
    },
    pipeline: $.pipeline()
      .match(_.expr($.eq(['$cid', '$$cid'])))
      .group({
        _id: '$name'
      })
      .done(),
    as: 'classify'
  })
  .end()
}