import {getSysMsgApi} from '../../../api/im.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList: []
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

  },
  getSysMsg () {
    getSysMsgApi().then(res => {
      let messageList = this.data.messageList
      messageList = res.data.concat(messageList)
      this.setData({messageList: res.data})
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getSysMsg()
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