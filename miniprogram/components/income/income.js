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
    // dataList:[{'cid':1,'url':'../../images/icon/eat.png','url1':'../../images/icon/eat1.png','color':'#FEA82D'},{'cid':2,'url':'../../images/icon/paper.png','url1':'../../images/icon/paper1.png','color':'#6AC7D5'},{'cid':3,'url':'../../images/icon/medical.png','url1':'../../images/icon/medical1.png','color':'#FD9491'},{'cid':4,'url':'../../images/icon/home.png','url1':'../../images/icon/home1.png','color':'#383C51'},{'cid':5,'url':'../../images/icon/veg.png','url1':'../../images/icon/veg1.png','color':'#747FFD'},{'cid':6,'url':'../../images/icon/shop.png','url1':'../../images/icon/shop1.png','color':'#FFC928'},{'cid':7,'url':'../../images/icon/gift.png','url1':'../../images/icon/gift1.png','color':'#FEA3B4'},{'cid':8,'url':'../../images/icon/edu.png','url1':'../../images/icon/edu1.png','color':'#F9A870'},{'cid':9,'url':'../../images/icon/movie.png','url1':'../../images/icon/movie1.png','color':'#F9A870'},{'cid':10,'url':'../../images/icon/add-icon.png','url1':'../../images/icon/add-icon.png','color':'#F9A870'}],
    dataList:[],
    colortop:'#FEA82D',//头部颜色
    urltop:'',
    itemcolor:'',
    classify_id:1,
    classify_name:'餐饮日常',
    array:{},
    money:0,
    time:'',
    detail:'',
    tid:1,
    showSubmit:false,

  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    // onChange(){
    //   this.setData({colortop:el.color,urltop:el.url1,classify_id:el.cid})
    // },
    getClassifyList(){
      const that=this;
      let {tid}=this.data;
      db.collection("classify_list").where({tid}).get().then(res=>{
        that.setData({dataList:res.data})
        console.log(res)
        wx.setStorageSync('classifyList', res.data)
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
