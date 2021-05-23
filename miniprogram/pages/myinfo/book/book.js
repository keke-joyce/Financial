// pages/myinfo/book/book.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookList: [], //账本列表
    user_id: wx.getStorageSync('user_id'),
    bookName: '',
    showAddModal: false,
    rowId: '',
    familyNumber: '',
    showFamilyModal: false,
    showFamilyListModel: false,
    familyList: [],
    showCopyModal: false,

    vtabs: [],
    activeTab: 0,
    fileUrl: '',//文件地址
    currentBookId: '',//当前账本id
    // totalList: {}

  },

  getBookTotalMoney() {
    let { currentBookId, bookList } = this.data;
    console.log('**', bookList)
    const that = this;
    db.collection("total_money_list").where({ book_id: currentBookId }).get().then(res => {
      console.log(res.data)
      if (res.data.length > 0) {
        that.setData({
          totalList: res.data[0]
        })
      } else {
        that.setData({
          totalList: {
            income_total: 0,
            spend_total: 0,
            store_total: 0
          }
        })
      }
    })
  },

  async toDownload() {
    const that = this;
    // this.setData({
    //   showCopyModal: true
    // })
    // this.getMoneyList()
    let { activeTab } = this.data;
    let current_book = wx.getStorageSync('book')[activeTab]._id;
    let resultList = await Promise.all([
      db.collection('booklist').where({ _id: current_book }).get(),
      wx.cloud.callFunction({
        name: 'getMoneyClassify',
        data: {
          current_book
        }
      })
    ]);
    let twoArray = resultList[1].result.list;
    let { name, user_id } = resultList[0].data[0];
    let targetArr = []
    twoArray.forEach((el, index) => {
      el[index] = { name, user_id, ...el }
      targetArr.push(el[index])
    })
    that.saveExcel(targetArr)
  },

  //把数据保存到excel里，并把excel保存到云存储
  saveExcel(moneyList) {
    let that = this;
    wx.cloud.callFunction({
      name: "getExcel",
      data: {
        moneyList: moneyList
      },
      success(res) {
        console.log("保存成功", res)
        that.getFileUrl(res.result.fileID)

      },
      fail(res) {
        console.log("保存失败", res)
      }
    })
  },

  //获取云存储文件下载地址，这个地址有效期一天
  getFileUrl(fileID) {
    let that = this;
    wx.cloud.getTempFileURL({
      fileList: [fileID],
      success: res => {
        // get temp file URL
        console.log("文件下载链接", res.fileList[0].tempFileURL)
        that.setData({
          fileUrl: res.fileList[0].tempFileURL,
          showCopyModal: true
        })
      },
      fail: err => {
        // handle error
      }
    })
  },
  //复制excel文件下载链接
  copyFileUrl() {
    let that = this
    wx.setClipboardData({
      data: that.data.fileUrl,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log("复制成功", res.data) // data
            that.setData({ showCopyModal: false })
          }
        })
      }
    })
  },

  onTabClick(e) {
    const index = e.detail.index;
    const that = this;
    let { bookList } = this.data;
    console.log(bookList[index])
    this.setData({ activeTab: index, currentBookId: bookList[index]._id })
    db.collection("total_money_list").where({ book_id: bookList[index]._id }).get().then(res => {
      console.log(res.data)
      if (res.data.length > 0) {
        that.setData({
          totalList: res.data[0]
        })
      } else {
        that.setData({
          totalList: {
            income_total: 0,
            spend_total: 0,
            store_total: 0
          }
        })
      }
    })
  },

  toFamilyList(e) {
    this.setData({
      showFamilyListModel: true,
      rowId: e.target.dataset.id
    })
  },
  // 解除家庭成员绑定
  delFamily(e) {
    let rowId = this.data;
    console.log(e.target.dataset.id)
    wx.cloud.callFunction({
      name: 'delFamily',
      data: {
        _id: rowId,
        userId: e.target.dataset.id
      }
    }).then(res => {
      console.log(res)
    })

  },
  // 账本输入改变
  inputChange(e) {
    this.setData({
      familyNumber: e.detail.value
    })
  },
  // 添加账本输入框
  onChange(e) {
    this.setData({
      bookName: e.detail.value
    })
  },
  // 删除账本
  delBook(e) {
    const that = this;
    var delId = e.target.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确认删除该账本？',
      success(res) {
        if (res.confirm) {
          db.collection('booklist').doc(delId).remove({
            success: res => {
              that.getBookList()
              wx.showToast({
                title: '删除成功',
              })
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '删除失败',
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  // 添加账本
  addBook() {
    console.log('添加账本')
    this.setData({
      showAddModal: true
    })
  },
  //获取当前用户的账本列表
  getBookList() {
    var {
      user_id
    } = this.data;
    this.setData({
      showBookModal: true
    })
    const that = this;
    db.collection('booklist').where({
      user_id
    }).get().then(res => {
      console.log(res.data)
      // const arr=[]
      // res.data.forEach(el=>{
      //   arr.push(el.name)
      // })
      // if(res.data)
      // 获取账本列表
      // 显示已绑定的用户手机0

      wx.setStorageSync('book', res.data)
      that.setData({
        bookList: res.data,
        familyList: res.data.user_id,
        currentBookId: res.data[0]._id
      })
      that.getBookTotalMoney()
    })

  },

  toFamilyNumber(e) {
    console.log(e.target.dataset.id)
    this.setData({
      showFamilyModal: true,
      rowId: e.target.dataset.id
    })
  },
  // 绑定手机号的确认
  onSubmit() {
    var {
      familyNumber,
      rowId
    } = this.data;
    if (familyNumber == "") {
      wx.showToast({
        title: '电话号码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    // 1.先通过手机号查询到被绑定用户的openId
    db.collection('user_list').where({
      phone_number: familyNumber
    }).get({
      success: res => {
        let userId = res.data[0].openId;
        db.collection('booklist').where({
          _id: rowId
        }).get().then(response => {
          let userList = response.data[0].user_id;
          // 判断该账本是否已经绑定了该家庭成员
          if (userList.indexOf(userId) === -1) {
            // 不存在时执行
            // 2.将openId传入此账本的user_id数组中
            wx.cloud.callFunction({
              name: 'bindFamily',
              data: {
                _id: rowId,
                user_id: res.data[0].openId
              }
            }).then(res => {
              if (res.errMsg === "cloud.callFunction:ok") {
                wx.showToast({
                  title: '绑定成功',
                  icon: 'none',
                  duration: 1000
                })
                this.getBookList();
                this.hideModal();
                this.setData({
                  familyState: true
                })
              }
            })

          } else {
            // 存在时执行
            wx.showToast({
              title: '该成员已存在',
              icon: 'none',
              duration: 1000
            })
          }
        })
      }
    })
  },
  //隐藏模态对话框
  hideModal() {
    this.setData({
      showAddModal: false,
      showFamilyModal: false,
      showFamilyListModel: false,
      showCopyModal: false
      // showBookModal:false,
      // showPhoneModal:false
    });
  },

  //对话框确认按钮点击事件
  onConfirm(e) {
    var {
      bookName
    } = this.data;
    var user_id = wx.getStorageSync('user_id');
    var bookinfo = {
      name: bookName,
      user_id,
    }
    if (bookName == "") {
      wx.showToast({
        title: '账本名不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    wx.cloud.callFunction({
      name: 'addBook',
      data: bookinfo
    }).then(res => {
      if (res.errMsg === "cloud.callFunction:ok") {
        this.hideModal();
        this.getBookList()
      }
    })
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel() {
    this.hideModal();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // const titles = ['热搜推荐', '手机数码', '家用电器',
    //   '生鲜果蔬', '酒水饮料', '生活美食',
    //   '美妆护肤', '个护清洁', '女装内衣',
    //   '男装内衣', '鞋靴箱包', '运动户外',
    //   '生活充值', '母婴童装', '玩具乐器',
    //   '家居建材', '计生情趣', '医药保健',
    //   '时尚钟表', '珠宝饰品', '礼品鲜花',
    //   '图书音像', '房产', '电脑办公']
    // const vtabs = titles.map(item => ({ title: item }))
    // this.setData({ vtabs })
    this.getBookList();
    // this.getBookTotalMoney();
    // this.getMoneyList();

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})