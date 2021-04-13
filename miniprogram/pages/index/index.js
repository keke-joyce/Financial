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
    canIUseGetUserProfile: false,
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
    console.log(e.detail.userInfo)
    // console.log(this.data.canIUse)
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
  // getLogin(){
  //   // 查看是否授权
  //   wx.getSetting({
  //     success: function (res) {
  //       console.log('res',res)
  //       if (res.authSetting['scope.userInfo']) {
  //        console.log("用户授权了")
  //        wx.getUserInfo({
  //         success: function (res) {
  //           //从数据库获取用户信息
  //           //这里我使用queryUsreInfo函授获取信息，你要换成你的，或者不用
  //           //that.queryUsreInfo();
  //           //用户已经授权过
  //           wx.cloud.callFunction({
  //             name: 'login',
  //             success: res => {
  //               console.log('callFunction test result: ', res)
  //               wx.setStorage({
  //                 data: res.result.openid,
  //                 key: 'user_id',
  //               })
  //               wx.cloud.callFunction({
  //                 name:'userInfoUp',
  //                 data:res.result
  //               }).then(res=>{
  //                 console.log(res)   
  //               })
  //             }
  //           })
              
         
          
  //         }
  //       });
        
  //         wx.switchTab({
  //           url: '/pages/home/home'
  //         })
          
  //       }else{
  //         console.log("用户没授权")
          // wx.getUserInfo({
          //   success: function (res) {
          //     //从数据库获取用户信息
          //     //这里我使用queryUsreInfo函授获取信息，你要换成你的，或者不用
          //     //that.queryUsreInfo();
          //     //用户已经授权过
          //     wx.cloud.callFunction({
          //       name: 'login',
          //       success: res => {
          //         console.log('callFunction test result: ', res)
          //         wx.setStorage({
          //           data: res.result.openid,
          //           key: 'user_id',
          //         })
          //         wx.cloud.callFunction({
          //           name:'userInfoUp',
          //           data:res.result
          //         }).then(res=>{
          //           console.log(res)   
          //         })
          //       }
          //     })
                // wx.cloud.callFunction({
                //   name: 'login',
                //   complete: res => {
                //     console.log('callFunction test result: ', res)
                //   }
                // })
           
            
          //   }
          // });
          
  //       }
  //     }
  //   })
  
  // },
  
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
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
    // 判断是否授权
    wx.getSetting({
      withSubscriptions: true,
      success(res){
        //如果成功了有authSetting就说明已经授权了
        if(res.authSetting){

          // 跳转到home页，然后调用login云函数，将用户信息存储到Storage
          
        }else{

          // 没有授权要执行的操作
          // 没有授权就要把用户信息存到数据库

        }
        console.log(res)
      }
    })
    if (wx.getUserProfile) {
      // wx.switchTab({
      //   url: '/pages/home/home'
      // })
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },

  // onLoad: function () {
  //   var that = this;
  //   wx.getSetting({
  //     success: function(res) {
  //       console.log(res)
  //         if (res.authSetting) {
  //             wx.getUserInfo({
  //                 success: function(res) {
  //                     // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
  //                     // 根据自己的需求有其他操作再补充
  //                     // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
  //                     console.log(res)
  //                     wx.login({
  //                         success: res => {
  //                             // 获取到用户的 code 之后：res.code
  //                             console.log("用户的code:" + res.code);
  //                             // 可以传给后台，再经过解析获取用户的 openid
  //                             // 或者可以直接使用微信的提供的接口直接获取 openid ，方法如下：
  //                             // wx.request({
  //                             //     // 自行补上自己的 APPID 和 SECRET
  //                             //     url: 'https://api.weixin.qq.com/sns/jscode2session?appid=自己的APPID&secret=自己的SECRET&js_code=' + res.code + '&grant_type=authorization_code',
  //                             //     success: res => {
  //                             //         // 获取到用户的 openid
  //                             //         console.log("用户的openid:" + res.data.openid);
  //                             //     }
  //                             // });
  //                         }
  //                     });
  //                 }
  //             });
  //         } else {
  //             // 用户没有授权
  //             // 改变 isHide 的值，显示授权页面
  //             that.setData({
  //                 isHide: true
  //             });
  //         }
  //     }
  // });

  //  this.getLogin()
  // wx.getUserProfile({
  //   success: function (res) {
  //     //从数据库获取用户信息
  //     //这里我使用queryUsreInfo函授获取信息，你要换成你的，或者不用
  //     //that.queryUsreInfo();
  //     //用户已经授权过
  //     console.log(res)
  //       wx.cloud.callFunction({
  //         name: 'login',
  //         success: res => {
  //           console.log('callFunction test result: ', res)
  //           wx.setStorage({
  //             data: res.result.openid,
  //             key: 'user_id',
  //           })
  //           wx.cloud.callFunction({
  //             name:'userInfoUp',
  //             data:res.result
  //           }).then(res=>{
  //             console.log(res)   
  //           })
  //         }
  //       })
  //     // console.log('获取用户信息',res)
    
  //   }
  // });
  
  //  //查看是否授权
  //  wx.getSetting({
  //    //成功时执行
  //   success (res) {
  //     // console.log('res',res,res.authSetting!=={})
  //     //判断有用户信息
  //     console.log(wx.getUserProfile)
  //     if (wx.getUserProfile) {
  //       wx.cloud.callFunction({
  //         name: 'login',
  //         success: res => {
  //           console.log('callFunction test result: ', res)
  //           wx.setStorage({
  //             data: res.result.openid,
  //             key: 'user_id',
  //           })
           
  //         }
  //       })
  //       wx.switchTab({
  //         url: '/pages/home/home'
  //       })
        
  //     }else{
  //       wx.getUserProfile({
  //         success: function (res) {
  //           //从数据库获取用户信息
  //           //这里我使用queryUsreInfo函授获取信息，你要换成你的，或者不用
  //           //that.queryUsreInfo();
  //           //用户已经授权过
  //           console.log(res)
  //             wx.cloud.callFunction({
  //               name: 'login',
  //               success: res => {
  //                 console.log('callFunction test result: ', res)
  //                 wx.setStorage({
  //                   data: res.result.openid,
  //                   key: 'user_id',
  //                 })
  //                 wx.cloud.callFunction({
  //                   name:'userInfoUp',
  //                   data:res.result
  //                 }).then(res=>{
  //                   console.log(res)   
  //                 })
  //               }
  //             })
  //           console.log('获取用户信息',res)
          
  //         }
  //       });
        
  //     }
  //   }
  // })

  // },
  

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