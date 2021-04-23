// 云函数入口文件
const cloud = require('wx-server-sdk')

//获取账本条目
cloud.init()
const db=cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  // var id=event.id;
  // return await db.collection('money_list').where(event).get({
    return await db.collection('money_list').orderBy('time','desc').where({book_id:event.book_id}).get({      
    success:function(res){
      console.log(res)
    }
  })
 
}