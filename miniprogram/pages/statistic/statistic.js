// pages/statistic/statistic.js
import * as echarts from '../../ec-canvas/echarts';

const db = wx.cloud.database();
const $ = db.command.aggregate;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTabIndex:0,
    array1:['1','2','3','4','5','6','7','8','9','10','11','12'],
    index:0,
    currentMonth:0,
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
      that.echarCanve = that.selectComponent("#mychart-dom-line");
      that.initbt();
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
      that.echarCanve = that.selectComponent("#mychart-dom-pie");
      this.initbt1();
    })
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


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date=new Date();
    var month=date.getMonth()+1;
    this.setData({currentMonth:month})
    this.getMoneyData();
    this.getMoneyData1();

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