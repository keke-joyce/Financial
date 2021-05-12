// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command;
const $ = db.command.aggregate;
// 云函数入口函数
exports.main = async (event, context) => {
  const {
    time
  } = event;
  const date_time = time.split('-');
  // return await db.collection('money_list').aggregate()
  //   .project({
  //     book_id: true,
  //     money: true,
  //     time: true,
  //     tid: true,
  //     classify_id: true,
  //     year: $.substr(['$time', 0, 4]),
  //     month: $.substr(['$time', 5, 2]),
  //   }).match({
  //     book_id: event.book_id,
  //     year: date_time[0],
  //     month: date_time[1]
  //   })
  //   .group({
  //     _id: '$tid',
  //     outTotalMoney: $.sum('$money'),
  //   })
  //   .end()

    // return await db.collection('booklist').aggregate()
    // //  .project({
    // //   user_id:true,
    // //   book_id: true,
    // //   money: true,
    // //    time: true,
    // //   tid: true,
    // //   // classify_id: true,
    // //   year: $.substr(['$time', 0, 4]),
    // //   // month: $.substr(['$time', 5, 2]),
    // //  })
    //   .lookup({
    //   from: 'money_list',
    //   localField: '_id',
    //   foreignField: 'book_id',
    //   as: 'hh',
    // }).match({
    //   user_id:event.user_id,
    //   // book_id: event.book_id,
    //   year: date_time[0],
    //   month: date_time[1]
    // })
    // .group({
    //   _id: '$tid',
    //   outTotalMoney: $.sum('$money'),
    // })
    // .end()
  
  // return await db.collection('booklist').aggregate()
  //   .match({
  //     user_id: event.user_id
  //   })
  //   .lookup({
  //     from: 'money_list',
  //     // let: {
  //     //   order_book: '$book',
  //     //   order_quantity: '$quantity'
  //     // },
  //     pipeline: $.pipeline()
  //       .match({
  //         book_id:event.book_id
  //       })
  //       .project({
  //         book_id: true,
  //         money: true,
  //         time: true,
  //         tid: true,
  //         classify_id: true,
  //         year: $.substr(['$time', 0, 4]),
  //         month: $.substr(['$time', 5, 2]),
  //       }).match({
  //         year: date_time[0],
  //       })
  //        .group({
  //         _id: '$tid',
  //         yearTotalMoney: $.sum('$money'),
  //         })
  //       .done(),
  //     as: 'bookList',
  //   })
  //   .end()
    return await db.collection('booklist').aggregate()
    .match({
      user_id: event.user_id
    })
     .project({
      _id: true,
      name: true,
      user_id: true,      
    })
    .lookup({
      from: 'money_list',   
      let: {
      bid: '$_id'
    },
    pipeline: $.pipeline()
      .match(_.expr($.eq(['$book_id', '$$bid'])))
      .group({
        _id: '$tid',
        bookTotalMoney: $.sum('$money'),
      })
      .done(),
      as: 'bookList',
    })
    .end()
}