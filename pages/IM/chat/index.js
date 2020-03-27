const app =  getApp();
import {getSelectorQuery, socket} from '../../../utils/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myUid: '3',
    messageList: [],
    selectIndex: null, // 选择发送类型
    longpressData: {},
    tips: true // 提醒气泡展示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    socket.onMessage((res) => {
      // let index = this.data.messageList.length - 1
      // if (res.hasOwnProperty('msgType')) {
      //   this.data.messageList[]
      // }
      
    })
  },
  // 发送数据， 先显示再界面上
  sendMsg (e) {
    const that = this
    let index = this.data.messageList.length
    this.setData({[`messageList[${index}]`]: e.detail}, () => {
      wx.nextTick(()=>{
        that.resetView()
        that.selectComponent('#footer').pageScrollToDom('bottom')
      });
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  // 长按功能
  longpress (e) {
    let dataset  = e.currentTarget.dataset
    getSelectorQuery(`.${dataset.class}`).then(res => {
      console.log(res, 11)
      let longpressData = {
        index: dataset.index
      },
      position = {}
      if (res.top >= 80) {
        if (dataset.object.data.own) {
          longpressData.style = `right:0;top:-100rpx;`
          longpressData.iconStyle = 'right:45rpx;bottom:-31rpx;'
        } else {
          longpressData.style = `left:0;top:-100rpx;`
          longpressData.iconStyle = 'left:14rpx;bottom:-31rpx;'
        }
      } else {
        if (dataset.object.data.own) {
          longpressData.style = `right:0;bottom:-100rpx;`
          longpressData.iconStyle = 'right:45rpx;top:-31rpx;transform: rotate(180deg);'
        } else {
          longpressData.style = `left:0;bottom:-100rpx;`
          longpressData.iconStyle = 'left:14rpx;top:-31rpx;transform: rotate(180deg);'
        }
      }
      this.setData({longpressData})
    })
  },
  // 复位
  resetView (e) {
    if ([0, 3, 4].includes(this.data.selectIndex)) {
      this.setData({'selectIndex': null})
    }
  },
  selectType (e) {
    this.setData({'selectIndex': e.detail})
  },
  // 获取header展开状态
  headerPutUp (e) {
    this.putUp = e.detail
  },
  // 打开开场白
  bindtapMpre (e) {
    this.setData({'selectIndex': 4})
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

  // 页面滚动时执行
  onPageScroll: function(e) {

  },
  
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  
  onPullDownRefresh: function (e) {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})