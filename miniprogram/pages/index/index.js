const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // dataObj:[]
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: true,
  },
  
  // bindGetUserInfo: function (e) {
  //   console.log(e.detail.userInfo)
  //   // console.log(this.data.canIUse)
  //   if (e.detail.userInfo) {
  //     //用户按了允许授权按钮
  //     //授权成功后，跳转进入小程序首页
  //     // wx.switchTab({
  //     //   url: '/pages/home/home'
  //     // })
  //   } else {
  //     //用户按了拒绝按钮
  //     wx.showModal({
  //       title: '警告',
  //       content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!',
  //       showCancel: false,
  //       confirmText: '返回授权',
  //       success: function (res) {
  //         if (res.confirm) {
  //           console.log('用户点击了“返回授权”')
  //         }
  //       }
  //     })
  //   }
  // },
  
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    console.log('12131312')
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log('user',res)
        wx.switchTab({
          url: '/pages/home/home'
        })
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    const that=this;
    // 判断是否授权
    // wx.getSetting({
    //   withSubscriptions: true,
    //   success(res){
    //     console.log(res)
        //如果成功了有authSetting就说明已经授权了
        // if(res.authSetting['scope.userInfo']){

          // 跳转到home页，然后调用login云函数，将用户信息存储到Storage
          // wx.switchTab({
          //   url: '/pages/home/home'
          // })
          // if (wx.getUserProfile) {
            // wx.switchTab({
            //   url: '/pages/home/home'
            // })
            // that.setData({
            //   canIUseGetUserProfile: false
            // })
          // }
          wx.cloud.callFunction({
            name: 'login',
            success: res => {
              console.log('callFunction test result: ', res)
              db.collection('user_list').where({openId:res.result.openid}).get({
                success:res=>{
                  if(res.data.length===0){
                  // 没有授权要执行的操作
                  // 没有授权就要把用户信息存到数据库
                    wx.cloud.callFunction({
                      name:'userInfoUp',
                      data:res.result
                    }).then(res=>{
                        // wx.switchTab({
                        //   url: '/pages/home/home'
                        // })
                        that.getUserProfile()
                      // console.log(res)   
                    })
                  }else{
                    wx.switchTab({
                      url: '/pages/home/home'
                    })

                  }
                }
              })
              wx.setStorage({
                data: res.result.openid,
                key: 'user_id',
              })
            }
        })
        // }else{
        //   // if (wx.getUserProfile) {
        //     wx.switchTab({
        //       url: '/pages/index/index'
        //     })
        //     that.setData({
        //       canIUseGetUserProfile: false
        //     })
          // }
          
        // }
        // console.log(res)
      // }
    // })
    
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