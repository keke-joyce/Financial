// pages/home/home.js
const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],
    array: ['账本1', '账本2'],
    index: 0,
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail)
    this.setData({
      index: e.detail.value
    })
  },
  getBookList(){
    
    // db.collection('book_list').doc().get()
  },
  getData(num=7,page=0){
    wx.cloud.callFunction({
      name:'demoGetlist',
      data:{
        num,
        page
      }
    }).then(res=>{
      var oldData=this.data.dataList;
      var newData=oldData.concat(res.result.data);
      this.setData({
        dataList:newData
      })
      // console.log(res.result.data)
    })
  },
  //点击增加
  clickRow(res){
    //1.获取点击的id和索引值
    //2.云函数进行更新操作
    //3.前端连后端，将数据传输给后端，后端再返回数据
    //4.重新渲染列表数据
    wx.showLoading({
      title:'数据加载中',
      mask:true
    })
    var {id,idx}=res.currentTarget.dataset;
    wx.cloud.callFunction({
      name:'demoUpList',
      data:{
        id:id
      }
    }).then(res=>{
      var newData=this.data.dataList;
      newData[idx].money+=1;
      this.setData({
        dataList:newData
      })
      wx.hideLoading({
        complete:(res)=>{}
      })
      // console.log(res)   
    })},
    // getLogin(){
    //   wx.cloud.callFunction({
    //     name: 'login',
    //     complete: res => {
    //       console.log('callFunction test result: ', res)
    //     }
    //   })
    // },

    toAdd(){
      wx.navigateTo({
        url: '../addmoney/addmoney',
      })
      // console.log(1111)
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
    this.getBookList()
    // this.getLogin()
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
    console.log(123)
    var page=this.data.dataList.length;
    this.getData(7,page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})