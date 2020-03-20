//app.js
import Socket from './utils/webSocket.js'
import {setConfig} from './env.config'
import { request } from './api/index'
App({
  onLaunch: function () {
    // 获取系统参数，计算顶部栏高度
    this.globalData.systemInfo = wx.getSystemInfoSync();
    this.globalData.systemInfo['titleHeight'] = this.getTitleHeight()
    this.globalData.navBarHeight = this.globalData.systemInfo.statusBarHeight + this.getTitleHeight()
    console.log(this.globalData.systemInfo, '系统参数')


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
    viewAreaHeight: 0, // 有效区域高度 px
    tabBarHeight: 0, // 底部栏高度 px
    navBarHeight: 0, // 顶部栏高度 px
    userInfo: null
  },
  // 计算标签栏高度
  getTitleHeight () {
    let rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null; //胶囊按钮位置信息
    let gap = rect.top - this.globalData.systemInfo.statusBarHeight; //动态计算每台手机状态栏到胶囊按钮间距
    return 2 * gap + rect.height;
  }
})

  
