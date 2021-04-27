// pages/statistic/statistic.js
import * as echarts from '../../../ec-canvas/echarts';

// const app = getApp();
const db = wx.cloud.database();
const $ = db.command.aggregate;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      lazyLoad: true,
    },
    ec1: {
      lazyLoad: true,
    },
    timeList: [],
    moneyList: [],
    classifyList: [],
    colorList: [],

  },

  getTest(){
    var bookId=wx.getStorageSync('book_id');
    wx.cloud.callFunction({
      name:'test',
      data:{
        book_id:bookId,
        tid:1
      }
    }).then(res=>{
      console.log(res)
    })
  },
  // 获取金额的列表
  getMoneyData() {
    let bookId = wx.getStorageSync('current_book')._id;
    var that = this;
    db.collection('money_list').aggregate().match({
      book_id: bookId,
      tid: 1
    }).group({
      _id: '$time',
      totalMoney: $.sum('$money'),
    }).end().then(res => {
      let timeList = [];
      let moneyList = [];
      res.list.forEach(el => {
        timeList.push(el._id)
        moneyList.push(el.totalMoney)
      })

      that.setData({
        timeList,
        moneyList
      })
      console.log(res, this.data.timeList, this.data.moneyList)
    }).then(res => {
      // this.echarCanve = this.selectComponent("#mychart-dom-bar-bt");
      that.echarCanve = that.selectComponent(".mychart-dom-line");
      that.initbt();
      // that.initChart3();
    })

  },
  getMoneyData1() {
    let bookId = wx.getStorageSync('current_book')._id;
    var that = this;
    wx.cloud.callFunction({
      name: 'getClassifyMoney',
      data: {
        book_id: bookId,
        tid: 1
      }
    }).then(res => {
      console.log(res)
      let target=[];
      res.result.list.forEach(el=>{
        let obj={name:el.classify[0]._id,value:el.totalMoney};
        console.log(obj)
        target.push(obj)
        console.log(target)
      })
    that.setData({classifyList:target})
      
    }).then(res => {
      that.echarCanve = that.selectComponent(".mychart-dom-pie");
      this.initbt1();
    })

    // db.collection('money_list').aggregate().match({
    //   book_id: bookId,
    //   tid: 1
    // }).group({
    //   _id: '$classify_id',
    //   value: $.sum('$money'),
    // }).end().then(res => {
    //   let arr=[];
    //   res.list.forEach((el,index)=>{
    //     db.collection('classify_list').where({cid:el._id}).get().then(response=>{
    //       console.log(response.data)
    //       // delete el._id;
    //       // Object.assign(el,{name:response.data[0].name});
    //       let obj=Object.assign(el,{name:response.data[0].name})
    //       // let obj={};
    //       // Object.assign(obj,{value:el.value,name:response.data[0].name})
    //       // let obj={value:el.value,name:response.data[0].name};
    //       // arr[index]={value:el.value,name:response.data[0].name};
    //       // console.log(obj)
    //       delete obj._id;
    //       res.list[index]=obj;
    //       arr[index]=response.data[0].color;
    //       console.log(arr)
    //       that.setData({
    //         classifyList:res.list,
    //         colorList:arr
    //       })
    //       console.log(this.data.colorList)
    //     })

    //   })     
    // }).then(res => {
    //   that.echarCanve = that.selectComponent(".mychart-dom-pie");
    //   setTimeout(()=>{
    //     this.initbt1();
    //   },500)
    // })

  },
  initbt: function () {
    this.echarCanve.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      chart.setOption(this.getOptionbt());
      return chart;
    })
  },
  getOptionbt: function () {
    var option = {
      color: ["#37A2DA"],
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.data.timeList,
      },
      yAxis: {
        x: 'center',
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        },
        show: false
      },
      series: [{
        name: 'A',
        type: 'line',
        smooth: true,
        data: this.data.moneyList
      }]
    };
    return option;
  },
  initbt1: function () {
    this.echarCanve.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      chart.setOption(this.getOptionbt1());
      return chart;
    })
  },
  getOptionbt1: function () {
    console.log(this.data.classifyList)
    var option = {
      backgroundColor: "#ffffff",
      color: ["#FEA82D", "#6AC7D5", "#FD9491", "#383C51", "#747FFD","#FFC928","#FEA3B4","#F9A870","#95BE3E","#96AEDA"],
      // color: this.data.colorList,
      series: [{
        label: {
          normal: {
            fontSize: 14,
            // position:'center'
          }
        },
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['40%', '60%'],
        data: this.data.classifyList
      }]
    };
    return option;
  },


  // 获取金额的列表
  // getMoneyData(){
  //   let bookId=wx.getStorageSync('current_book')._id;
  //   db.collection('money_list').aggregate().match({
  //     book_id:bookId,
  //     tid:1
  //   }).group({
  //     _id:'$time',
  //     totalMoney:$.sum('$money'),
  //   }).end().then(res=>{
  //     let timeList=[];
  //     let moneyList=[];
  //     res.list.forEach(el=>{
  //       timeList.push(el._id)
  //       moneyList.push(el.totalMoney)
  //     })

  //     this.setData({timeList,moneyList})
  //     console.log(res,this.data.timeList,this.data.moneyList)
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMoneyData();
    this.getMoneyData1();
    this.getTest();
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