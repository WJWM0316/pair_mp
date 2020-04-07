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
  onShow () {
    if (app.globalData.userInfo) {
      this.setData({'userInfo': app.globalData.userInfo.userInfo})
    } else {
      app.getUserInfo = () => {
        this.setData({'userInfo': app.globalData.userInfo.userInfo})
      }
    }
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
  }
})