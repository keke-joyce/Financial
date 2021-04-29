// pages/home/home.js
// 方法**代表有问题总结，++表示已完成
const db = wx.cloud.database()
const _ = db.command;
const $ = db.command.aggregate;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [], //数据列表
    array1: [], //账本名字列表
    array: [], //账本名字列表
    index: 0,
    spendMoney: 0, //总支出
    incomeMoney: 0, //总收入
    storeMoney: 0,
    classifyList: wx.getStorageSync('classifyList'),
    classifyList1: wx.getStorageSync('classifyList1'),
    classify: [],
    // timeArray:['01','02','03','04','05','06','07','08','09','10','11','12'],
    // index:0,
    currentTime: '', //当前年月
    year: '',
    month: '',
    book_id: wx.getStorageSync('book_id'),
    searchTitle: '',

  },
  searchInput(e) {
    console.log(e.detail.value)
    this.setData({
      searchTitle: e.detail.value
    });
  },
  //搜索
  toSearch() {
    const {
      searchTitle,
      book_id
    } = this.data;
    const that = this;
    console.log(searchTitle)
    if (searchTitle) {
      wx.cloud.callFunction({
        name: 'searchMoney',
        data: {
          book_id,
          searchTitle
        }
      }).then(res => {
        that.setData({
          dataList: res.date
        })
      })
      // db.collection('money_list').aggregate()
      //   .match({
      //     book_id
      //   })
      //   .lookup({
      //     from: 'classify_list',
      //     localField: 'classify_id',
      //     foreignField: 'cid',
      //     as: 'classify',
      //   }).match(_.or([{
      //       detail: db.RegExp({
      //         regexp: searchTitle,
      //         option: 'i'
      //       })
      //     },
      //     {
      //       money: db.RegExp({
      //         regexp: searchTitle,
      //         option: 'i'
      //       })
      //     },
      //   ])).sort({
      //     time: -1
      //   })
      // .end()

      //     db.collection('money_list').aggregate()
      //   .lookup({
      //     from: 'classify_list',
      //     localField: 'classify_id',
      //     foreignField: 'cid',
      //     as: 'classify',
      //   }).match(_.or([{
      //     detail: db.RegExp({
      //       regexp: searchTitle,
      //       option: 'i'
      //     })
      //   },
      //   {
      //     money: db.RegExp({
      //       regexp: searchTitle,
      //       option: 'i'
      //     })
      //   },
      // ])).sort({time:-1})
      //   .end()
      // db.collection('money_list').where(_.or([{
      //     detail: db.RegExp({
      //       regexp: searchTitle,
      //       option: 'i'
      //     })
      //   },
      //   {
      //     money: db.RegExp({
      //       regexp: searchTitle,
      //       option: 'i'
      //     })
      //   },
      // ])).get()
      // .then(res => {
      //   this.setData({
      //     dataList: res.data
      //   })
      //   console.log(res)
      // })
    } else {
      this.getAllData();
    }

  },
  // 年月选择时触发的方法
  bindTimeChange(e) {
    // console.log(e.detail.value)
    let timeArr = e.detail.value.split('-');

    // console.log(timeArr)
    this.setData({
      currentTime: e.detail.value,
      year: timeArr[0],
      month: timeArr[1]
    })
    // 获取当月的收支信息
    this.getMonthData();
    this.getTotalMoney();
    // this.getTotal();


  },
  //时间选择获取本月的收支条目
  getMonthData() {
    const {
      currentTime
    } = this.data;
    var book_id = wx.getStorageSync('book_id');
    wx.cloud.callFunction({
      name: 'getMonthData',
      data: {
        currentTime,
        book_id
      }
    }).then(res => {
      this.setData({
        dataList: res.result.list
      })
    })
  },
  // 获取账本当月的总收支结余信息
  getTotalMoney() {
    var {
      // book_id,
      currentTime
    } = this.data;
    var book_id = wx.getStorageSync('book_id');


    const that = this;
    console.log(book_id, currentTime)
    wx.cloud.callFunction({
      name: 'addTotalMoney',
      data: {
        book_id,
        time: currentTime,
      }
    }).then(res => {
      console.log(res.result.list)
      let moneyList = res.result.list;
      console.log(moneyList)
      let income_total = 0;
      let spend_total = 0;
      let store_total = 0;
      if (moneyList.length) {
        moneyList.forEach(el => {
          if (el._id === 2) {
            income_total = el.outTotalMoney;
          } else {
            spend_total = el.outTotalMoney;
          }
        })
        store_total = income_total - spend_total;
        that.setData({
          incomeMoney: income_total,
          spendMoney: spend_total,
          storeMoney: store_total
        })
      } else {
        that.setData({
          incomeMoney: income_total,
          spendMoney: spend_total,
          storeMoney: store_total
        })

      }
    })
  },
  // 获取账本总的收支并存入数据库
  getTotal() {
    // const {
    //   book_id
    // } = this.data;
    var book_id = wx.getStorageSync('book_id');

    db.collection('money_list')
      .aggregate()
      .match({
        book_id,
      })
      .group({
        // 按 category 字段分组
        _id: '$tid',
        // 每组有一个 avgSales 字段，其值是组内所有记录的 sales 字段的平均值
        totalMoney: $.sum('$money')
      })
      .end().then(res => {
        let totalMoneyList = res.list;
        let income_total = 0;
        let spend_total = 0;
        let store_total = 0;
        if (totalMoneyList.length) {
          totalMoneyList.forEach(el => {
            if (el._id === 2) {
              income_total = el.totalMoney;
            } else {
              spend_total = el.totalMoney;
            }
          })
          store_total = income_total - spend_total;
        }
        db.collection('total_money_list').where({
          book_id
        }).get().then(res => {
          console.log(res.data.length !== 1)
          if (res.data.length !== 1) {
            db.collection('total_money_list').add({
              data: {
                book_id,
                income_total,
                spend_total,
                store_total
              }
            }).then(res => {
              console.log(res)
            })
          } else {
            db.collection('total_money_list').doc(res.data[0]._id).update({
              data: {
                book_id,
                income_total: _.set(income_total),
                spend_total: _.set(spend_total),
                store_total: _.set(store_total)
              }
            }).then(res => {
              console.log(res)
            })
          }
        })

      })

  },
  bindPickerChange: function (e) {
    // this.getBookList()
    const {
      array,
      index
    } = this.data;
    console.log('picker发送选择改变，携带值为', e.detail)
    this.setData({
      index: e.detail.value
    })
    // 切换账本
    // 获取切换的账本的id
    console.log(index)
    var book_id = array[e.detail.value]._id;
    console.log(book_id);
    // 将账本的id存到storage中
    wx.setStorageSync('book_id', book_id);
    this.getAllData();
    this.getTotalMoney();
  },
  //获取当前用户的账本列表**++
  getBookList() {
    // ******问题：在成功回调函数中使用this，this指向的是箭头函数的this指向包裹它的外层函数的this，而不是全局page的this
    // 要想指向全局page的this来更改data，就需要提前声明一个中间变量来指向全局this
    const that = this;
    var user_id = wx.getStorageSync('user_id')
    db.collection('booklist').where({
      user_id
    }).get().then(res => {
      console.log(res.data)
      wx.setStorageSync('book', res.data)
      const arr = []
      res.data.forEach(el => {
        arr.push(el.name)
      })
      that.setData({
        array: res.data,
        array1: arr
      })
    })
    this.getAllData()
  },
  // 获取当前账本的数据++
  // 已优化缩减代码，数据库查询操作进行了数据拼接输出
  getAllData() {
    const that = this;
    // 调用云函数根据账本id去获取收支数据
    var book_id = wx.getStorageSync('book_id');
    wx.cloud.callFunction({
      name: 'getBookInfo',
      data: {
        book_id
      }
    }).then(res => {
      console.log(res)
      that.setData({
        dataList: res.result.list
      })
    })
  },
  //点击增加
  clickRow(res) {
    //1.获取点击的id和索引值
    //2.云函数进行更新操作
    //3.前端连后端，将数据传输给后端，后端再返回数据
    //4.重新渲染列表数据
    wx.showLoading({
      title: '数据加载中',
      mask: true
    })
    var {
      id,
      idx
    } = res.currentTarget.dataset;
    wx.cloud.callFunction({
      name: 'demoUpList',
      data: {
        id: id
      }
    }).then(res => {
      var newData = this.data.dataList;
      newData[idx].money += 1;
      this.setData({
        dataList: newData
      })
      wx.hideLoading({
        complete: (res) => {}
      })
    })
  },

  toAdd() {
    var {
      array,
      index
    } = this.data;
    wx.setStorageSync('current_book', array[index]);
    wx.navigateTo({
      url: '../addmoney/addmoney',
    })
  },
  getCurrentTime() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if (month < 10) {
      month = 0 + '' + month;
    }
    console.log(year + '-' + month)
    this.setData({
      currentTime: year + '-' + month,
      year,
      month
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCurrentTime();
    this.getBookList();
    this.getTotalMoney();
    this.getTotal();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.getData()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // console.log(123)
    // var page=this.data.dataList.length;
    // this.getData(7,page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})