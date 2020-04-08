const app =  getApp();
import {logout} from '../../utils/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customerPhone: app.globalData.customerPhone,
    customerWechat: app.globalData.customerWechat,
    userInfo: 0
  },
  onShow() {
    let callback = () => {
      this.setData({userInfo: app.globalData.userInfo.userInfo})
    }
    if (app.globalData.userInfo) {
      callback()
    } else {
      app.getUserInfo = () => callback()
    }
  },
  action (e) {
    const that = this
    let { PAGEPATH } = app.globalData
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
      case 'backlist':
        wx.navigateTo({
          url: `${PAGEPATH}/backlist/index`
        })
        break
      case 'agreement':
        let url = `${app.globalData.WEBVIEW}/art/userProtocol/index.html`
        wx.navigateTo({url: `/pages/webview/index?p=${encodeURIComponent(url)}`})
        break
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    return app.wxShare({options})
  }
})