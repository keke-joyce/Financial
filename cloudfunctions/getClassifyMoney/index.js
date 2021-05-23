// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command;
const $ = db.command.aggregate;
// 云函数入口函数
exports.main = async (event, context) => {
  const {
    currentMonth
  } = event;
  const date_time = currentMonth.split('-');
  return await db.collection('money_list').aggregate().project({
    _id: true,
    book_id: true,
    money: true,
    time: true,
    tid: true,
    classify_id: true,
    year: $.substr(['$time', 0, 4]),
    month: $.substr(['$time', 5, 2]),
  }).match({
    book_id: event.book_id,
    tid: event.tid,
    year: date_time[0],
    month: date_time[1]
  })
    .group({
      _id: '$classify_id',
      // _id:'$time',
      totalMoney: $.sum('$money'),
    })
    .lookup({
      from: 'classify_list',
      let: {
        cid: '$_id',
        money: '$totalMoney'
      },
      pipeline: $.pipeline()
        .match(_.expr($.eq(['$cid', '$$cid'])))
        .group({
          _id: '$name',
          // totalMoney: $.sum('$money')
        })
        .done(),
      as: 'classify'
    })
    .end()
  // return await db.collection('money_list').get()

}