const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // dataObj:[]
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')

  },
  //查询数据
  // getData(){
  //   db.collection("demolist").get({
  //     success:res=>{
  //       console.log(res)
  //       this.setData({dataObj:res.data})
  //     }
  //   })
  //    console.log(123)
  // },
  // addData(){
  //   db.collection('demolist').add({
  //     data:{title:'可乐',
  //     money:3.8
  //   }
  //   }).then(res=>{
  //     console.log(res)
  //   })
  // },
  //提交表单添加数据进数据库
  // btnSubmit(res){
  //   var {title,time,money}=res.detail.value;
  //   // var resVlu=res.detail;
  //   db.collection('demolist').add({
  //     data:
  //     {
  //       title:title,
  //       time:time,
  //       money:money
  //     }
  //     // data:resVlu
  //   }).catch(res=>{
  //     console.log(res)
  //   })
  // },
  bindGetUserInfo: function (e) {
    console.log(e.detail.rawData)
    console.log(this.data.canIUse)
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      
      //授权成功后，跳转进入小程序首页
      wx.switchTab({
        url: '/pages/home/home'
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        console.log('res',res)
        if (res.authSetting['scope.userInfo']) {
          wx.switchTab({
            url: '/pages/home/home'
          })
          
        }else{
          wx.getUserInfo({
            success: function (res) {
              //从数据库获取用户信息
              //这里我使用queryUsreInfo函授获取信息，你要换成你的，或者不用
              //that.queryUsreInfo();
              //用户已经授权过
              wx.cloud.callFunction({
                name:'userInfoUp',
                data:res.userInfo
              }).then(res=>{
                console.log(res)   
              })
            }
          });
          
        }
      }
    })

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