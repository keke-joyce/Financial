// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command;
const $ = db.command.aggregate;
// 云函数入口函数
exports.main = async (event, context) => {
  let {
    book_id,
    searchTitle
  } = event;
  db.collection('money_list').aggregate()
    // .match({
    //   book_id
    // })
   .match({
        detail: db.RegExp({
          regexp: searchTitle,
          option: 'i'
        }),
        book_id
      }
      )
    // .lookup({
    //   from: 'classify_list',
    //   localField: 'classify_id',
    //   foreignField: 'cid',
    //   as: 'classify',
    // })
    // .sort({
    //   time: -1
    // })
    .end()
}