// pages/statistic/statistic.js
import * as echarts from '../../ec-canvas/echarts';

const db = wx.cloud.database();
const $ = db.command.aggregate;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTabIndex: 0,
    array1: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    index: 0,
    currentMonth: 0,
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

  onTabsItemTap: function (event) {
    let index = event.currentTarget.dataset.index;
    this.setData({
      currentTabIndex: index
    })
    if(index === 0){
      this.getMoneyData(2)
      this.getMoneyData1(2)
      this.initIncomeLineChart();
      this.initIncomePieChart();
    }
    if(index===1){
      this.getMoneyData(1)
      this.getMoneyData1(1)
      this.initExpendLineChart();
      this.initExpendPieChart();
    }

  },
  bindPickerChange: function (e) {
    // this.getBookList()
    // const {array,index}=this.data;
    this.setData({
      index: e.detail.value
    })

  },
  // 获取金额的列表
  getMoneyData(tid) {
    let bookId = wx.getStorageSync('current_book')._id;
    var that = this;
    db.collection('money_list').aggregate().match({
      book_id: bookId,
      tid
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
    }).then(res => {
      // that.initbt();
    })

  },
  getMoneyData1(tid) {
    let bookId = wx.getStorageSync('current_book')._id;
    var that = this;
    wx.cloud.callFunction({
      name: 'getClassifyMoney',
      data: {
        book_id: bookId,
        tid
      }
    }).then(res => {
      let target = [];
      res.result.list.forEach(el => {
        let obj = { name: el.classify[0]._id, value: el.totalMoney };
        target.push(obj)
      })
      that.setData({ classifyList: target })

    }).then(res => {
      // this.initbt1();
    })
  },
  initIncomeLineChart: function () {
    this.incomeLineChart.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      chart.setOption(this.getOptionbt());
      return chart;
    })
  },
  initExpendLineChart: function () {
    this.expendLineChart.init((canvas, width, height) => {
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
  initIncomePieChart: function () {

    this.incomePieChart.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      chart.setOption(this.getOptionbt1());
      return chart;
    })
  },

  initExpendPieChart: function () {

    this.expendPieChart.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      chart.setOption(this.getOptionbt1());
      return chart;
    })
  },
  getOptionbt1: function () {
    var option = {
      backgroundColor: "#ffffff",
      color: ["#FEA82D", "#6AC7D5", "#FD9491", "#383C51", "#747FFD", "#FFC928", "#FEA3B4", "#F9A870", "#95BE3E", "#96AEDA"],
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
    var date = new Date();
    var month = date.getMonth() + 1;
    this.setData({ currentMonth: month })
    this.getMoneyData();
    this.getMoneyData1();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.incomeLineChart = this.selectComponent("#incomeLineChart");
    this.incomePieChart = this.selectComponent("#incomePieChart");
    this.expendLineChart = this.selectComponent("#expendLineChart");
    this.expendPieChart = this.selectComponent("#expendPieChart");
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