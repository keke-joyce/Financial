// components/income/income.js
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
    dataList:[{'cid':1,'url':'../../images/icon/eat.png','url1':'../../images/icon/eat1.png','color':'#FEA82D'},{'cid':2,'url':'../../images/icon/paper.png','url1':'../../images/icon/paper1.png','color':'#6AC7D5'},{'cid':3,'url':'../../images/icon/medical.png','url1':'../../images/icon/medical1.png','color':'#FD9491'},{'cid':4,'url':'../../images/icon/home.png','url1':'../../images/icon/home1.png','color':'#383C51'},{'cid':5,'url':'../../images/icon/veg.png','url1':'../../images/icon/veg1.png','color':'#747FFD'},{'cid':6,'url':'../../images/icon/shop.png','url1':'../../images/icon/shop1.png','color':'#FFC928'},{'cid':7,'url':'../../images/icon/gift.png','url1':'../../images/icon/gift1.png','color':'#FEA3B4'},{'cid':8,'url':'../../images/icon/edu.png','url1':'../../images/icon/edu1.png','color':'#F9A870'},{'cid':9,'url':'../../images/icon/movie.png','url1':'../../images/icon/movie1.png','color':'#F9A870'},{'cid':10,'url':'../../images/icon/add-icon.png','url1':'../../images/icon/add-icon.png','color':'#F9A870'}],
    colortop:'',//头部颜色
    urltop:'',
    itemcolor:'',
    classify_id:0,
    // today:''
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    timePicker:function(e){
      console.log(e.detail.value)
    },
    classifyClick:function(e){
      console.log(this.data.today)
      var id=e.currentTarget.id;
      const {dataList}=this.data;
      dataList.forEach(el=>{
        if(el.cid==id){
          this.setData({colortop:el.color,urltop:el.url1,classify_id:el.cid})
        }
      })
      // console.log(this.data.colortop) 
    },
    getDate(){

    },
    change:function(){
      this.triggerEvent('myevent',{today:time})
    }
  }
})
