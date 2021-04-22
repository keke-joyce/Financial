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
    spendMoney:0,//总支出
    incomeMoney:0,//总收入
    classifyList:wx.getStorageSync('classifyList'),
    classifyList1:wx.getStorageSync('classifyList1'),
    classify:[]

  },
  bindPickerChange: function(e) {
    // this.getBookList()
    const {array,index}=this.data;
    console.log('picker发送选择改变，携带值为', e.detail)
    this.setData({
      index: e.detail.value
    })
    // 切换账本
    // 获取切换的账本的id
    console.log(index)
    var book_id=array[e.detail.value]._id;
    console.log(book_id);
    // 将账本的id存到storage中
    wx.setStorageSync('book_id', book_id);
    this.getData();
  },
  //获取当前用户的账本列表**++
  getBookList(){
    // ******问题：在成功回调函数中使用this，this指向的是箭头函数的this指向包裹它的外层函数的this，而不是全局page的this
    // 要想指向全局page的this来更改data，就需要提前声明一个中间变量来指向全局this
    const that=this;
    var user_id=wx.getStorageSync('user_id')
    db.collection('booklist').where({user_id}).get().then(res=>{
          console.log(res.data)
          wx.setStorageSync('book', res.data)
          const arr=[]
          res.data.forEach(el=>{
            arr.push(el.name)
          })
          that.setData({array:res.data,array1:arr})
        })
    this.getData()
  },
  // 获取当前账本的数据
  getData(){
    const {array,index,classifyList,classifyList1}=this.data;
    const that=this;
     // 调用云函数根据账本id去获取收支数据
    // this.getData(e.detail.value)
    var book_id=wx.getStorageSync('book_id');
    // console.log(book_id)
    wx.cloud.callFunction({
      name:'getBookInfo',
      data:{
        book_id
      }
    }).then(res=>{
      console.log(res)
      var moneyArr=[];//存放支出金额的数组
      var moneyArr1=[];//存放收入金额的数组
      var datalist=[];
      res.result.data.forEach(el=>{
        if(el.tid===1){
          moneyArr.push(el.money)
        }else{
          moneyArr1.push(el.money)
        }
        
        db.collection('classify_list').where({cid:el.classify_id}).get().then(res=>{
          delete res.data[0]._id;
          Object.assign(el,res.data[0])
        })
      })
      if(moneyArr.length){
        var spendMoney=moneyArr.reduce((a,b)=>a+b);
      }else{
        var spendMoney=0;
      }
      if(moneyArr1.length){
        var incomeMoney=moneyArr1.reduce((a,b)=>a+b);
      }else{
        var incomeMoney=0;
      }
      classifyList.push(classifyList1)
      that.setData({
        dataList:res.result.data,
        spendMoney,
        incomeMoney,
        classifyList
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
    })},

  toAdd(){
    var {array,index}=this.data;
    wx.setStorageSync('current_book', array[index]);
      wx.navigateTo({
        url: '../addmoney/addmoney',
      })
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBookList()
   
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
    // console.log(123)
    // var page=this.data.dataList.length;
    // this.getData(7,page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})