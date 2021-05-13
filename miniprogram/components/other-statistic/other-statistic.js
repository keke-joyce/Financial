// components/other-statistic/other-statistic.js
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
    },

  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      // this.getCurrentTime()
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
})
