// components/other-statistic/other-statistic.js
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
    nameList: [],
    incomeList: [],
    spendList: [],
    storeList: [],



  },

  /**
   * 组件的方法列表
   */
  methods: {
    //切换收支tab
    onTabsItemTap(e) {
      this.setData({
        currentTabIndex: e.currentTarget.dataset.index
      })
      if (this.data.currentTabIndex === 0) {
        this.spendLineChart = this.selectComponent("#spendLineChart");
        this.initSpendLineChart()
      } else if (this.data.currentTabIndex === 1) {
        this.incomeLineChart = this.selectComponent("#incomeLineChart");
        this.initIncomeLineChart()
      } else if (this.data.currentTabIndex === 2) {
        this.storeLineChart = this.selectComponent("#storeLineChart");
        this.initStoreLineChart()
      }

    },
    // 获取用户的账本总的支出
    getBookTotal() {
      const that = this;
      let user_id = wx.getStorageSync('user_id');
      wx.cloud.callFunction({
        name: 'getUserBookTotal',
        data: {
          user_id,
        }
      }).then(res => {
        console.log('$$$', res)
        let nameList = [];
        let incomeList = [];
        let spendList = [];
        let storeList = [];
        res.result.list.forEach((el, index) => {
          nameList[index] = el.bookList[0]._id;
          spendList[index] = el.spend_total;
          incomeList[index] = el.income_total;
          storeList[index] = el.store_total;
        })
        that.setData({
          nameList,
          incomeList,
          spendList,
          storeList
        })
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
          data: this.data.nameList,
          axisLabel: {
            interval: 0,
            rotate: 50
          },
        },
        yAxis: {
          x: 'center',
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
          show: true
        },
        grid: {
          x: 50,
          y: 40,
          x2: 15,
          y2: 20,
          // left: "10%",
          bottom: '35%'
        },
        series: [{
          name: 'A',
          type: 'line',
          smooth: true,
          data: this.data.currentTabIndex === 0 ? this.data.spendList : this.data.incomeList
        }]
      };
      return option;
    },
    // 结余折线图绘制
    getStoreLineOptionbt() {
      var option = {
        color: ["#37A2DA"],
        tooltip: {
          show: true,
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.data.nameList,
          axisLabel: {
            interval: 0,
            rotate: 50
          },
        },
        yAxis: {
          x: 'center',
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
          show: true
        },
        grid: {
          x: 50,
          y: 40,
          x2: 15,
          y2: 20,
          // left: "10%",
          bottom: '35%'
        },
        series: [{
          name: 'A',
          type: 'line',
          smooth: true,
          data: this.data.storeList
        }]
      };
      return option;
    },
    //初始化结余折线图
    initStoreLineChart() {
      this.storeLineChart.init((canvas, width, height) => {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        chart.setOption(this.getStoreLineOptionbt());
        return chart;
      })
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
      // this.getCurrentTime()
      this.getBookTotal();
      if (this.data.currentTabIndex === 0) {
        this.spendLineChart = this.selectComponent("#spendLineChart");
        this.initSpendLineChart()
      } else if (this.data.currentTabIndex === 1) {
        this.spendLineChart = this.selectComponent("#spendLineChart");
        this.initSpendLineChart()
      } else if (this.data.currentTabIndex === 2) {
        this.storeLineChart = this.selectComponent("#storeLineChart");
        this.initStoreLineChart()
      }


    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
})
