// components/month-statistic/month-statistic.js
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
    month: '',
    currentMonth: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 增加月份
    toAddTime() {
      let { year, month } = this.data;
      month = Number(month) + 1;
      console.log(month)
      if (month < 10) {
        month = 0 + '' + month;
      }
      if (month > 12) {
        month = '01';
        year = Number(year) + 1;
      }
      this.setData({ month, year })
      // 执行方法
    },
    // 减小月份
    toSubTime() {
      let { year, month } = this.data;
      month = Number(month) - 1;
      console.log(month)
      if (month < 10) {
        month = 0 + '' + month;
      }
      if (month < 1) {
        month = '12';
        year = Number(year) - 1;
      }
      this.setData({ month, year })
      // 执行方法
    },
    // 选择年月
    bindMonthChange(e) {
      console.log(e)
      let monthArr = e.detail.value.split('-');
      console.log(monthArr)
      this.setData({
        currentMonth: e.detail.value,
        year: monthArr[0],
        month: monthArr[1]
      })
      // 执行搜索的方法

    },
    // 获取当前时间
    getCurrentTime() {
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      if (month < 10) {
        month = 0 + '' + month;
      }
      this.setData({
        currentMonth: year + '-' + month,
        year,
        month
      });
    },
    //切换收支tab
    onTabsItemTap(e) {
      this.setData({
        currentTabIndex: e.currentTarget.dataset.index
      })
    },

  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.getCurrentTime()
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },

})
