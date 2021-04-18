// pages/myinfo/myinfo.js
// const app = getApp()
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // avatarUrl: '../../images/myinfo1.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    showAddModal: false,
    showBookModal:false,
    bookName:'',
  },

  getUserInf(){
    wx.getSetting({
      success: res => {
        console.log('用户',res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res)
              this.setData({
                // avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },
  // onLoad: function(options) {
  //   // if (!wx.cloud) {
  //     // wx.redirectTo({
  //     //   url: '../chooseLib/chooseLib',
  //     // })
  //     // return
  //   // }

  //   // 获取用户信息
  //  
  // },

  getBookList() {
    this.setData({showBookModal:true})
  },
  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },
  inputChange(e) {
    this.setData({bookName:e.detail.value})
    console.log(e)
  },

  addBook() {
    console.log('添加账本')
    this.setData({showAddModal:true})
    // wx.navigateTo({
    //   url: 'url',
    // })
  },
  /**
     * 隐藏模态对话框
     */
    hideModal: function () {
      this.setData({
        showAddModal: false,
        showBookModal:false
      });
    },
    /**
     * 对话框取消按钮点击事件
     */
    onCancel: function () {
      this.hideModal();
    },
    /**
     * 对话框确认按钮点击事件
     */
  onConfirm: function (e) {
    var {bookName} = this.data;
    var user_id = wx.getStorageSync('user_id');
    var bookinfo = {
      name: bookName,
      user_id,
    }
    wx.cloud.callFunction({
      name:'addBook',
      data:bookinfo
    }).then(res=>{
      console.log(res)  
      if (res.errMsg === "cloud.callFunction:ok") {
        this.hideModal();
      }
    })
    // db.collection('booklist').add(bookinfo).then(res => {
    //   console.log(res)
    // })

    console.log(user_id)
    console.log(bookName)
      // this.hideModal();
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInf()
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