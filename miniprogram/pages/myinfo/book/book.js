// pages/myinfo/book/book.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookList: [], //账本列表
    user_id: wx.getStorageSync('user_id'),
    showAddModal: false,

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
      wx.setStorageSync('book', res.data)
      that.setData({
        bookList: res.data
      })
    })
  },
  toFamilyNumber() {
    this.setData({
      showAddModal: true
    })
  },

  //隐藏模态对话框
  hideModal() {
    this.setData({
      showAddModal: false,
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
    this.getBookList()

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