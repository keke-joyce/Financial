// pages/myinfo/book/book.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookList: [], //账本列表
    user_id: wx.getStorageSync('user_id'),
    bookName: '',
    showAddModal: false,
    rowId: '',
    familyNumber: '',
    showFamilyModal: false,
    showFamilyListModel: false,
    familyList: []


  },
  toFamilyList(e) {
    this.setData({
      showFamilyListModel: true,
      rowId: e.target.dataset.id
    })
  },
  // 解除家庭成员绑定
  delFamily(e) {
    let rowId=this.data;
    console.log(e.target.dataset.id)
    wx.cloud.callFunction({
      name: 'delFamily',
      data: {
        _id:rowId,
        userId: e.target.dataset.id
      }
    }).then(res => {
      console.log(res)
    })

  },
  // 账本输入改变
  inputChange(e) {
    this.setData({
      familyNumber: e.detail.value
    })
  },
  // 添加账本输入框
  onChange(e) {
    this.setData({
      bookName: e.detail.value
    })
  },
  // 删除账本
  delBook(e) {
    const that = this;
    var delId = e.target.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确认删除该账本？',
      success(res) {
        if (res.confirm) {
          db.collection('booklist').doc(delId).remove({
            success: res => {
              that.getBookList()
              wx.showToast({
                title: '删除成功',
              })
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '删除失败',
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  // 添加账本
  addBook() {
    console.log('添加账本')
    this.setData({
      showAddModal: true
    })
  },
  //获取当前用户的账本列表
  getBookList() {
    var {
      user_id
    } = this.data;
    this.setData({
      showBookModal: true
    })
    const that = this;
    db.collection('booklist').where({
      user_id
    }).get().then(res => {
      console.log(res.data)
      // const arr=[]
      // res.data.forEach(el=>{
      //   arr.push(el.name)
      // })
      // if(res.data)
      // 获取账本列表
      // 显示已绑定的用户手机0

      wx.setStorageSync('book', res.data)
      that.setData({
        bookList: res.data,
        familyList: res.data.user_id
      })
    })
  },
  toFamilyNumber(e) {
    console.log(e.target.dataset.id)
    this.setData({
      showFamilyModal: true,
      rowId: e.target.dataset.id
    })
  },
  // 绑定手机号的确认
  onSubmit() {
    var {
      familyNumber,
      rowId
    } = this.data;
    if (familyNumber == "") {
      wx.showToast({
        title: '电话号码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    // 1.先通过手机号查询到被绑定用户的openId
    db.collection('user_list').where({
      phone_number: familyNumber
    }).get({
      success: res => {
        let userId = res.data[0].openId;
        db.collection('booklist').where({
          _id: rowId
        }).get().then(response => {
          let userList = response.data[0].user_id;
          // 判断该账本是否已经绑定了该家庭成员
          if (userList.indexOf(userId) === -1) {
            // 不存在时执行
            // 2.将openId传入此账本的user_id数组中
            wx.cloud.callFunction({
              name: 'bindFamily',
              data: {
                _id: rowId,
                user_id: res.data[0].openId
              }
            }).then(res => {
              if (res.errMsg === "cloud.callFunction:ok") {
                wx.showToast({
                  title: '绑定成功',
                  icon: 'none',
                  duration: 1000
                })
                this.getBookList();
                this.hideModal();
                this.setData({
                  familyState: true
                })
              }
            })

          } else {
            // 存在时执行
            wx.showToast({
              title: '该成员已存在',
              icon: 'none',
              duration: 1000
            })
          }
        })
      }
    })
  },
  //隐藏模态对话框
  hideModal() {
    this.setData({
      showAddModal: false,
      showFamilyModal: false,
      showFamilyListModel: false
      // showBookModal:false,
      // showPhoneModal:false
    });
  },

  //对话框确认按钮点击事件
  onConfirm(e) {
    var {
      bookName
    } = this.data;
    var user_id = wx.getStorageSync('user_id');
    var bookinfo = {
      name: bookName,
      user_id,
    }
    if (bookName == "") {
      wx.showToast({
        title: '账本名不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    wx.cloud.callFunction({
      name: 'addBook',
      data: bookinfo
    }).then(res => {
      if (res.errMsg === "cloud.callFunction:ok") {
        this.hideModal();
        this.getBookList()
      }
    })
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel() {
    this.hideModal();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBookList()

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