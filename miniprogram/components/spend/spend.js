// components/income/income.js
const db=wx.cloud.database();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    today:String

  },

  /**
   * 组件的初始数据
   */
  data: {
    dataList:[],
    colortop:'#6F6959',//头部颜色
    urltop:'',
    itemcolor:'',
    classify_id:11,
    classify_name:'工资',
    array:{},
    money:0,
    time:'',
    detail:'',
    tid:2,
    showSubmit:false,

  },
  
  /**
   * 组件的方法列表
   */
  methods: {
 
    getClassifyList(){
      const that=this;
      let {tid}=this.data;
      db.collection("classify_list").where({tid}).get().then(res=>{
        that.setData({dataList:res.data})
        console.log(res)
        wx.setStorageSync('classifyList1', res.data)
      })

    },
    bindPickerChange(e){
      var {array}=this.data;
      let arr=[]
      console.log(array)
      array.forEach(el=>{
        console.log(el)
        arr.push(el.name)   
      })
      this.setData({array1:arr,index:e.detail.value})
    },
    getCalNumber(e){
      this.setData({money:e.detail.val})

      console.log(e.detail.val)
    },
    timePicker:function(e){
      console.log(e.detail.value)
      this.setData({time:e.detail.value})

    },
    inputDetail(e){
      console.log(e.detail.value)
      this.setData({detail:e.detail.value})
    },
    onChange(){
      var {time,detail,money}=this.data;
      if(time!==''&&detail!==''&&money!==0){
        this.setData({showSubmit:true})
      }
    },
    addSpend(){
      var {time,detail,money,classify_id,tid}=this.data;
      var spendInfo={
        book_id: wx.getStorageSync('current_book')._id,
        classify_id,
        detail,
        money:Number(money),
        tid,
        time
      }
      wx.cloud.callFunction({
        name:'addSpendInfo',
        data:spendInfo
      }).then(res=>{
        if(res.errMsg==="cloud.callFunction:ok"){
          this.setData({time:'',money:0,detail:'',showSubmit:false})
          // this.inputDetail(e)
        }
        console.log('添加成功',res)
      })
      
    },
    classifyClick:function(e){
      var id=e.currentTarget.id;
      const {dataList}=this.data;
      dataList.forEach(el=>{
        if(el.cid==id){
          this.setData({colortop:el.color,urltop:el.url1,classify_id:el.cid,classify_name:el.name})
        }
      })
      // console.log(this.data.colortop) 
    },
    getDate(){

    },
    change:function(){
      this.triggerEvent('myevent',{today:time})
    }
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      var currentbook=wx.getStorageSync('current_book');
      this.setData({array:currentbook})
      this.getClassifyList()
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
  attached: function() {
    // 在组件实例进入页面节点树时执行
  },
  detached: function() {
    // 在组件实例被从页面节点树移除时执行
  },
})
