// pages/demo3/demo3.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentMonth:''

  },

  getTest() {
const {currentMonth}=this.data;
    var bookId = wx.getStorageSync('book_id');
    wx.cloud.callFunction({
      name: 'test',
      data: {
        book_id: bookId,
        time:currentMonth
      }
    }).then(res => {
      console.log(res)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date=new Date();
    var year=date.getFullYear();
    var month=date.getMonth()+1;
    if(month<10){
      month=0+''+month;
    }
    console.log(year+'-'+month)
    this.setData({currentMonth:year+'-'+month})
    this.getTest()
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