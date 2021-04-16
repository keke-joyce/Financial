// pages/addmoney/addmoney.js
Page({

  /**
   * 页面的初始数据
   */
 
  data: {
    currentTabIndex:0,
    today:''
  },
  
  onTabsItemTap:function(event){
    let index=event.currentTarget.dataset.index;
    this.setData({
      currentTabIndex:index
    })
   
  },
  getTodayDate(){
    var date=new Date();
    var year=date.getFullYear();
    var month=date.getMonth()+1;
    var day=date.getDate();
    var time=year+'-'+month+'-'+day
    this.setData({today:time}) 
    
  },
  onEvent:function(e){
      // console.log(e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onEvent()
 
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