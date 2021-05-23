// components/year-statistic/year-statistic.js
import * as echarts from '../../ec-canvas/echarts';
const db = wx.cloud.database();
const _ = db.command;
const $ = db.command.aggregate;
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    currentTabIndex: 0,
    index: 0,
    year: '',
    incomeLineChart: {
      lazyLoad: true,
    },
    expendLineChart: {
      lazyLoad: true,
    },
    incomePieChart: {
      lazyLoad: true,
    },
    expendPieChart: {
      lazyLoad: true,
    },
    timeList: [],
    moneyList: [],
    classifyList: [],
    colorList: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 减小年份
    toSubYear() {
      let { year, currentTabIndex } = this.data;
      year = Number(year) - 1;
      // console.log(typeof year) number
      this.setData({ year: String(year) })
      if (currentTabIndex === 0) {
        this.getMoneyTimeData(1);
        this.getMoneyClassifyData(1)
      } else if (currentTabIndex === 1) {
        this.getMoneyTimeData(2);
        this.getMoneyClassifyData(2)
      }
    },
    // 增加年份
    toAddYear() {
      let { year, currentTabIndex } = this.data;
      year = Number(year) + 1;
      this.setData({ year: String(year) })

      if (currentTabIndex === 0) {
        this.getMoneyTimeData(1);
        this.getMoneyClassifyData(1)
      } else if (currentTabIndex === 1) {
        this.getMoneyTimeData(2);
        this.getMoneyClassifyData(2)
      }
    },
    // 获取当前时间
    getCurrentTime() {
      var date = new Date();
      var year = date.getFullYear();
      console.log(typeof year, year)
      this.setData({ year: String(year) })
    },
    //切换收支tab
    onTabsItemTap(e) {
      let index = e.currentTarget.dataset.index;
      this.setData({
        currentTabIndex: index
      })
      if (index === 0) {
        this.getMoneyTimeData(1);
        this.getMoneyClassifyData(1)
      } else if (index === 1) {
        this.getMoneyTimeData(2);
        this.getMoneyClassifyData(2)
      }
    },
    // 选择年份
    bindYearChange(e) {
      console.log(e)
      this.setData({ year: e.detail.value })
    },
    //切换收支tab
    onTabsItemTap(e) {
      let index = e.currentTarget.dataset.index;
      this.setData({
        currentTabIndex: index
      })
      console.log(this.data.currentTabIndex)
      if (index === 1) {
        this.getMoneyTimeData(2)
        this.getMoneyClassifyData(2)
      }
      if (index === 0) {
        this.getMoneyTimeData(1)
        this.getMoneyClassifyData(1)
      }
    },
    // 获取时间的条目
    getMoneyTimeData(tid) {
      let bookId = wx.getStorageSync('book_id');
      var that = this;
      const { year } = this.data;
      wx.cloud.callFunction({
        name: 'getYearTotal',
        data: {
          book_id: bookId,
          tid,
          year
        }
      }).then(res => {
        console.log(res)
        let timeList = [];
        let moneyList = [];
        res.result.list.forEach(el => {
          timeList.push(el._id)
          moneyList.push(el.yearTotalMoney)
        })
        that.setData({
          timeList,
          moneyList
        })
      }).then(res => {
        if (tid === 1) {
          that.spendLineChart = this.selectComponent("#spendLineChart");
          that.initSpendLineChart();
        } else {
          that.incomeLineChart = this.selectComponent("#incomeLineChart");
          that.initIncomeLineChart();
        }
      })
    },
    // 获取分类的条目
    getMoneyClassifyData(tid) {
      let bookId = wx.getStorageSync('book_id');
      var that = this;
      const { year } = this.data;
      wx.cloud.callFunction({
        name: 'getYearClassifyTotal',
        data: {
          book_id: bookId,
          tid,
          year
        }
      })
        .then(res => {
          console.log(res)
          let target = [];
          res.result.list.forEach(el => {
            let obj = { name: el.classify[0]._id, value: el.totalMoney };
            target.push(obj)
          })
          that.setData({ classifyList: target })
        }).then(res => {
          if (tid === 1) {
            that.spendPieChart = this.selectComponent("#spendPieChart");
            that.initSpendPieChart()
          } else {
            that.incomePieChart = this.selectComponent("#incomePieChart");
            that.initIncomePieChart()
          }
        })
    },
    // 初始化收入折线图
    initIncomeLineChart() {
      this.incomeLineChart.init((canvas, width, height) => {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        chart.setOption(this.getLineOptionbt());
        return chart;
      })
    },
    // 初始化支出折线图****
    initSpendLineChart() {
      this.spendLineChart.init((canvas, width, height) => {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        chart.setOption(this.getLineOptionbt());
        return chart;
      })
    },
    // 折线图绘制
    getLineOptionbt() {
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
    // 饼状图绘制
    getPieOptionbt() {
      var option = {
        backgroundColor: "#ffffff",
        color: ["#FEA82D", "#6AC7D5", "#FD9491", "#383C51", "#747FFD", "#FFC928", "#05b31a", "#F9A870", "#95BE3E", "#96AEDA"],
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
          data: this.data.classifyList ? this.data.classifyList : []
        }]
      };
      return option;
    },
    // 初始化收入饼状图
    initIncomePieChart() {
      this.incomePieChart.init((canvas, width, height) => {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        chart.setOption(this.getPieOptionbt());
        return chart;
      })
    },
    // 初始化支出饼状图****
    initSpendPieChart() {
      this.spendPieChart.init((canvas, width, height) => {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        chart.setOption(this.getPieOptionbt());
        return chart;
      })
    },
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.getCurrentTime()
      if (this.data.currentTabIndex === 0) {
        this.getMoneyTimeData(1);
        this.getMoneyClassifyData(1);

      } else if (this.data.currentTabIndex === 1) {
        this.getMoneyTimeData(2);
        this.getMoneyClassifyData(2);
      }
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
})
