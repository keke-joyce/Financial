// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command;
const $ = db.command.aggregate;
// 云函数入口函数
exports.main = async (event, context) => {
  const current_book = event.current_book;
  return await db.collection('money_list').aggregate()
    .match({ book_id: current_book })
    .lookup({
      from: 'classify_list',
      localField: 'classify_id',
      foreignField: 'cid',
      as: 'classify_list',
    })
    .end()
}
