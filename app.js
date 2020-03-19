//app.js
import Socket from './utils/webSocket.js'
import {setConfig} from './env.config'
App({
  onLaunch: function () {
    this.globalData.systemInfo = wx.getSystemInfoSync();
    let {appId, envVersion} = wx.getAccountInfoSync().miniProgram
    let config = setConfig(appId, envVersion)
    Object.assign(this.globalData, config)
    Socket.create({url: this.globalData.SOCKETPATH})
    Socket.onMessage((res) => {
    })
  },
  onShow (options) {
    
  },
  globalData: {
    systemInfo: {},
    userInfo: null
  },
  // 微信toast
  wxToast({title, icon = 'none', image, mask = true, duration = 2000, callback = function(){} }) {
    // icon - success 显示成功图标，此时 title 文本最多显示 7 个汉字长度
    // icon - loading 显示加载图标，此时 title 文本最多显示 7 个汉字长度
    wx.showToast({
      title,
      icon,
      image,
      mask,
      duration,
      success() {
        setTimeout(() => {
          // 自定义一个回调函数
          callback()
        }, duration)
      }
    })
  },
  // 微信确认弹框
  wxConfirm({title = '', content, showCancel = true, cancelText = '取消', confirmText = '确定', cancelColor = '#BCBCBC', confirmColor = '#652791', confirmBack = function() {}, cancelBack = function() {}}) {
    wx.showModal({
      title,
      content,
      cancelText,
      cancelColor,
      confirmColor,
      showCancel,
      confirmText,
      success(res) {
        if (res.confirm) {
          confirmBack()
        } else if (res.cancel) {
          cancelBack()
        }
      }
    })
  }
})

  
