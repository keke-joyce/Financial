// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'joyce-7g03meob166001a1'
})

// const db = cloud.database()
const xlsx = require('./node_modules/node-xlsx');
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    let { moneyList } = event;

    //1,定义excel表格名
    let dataCVS = moneyList[0].name + '.xlsx'
    //2，定义存储数据的
    let alldata = [];
    let row = ['id', '账本名', '详情', '分类', '金额', '收支类型']; //表属性
    alldata.push(row);

    for (let key in moneyList) {
      let arr = [];
      arr.push(moneyList[key]._id);
      arr.push(moneyList[key].name);
      arr.push(moneyList[key].detail);
      arr.push(moneyList[key].classify_list[0].name);
      arr.push(moneyList[key].money);
      if (moneyList[key].tid === 1) {
        arr.push('支出')
      } else if (moneyList[key].tid === 2) {
        arr.push('收入')
      }
      alldata.push(arr)
    }
    //3，把数据保存到excel里
    var buffer = await xlsx.build([{
      name: "mySheetName",
      data: alldata
    }]);
    //4，把excel文件保存到云存储里
    return await cloud.uploadFile({
      cloudPath: dataCVS,
      fileContent: buffer, //excel二进制文件
    })

  } catch (e) {
    console.error(e)
    return e
  }

}