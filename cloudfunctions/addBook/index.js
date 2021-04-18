// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var book = {
    name: event.name,
    user_id:event.user_id
  }
  return await db.collection('booklist').add({
    // data 字段表示需新增的 JSON 数据
    data:book,  
    success: function(res) {
      console.log(res)
    }
  })
}