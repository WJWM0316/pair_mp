//app.js
import Socket from './utils/webSocket.js'
import {setConfig} from './env.config'
App({
  onLaunch: function () {
    let {appId, envVersion} = wx.getAccountInfoSync().miniProgram
    let config = setConfig(appId, envVersion)
    Object.assign(this.globalData, config)
    if (wx.connectSocket) {
      Socket.create({url: 'wss://work-api.xplus.xiaodengta.com/tiger'})
    }
    Socket.onMessage((res) => {
    })
  },
  globalData: {
    userInfo: null
  }
})