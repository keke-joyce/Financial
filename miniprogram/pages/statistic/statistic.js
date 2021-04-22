// pages/statistic/statistic.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTabIndex:0,
    array1:['1','2','3','4','5','6','7','8','9','10','11','12'],
    index:0,
    currentMonth:0,


  },

  onTabsItemTap:function(event){
    let index=event.currentTarget.dataset.index;
    console.log(event)
    this.setData({
      currentTabIndex:index
    })
   
  },
  bindPickerChange: function(e) {
    // this.getBookList()
    // const {array,index}=this.data;
    console.log('picker发送选择改变，携带值为', e.detail)
    this.setData({
      index: e.detail.value
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date=new Date();
    var month=date.getMonth()+1;
    this.setData({currentMonth:month})

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