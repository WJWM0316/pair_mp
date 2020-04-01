const app =  getApp();
import {logout} from '../../utils/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customerPhone: app.globalData.customerPhone,
    customerWechat: app.globalData.customerWechat
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  action (e) {
    const that = this
    switch (e.currentTarget.dataset.type) {
      case 'callPhone':
        wx.makePhoneCall({
          phoneNumber: that.data.customerPhone
        })
        break
      case 'wechat':
        app.wxConfirm({
          title: '客服微信', 
          content: `客服微信：${that.data.customerWechat}。有任何产品使用问题都可以反馈哦`,
          confirmText: '复制微信',
          confirmBack: () => {
            wx.setClipboardData({
              data: that.data.customerWechat,
              success (res) {
                app.wxToast({title: '已复制到剪切板'})
              }
            })
          }
        })
        break
      case 'logout':
        app.wxConfirm({
          title: '退出登录', 
          content: `确定要退出登录吗?退出后无法接收他人的消息哦。`,
          confirmBack: () => {
            logout()
          }
        })
        break
    }
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