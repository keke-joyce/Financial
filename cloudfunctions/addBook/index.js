// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
const _=db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  // var book = {
  //   name: event.name,
  //   user_id:event.user_id
  // }
  // return await db.collection("booklist").doc(_id).update({
  //   data:{
  //     user_id:_.push(event.user_id)
  //   }
  // })
  return await db.collection('booklist').add({
    // data 字段表示需新增的 JSON 数据
    data:  
    {
      name: event.name,
      user_id:[event.user_id]
    },
    success: function(res) {
      console.log(res)
    }
  })
}