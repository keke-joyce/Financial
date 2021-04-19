// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
const _=db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  var openId=event.openId;
  return await db.collection("user_list").where({openId}).update({
    data:{
      phone_number:_.set(event.phone_number)
    }
  })
  
}