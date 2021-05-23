// 云函数入口文件
const cloud = require('wx-server-sdk')

//获取账本条目
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  // var id=event.id;
  // return await db.collection('money_list').where(event).get({
  return await db.collection('money_list').aggregate()
    .lookup({
      from: 'classify_list',
      localField: 'classify_id',
      foreignField: 'cid',
      as: 'classify',
    }).match({
      book_id: event.book_id
    }).sort({
      time: -1
    })
    .end()

}