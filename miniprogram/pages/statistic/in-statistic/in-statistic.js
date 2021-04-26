// pages/statistic/statistic.js
import * as echarts from '../../../ec-canvas/echarts';

// const app = getApp();
const db = wx.cloud.database();
const $ = db.command.aggregate;
// function initChart2(canvas, width, height, dpr) {
//   const chart = echarts.init(canvas, null, {
//     width: width,
//     height: height,
//     devicePixelRatio: dpr // new
//   });
//   canvas.setChart(chart);

//   var option = {
//     backgroundColor: "#ffffff",
//     color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
//     series: [{
//       label: {
//         normal: {
//           fontSize: 14
//         }
//       },
//       type: 'pie',
//       center: ['50%', '50%'],
//       radius: ['40%', '60%'],
//       data: [{
//         value: 55,
//         name: '北京'
//       }, {
//         value: 20,
//         name: '武汉'
//       }, {
//         value: 10,
//         name: '杭州'
//       }, {
//         value: 20,
//         name: '广州'
//       }, {
//         value: 38,
//         name: '上海'
//       }]
//     }]
//   };

//   chart.setOption(option);
//   return chart;
// }
// function initChart3(canvas, width, height, dpr) {
//   const chart = echarts.init(canvas, null, {
//     width: width,
//     height: height,
//     devicePixelRatio: dpr // new
//   });
//   canvas.setChart(chart);

//   var option = {
//     // title: {
//     //   text: '测试下面legend的红色区域不应被裁剪',
//     //   left: 'center'
//     // },
//     // color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
//     color: ["#37A2DA", "#67E0E3"],
//     // legend: {
//     //   data: ['A', 'B', 'C'],
//     //   top: 50,
//     //   left: 'center',
//     //   backgroundColor: 'red',
//     //   z: 100
//     // },
//     // grid: {
//     //   containLabel: true
//     // },
//     tooltip: {
//       show: true,
//       trigger: 'axis'
//     },
//     xAxis: {
//       type: 'category',
//       boundaryGap: false,
//       data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
//       // show: false
//     },
//     yAxis: {
//       x: 'center',
//       type: 'value',
//       splitLine: {
//         lineStyle: {
//           type: 'dashed'
//         }
//       },
//       show: false
//     },
//     series: [{
//       name: 'A',
//       type: 'line',
//       smooth: true,
//       data: [18, 36, 65, 30, 78, 40, 33]
//     }, {
//       name: 'B',
//       type: 'line',
//       smooth: true,
//       data: [12, 50, 51, 35, 70, 30, 20]
//     }]
//   };

//   chart.setOption(option);
//   return chart;
// }
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec2: {
      lazyLoad: true,
    },
    ec3: {
      lazyLoad: true,
    },
    timeList: [],
    moneyList: [],
    classifyList: [],
    colorList:[],

  },

  // 获取金额的列表
  getMoneyData() {
    let bookId = wx.getStorageSync('current_book')._id;
    var that = this;
    db.collection('money_list').aggregate().match({
      book_id: bookId,
      tid: 2
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
      this.echarCanve = this.selectComponent(".mychart-dom-line");
      // setTimeout(()=>{
        this.initbt();
      // },500)
      // this.initbt();
      // that.initChart3();
    })

  },
  getMoneyData1() {
    let bookId = wx.getStorageSync('current_book')._id;
    var that = this;
    db.collection('money_list').aggregate().match({
      book_id: bookId,
      tid: 2
    }).group({
      _id: '$classify_id',
      value: $.sum('$money'),
    }).end().then(res => {
      let arr = [];
      res.list.forEach((el, index) => {
        db.collection('classify_list').where({
          cid: el._id
        }).get().then(response => {
          // delete el._id;
          // Object.assign(el,{name:response.data[0].name});
          // Object.assign(el, {
          //   name: response.data[0].name
          // })
          let obj = Object.assign(el, {
            name: response.data[0].name
          })
          // let obj={};
          // Object.assign(obj,{value:el.value,name:response.data[0].name})
          // let obj={value:el.value,name:response.data[0].name};
          // arr[index]={value:el.value,name:response.data[0].name};
          console.log(obj)
          delete obj._id;
          res.list[index] = obj;
          console.log(arr)
          arr[index]=response.data[0].color;
          that.setData({
            classifyList: res.list,
            colorList:arr
          })
          console.log(this.data.classifyList)
        })

        
      })
      // this.echarCanve = this.selectComponent("#mychart-dom-pie");
      // this.initbt1();
    }).then(res => {
      this.echarCanve = this.selectComponent(".mychart-dom-pie");
      setTimeout(()=>{
        this.initbt1();
      },500)
      
    })

  },
  // test(){
  //   console.log(this.data.classifyList)
  // },
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
    console.log(this.data.moneyList)
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
      color:this.data.colorList,
      // color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C"],
      series: [{
        label: {
          normal: {
            fontSize: 14
          }
        },
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['40%', '60%'],
        // data: [{
        //   value: 55,
        //   name: '北京'
        // }, {
        //   value: 20,
        //   name: '武汉'
        // }, {
        //   value: 10,
        //   name: '杭州'
        // }, {
        //   value: 20,
        //   name: '广州'
        // }, {
        //   value: 38,
        //   name: '上海'
        // }],
        // data:[{value: 5453, name: "工资"}]
        data: this.data.classifyList
      }]
    };
    return option;
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMoneyData();
    this.getMoneyData1();
    // this.test()
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