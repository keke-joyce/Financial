// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command;
const $ = db.command.aggregate;
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('money_list').aggregate().lookup({
    from: 'classify_list', //要关联的表student
    localField: 'classify_id', //class表中的关联字段
    foreignField: 'cid', //student表中关联字段
    // pipeline: $.pipeline()
    // .group({
    //   _id: '$classify_id',
    //   value: $.sum('$money'),
    // })
    // .done(),
    as: 'mon'
  })
  .match({
    book_id: event.book_id,
    tid: event.tid
  }).end()
}