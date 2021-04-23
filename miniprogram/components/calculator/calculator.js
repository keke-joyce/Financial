// components/calculator/calculator.js
const app = getApp();
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
    num: 0, //输入的数字的数组
    hasDot: false, // 防止用户多次输入小数点
    temp: false, //判断是否是一个运算符
    result: 0 //结果
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // onChange(e){
    //   let myEventDetail={
    //     val:e.target.dataset.key=='C'||e.target.dataset.key=='Del'?0:e.target.dataset.key,
    //   }
    //   this.triggerEvent('getCalculator',myEventDetail)
    //   // console.log(e)
    // },

    tapKey: function (e) {
      var x = e.target.dataset.key;
      console.log(x)
      if (x == '.') {
        // if(this.data.hasDot){
        //   console.log('##########')
        // } 
        this.setData({
          hasDot: true
        })
      } else if (x == '+' || x == '-') {
        this.setData({
          temp: true
        })
      }
      this.setData({
        num: this.data.num == '0' ? x : this.data.num + x
      })
      console.log(this.data.num)
      let myEventDetail = {
        val: e.target.dataset.key == 'C' || e.target.dataset.key == 'Del' ? 0 : this.data.num,
      }
      this.triggerEvent('getCalculator', myEventDetail)
    },

    toSubmit(e) {
      console.log(e)
      let resArr = this.data.num;
      this.toCal(resArr)
      e.target.dataset = this.data.result;
      // console.log(e.target.dataset)
      // console.log(e)
      let myEventDetail = {
        val: e.target.dataset,
      }
      this.triggerEvent('getCalculator', myEventDetail)
      // this.toClear()          
    },

    toClear() {
      this.setData({
        num: '0',
        hasDot: false,
        temp: false,
        result: 0
      })
      let myEventDetail = {
        val: this.data.num,
      }
      this.triggerEvent('getCalculator', myEventDetail)

    },

    toDel() {
      if (this.data.num == '0') return
      if (this.data.num[this.data.num.length - 1] == '.') this.setData({
        hasDot: false
      })
      this.setData({
        num: this.data.num.length == 1 ? '0' : this.data.num.substring(0, this.data.num.length - 1)
      })
      let myEventDetail = {
        val: this.data.num,
      }
      this.triggerEvent('getCalculator', myEventDetail)
    },

    toCal(resArr) {
      let re = 0;
      let addList = resArr.split('+');
      let sum = 0;
      let sub = 0;
      addList.forEach((item, el) => {
        let subList = item.split('-');
        if (subList.length > 1) {
          let sub1 = subList.reduce((prev, cur, index, array) => {
            return prev - cur;
          });
          sub += sub1;
          console.log('-------', sub)
        } else {
          sum += Number(item);
          console.log('++++++', sum)
        }
        re = sub + sum;
        this.setData({
          result: re.toFixed(2),
          temp: false
        })
        console.log('***', this.data.result)
      })
    },

    toCom() {
      console.log(111)
    },
  }
})