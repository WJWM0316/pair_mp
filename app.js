//app.js
import Socket from './utils/webSocket.js'
import {setConfig} from './env.config'
App({
  onLaunch: function () {
    // 获取系统参数，计算顶部栏高度
    this.globalData.systemInfo = wx.getSystemInfoSync();
    this.globalData.systemInfo['titleHeight'] = this.getTitleHeight()
    this.globalData.navBarHeight = this.globalData.systemInfo.statusBarHeight + this.getTitleHeight()

    // 设置环境变量
    let {appId, envVersion} = wx.getAccountInfoSync().miniProgram
    let config = setConfig(appId, envVersion)
    Object.assign(this.globalData, config)

    // 开启socket
    Socket.create({url: this.globalData.SOCKETPATH})
    Socket.onMessage((res) => {
    })
  },
  onShow (options) {
    
  },
  globalData: {
    systemInfo: {},
    navBarHeight: 0, // 顶部栏高度
    userInfo: null
  },
  // 计算标签栏高度
  getTitleHeight () {
    let rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null; //胶囊按钮位置信息
    let gap = rect.top - this.globalData.systemInfo.statusBarHeight; //动态计算每台手机状态栏到胶囊按钮间距
    return 2 * gap + rect.height;
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

  
