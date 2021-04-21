// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var spendInfo = {
    book_id: event.book_id,
    classify_id:event.classify_id,
    detail:event.detail,
    money:event.money,
    tid:event.tid,
    time:event.time

  }
  return await db.collection('money_list').add({
    data:spendInfo,
    success: function(res) {
      console.log(res)
    }
  })
  
}