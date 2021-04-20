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
    phoneNumber:'',
    user_id:wx.getStorageSync('user_id'),
    showPhoneModal:false,
    bookList:[],
    delId:''
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
  // 获取当前用户手机号
  getPhoneNumber(){
    var {user_id}=this.data;
    const that=this;
    console.log(user_id)
    db.collection("user_list").where({openId:user_id}).get().then(res=>{
      console.log(res.data[0].phone_number)
      that.setData({phoneNumber:res.data[0].phone_number})
    })
    // .then(res=>{
    //   console.log('获取成功',res)
    // })
  },
  inputNumber(e){
    this.setData({phoneNumber:e.detail.value})
    console.log(e)
  },
  // 绑定手机号
  bindPhone(){
    this.setData({showPhoneModal:true})
  },
  // 用户绑定手机号提交
  onCommitNumber(){
    var {user_id,phoneNumber}=this.data;
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if(phoneNumber == ""){
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }else if(!myreg.test(phoneNumber)){
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    wx.cloud.callFunction({
      name:'bindPhone',
      data:{
        openId:user_id,
        phone_number:phoneNumber
      }
    }).then(res=>{
      if (res.errMsg === "cloud.callFunction:ok") {
        this.hideModal();
      }
      console.log(res)
    })

  },
  //获取当前用户的账本列表
    getBookList() {
      var {user_id}=this.data;
      this.setData({showBookModal:true})
      const that=this;      
        db.collection('booklist').where({user_id}).get().then(res=>{
          console.log(res.data)
          // const arr=[]
          // res.data.forEach(el=>{
          //   arr.push(el.name)
          // })
          wx.setStorageSync('book', res.data)
          that.setData({bookList:res.data})
        })

    },
  //获取用户信息
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
  // 添加账本
    addBook() {
      console.log('添加账本')
      this.setData({showAddModal:true})
    },
    // 关闭账本管理模态框
    onClose(){

    },
    // 删除账本
    delBook(e){
      console.log('删除账本',e)
      var {delId}=this.data;
      console.log(delId!=='')
      console.log(delId)
      if (delId!=='') {
        db.collection('booklist').doc(delId).remove({
        success: res => {
          wx.showToast({
            title: '删除成功',
          })
          this.getBookList()
          // this.setData({
          //   counterId: '',
          //   count: null,
          // })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '删除失败',
          })
          console.error('[数据库] [删除记录] 失败：', err)
        }
      })
    }else{
      wx.showToast({
        title: '无记录可删，请见创建一个记录',
      })
    }
    },
    clickRow(e){
      console.log(e)
      this.setData({delId:e.currentTarget.dataset.id})
    },
  /**
     * 隐藏模态对话框
     */
    hideModal: function () {
      this.setData({
        showAddModal: false,
        showBookModal:false,
        showPhoneModal:false
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
    if(bookName == ""){
      wx.showToast({
        title: '账本名不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
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