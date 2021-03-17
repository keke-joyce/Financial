const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataObj:[]
  },
  //查询数据
  getData(){
    db.collection("demolist").get({
      success:res=>{
        console.log(res)
        this.setData({dataObj:res.data})
      }
    })
     console.log(123)
  },
  addData(){
    db.collection('demolist').add({
      data:{title:'可乐',
      money:3.8
    }
    }).then(res=>{
      console.log(res)
    })
  },
  //提交表单添加数据进数据库
  btnSubmit(res){
    var {title,time,money}=res.detail.value;
    // var resVlu=res.detail;
    db.collection('demolist').add({
      data:
      {
        title:title,
        time:time,
        money:money
      }
      // data:resVlu
    }).catch(res=>{
      console.log(res)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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