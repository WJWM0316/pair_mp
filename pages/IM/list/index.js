const app =  getApp();
let ceshi = {
  avatar: 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/d03e7897d4ee5c55ad392292ffd88bf.jpg',
  name: '测试小号',
  content: '测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容',
  itme: '2.3',
  messageNum: 3,
  online: 1
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasTips: true,
    viewAreaHeight: '',
    messageList: [
      ceshi
    ],
    lockIndex: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    setTimeout (() => {
      this.setData({'viewAreaHeight': app.globalData.viewAreaHeight})
    }, 500)
  },
  getSwipeStatus (e) {
    let lockIndex = e.detail.lockIndex,
        curIndex  = e.detail.curIndex
    if (lockIndex !== null && curIndex !== null && lockIndex !== curIndex) {
      this.setData({'lockIndex': lockIndex}, () => {
        this.setData({'lockIndex': null})
      })
    }
  },
  closeTips () {
    this.setData({'hasTips': false})
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