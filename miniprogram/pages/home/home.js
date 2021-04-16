// pages/home/home.js
// 方法**代表有问题总结，++表示已完成
const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],//数据列表
    array1: [],//账本名字列表
    array: [],//账本名字列表
    index: 0,
  },
  bindPickerChange: function(e) {
    const {array,index}=this.data;
    console.log('picker发送选择改变，携带值为', e.detail)
    this.setData({
      index: e.detail.value
    })
    // 切换账本
    // 获取切换的账本的id
    var book_id=array[index]._id;
    // 将账本的id存到storage中
    wx.setStorage({
      data: array[index]._id,
      key: 'book_id',
    })
    // 调用云函数根据账本id去获取收支数据
    // this.getData(e.detail.value)
    wx.cloud.callFunction({
      name:'getBookInfo',
      data:{
        book_id
      }
    }).then(res=>{
      console.log(res)
      // var oldData=this.data.dataList;
      // var newData=oldData.concat(res.result.data);
      this.setData({
        dataList:res.result.data
      })
    }
    )

    // console.log(bookId)
  },
  //获取当前用户的账本列表**++
  getBookList(){
    // ******问题：在成功回调函数中使用this，this指向的是箭头函数的this指向包裹它的外层函数的this，而不是全局page的this
    // 要想指向全局page的this来更改data，就需要提前声明一个中间变量来指向全局this
    const that=this;
    wx.getStorage({
      key: 'user_id',
      success(res){
        db.collection('booklist').where({user_id:res.data}).get().then(res=>{
          console.log(res.data)
          const arr=[]
          res.data.forEach(el=>{
            arr.push(el.name)
          })
          that.setData({array:res.data,array1:arr})
        })
      }
    })
  this.getData()
  },
  // 获取当前账本的数据
  getData(){
    
    // this.setData({index:a})
    const {array,index}=this.data;
    console.log(array[index])
    // var book_id=array[index]._id;
    // wx.cloud.callFunction({
    //   name:'getBookInfo',
    //   data:{
    //     book_id
    //   }
    // }).then(res=>{
    //   console.log(res)
    //   var oldData=this.data.dataList;
    //   var newData=oldData.concat(res.result.data);
    //   this.setData({
    //     dataList:newData
    //   })
    // }
    // )

    // wx.cloud.callFunction({
    //   name:'demoGetlist',
    //   data:{
    //     num,
    //     page
    //   }
    // }).then(res=>{
    //   var oldData=this.data.dataList;
    //   var newData=oldData.concat(res.result.data);
    //   this.setData({
    //     dataList:newData
    //   })
    //   // console.log(res.result.data)
    // })
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
    this.getBookList()
    // this.bindPickerChange()
   
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
    this.getData()
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
    // var page=this.data.dataList.length;
    // this.getData(7,page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})