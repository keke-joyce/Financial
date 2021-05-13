// components/year-statistic/year-statistic.js
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
    year: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 减小年份
    toSubYear() {
      let { year } = this.data;
      year = Number(year) - 1;
      // console.log(typeof year) number
      this.setData({ year })

    },
    // 增加年份
    toAddYear() {
      let { year } = this.data;
      year = Number(year) + 1;
      this.setData({ year })

    },
    //切换收支tab
    onTabsItemTap(e) {
      this.setData({
        currentTabIndex: e.currentTarget.dataset.index
      })
    },
    // 选择年份
    bindYearChange(e) {
      console.log(e)
      this.setData({ year: e.detail.value })
    },
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      // this.getCurrentTime()
      var date = new Date();
      var year = date.getFullYear();
      this.setData({ year })
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
})
