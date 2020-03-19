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
  }
})
