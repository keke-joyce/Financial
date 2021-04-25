// pages/myinfo/myinfo.js
// const app = getApp()
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    showAddModal: false,
    phoneNumber: '',
    user_id: wx.getStorageSync('user_id'),
    showPhoneModal: false,
  },
  //导出数据
  toDownload() {

  },
  
  // 跳转到分类管理
  toClassifyList() {
    wx.navigateTo({
      url: '../myinfo/classify/classify',
    })
  },
  // 跳转到关于我们
  toOurs() {
    wx.navigateTo({
      url: '../myinfo/ours/ours',
    })
  },
  // 跳转到账本管理
  toBookList() {
    wx.navigateTo({
      url: '../myinfo/book/book',
    })
  },
  // 获取用户信息
  getUserInf() {
    wx.getSetting({
      success: res => {
        console.log('用户', res)
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
  // 获取当前用户手机号
  getPhoneNumber() {
    var {
      user_id
    } = this.data;
    const that = this;
    console.log(user_id)
    db.collection("user_list").where({
      openId: user_id
    }).get().then(res => {
      console.log(res.data[0].phone_number)
      that.setData({
        phoneNumber: res.data[0].phone_number
      })
    })
  },
  // 输入手机号
  inputNumber(e) {
    this.setData({
      phoneNumber: e.detail.value
    })
    console.log(e)
  },
  // 绑定手机号
  bindPhone() {
    this.setData({
      showPhoneModal: true
    })
  },
  // 用户绑定手机号提交
  onCommitNumber() {
    var {
      user_id,
      phoneNumber
    } = this.data;
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (phoneNumber == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(phoneNumber)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    wx.cloud.callFunction({
      name: 'bindPhone',
      data: {
        openId: user_id,
        phone_number: phoneNumber
      }
    }).then(res => {
      if (res.errMsg === "cloud.callFunction:ok") {
        this.hideModal();
      }
      console.log(res)
    })

  },
  //获取用户信息
  onGetUserInfo: function (e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },
  // 隐藏模态对话框
  hideModal: function () {
    this.setData({
      showPhoneModal: false
    });
  },
  //对话框取消按钮点击事件
  onCancel: function () {
    this.hideModal();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInf();
    this.getPhoneNumber();
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