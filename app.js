//app.js
import Socket from './utils/webSocket.js'
App({
  onLaunch: function () {
    if (typeof __wxConfig =="object"){
      let version = __wxConfig.envVersion,
          appId   = __wxConfig.accountInfo.appId
      console.log('appId: ', __wxConfig.accountInfo.appId)
      switch (version) {
        case 'develop':
          console.log('工具或者真机 开发环境')
          break
        case 'trial':
          console.log('测试环境(体验版)')
          break
        case 'release':
          console.log('正式环境')
          break
      }
    }
    if (wx.connectSocket) {
      Socket.create({url: 'wss://work-api.xplus.xiaodengta.com/tiger'})
    }
    
    Socket.onMessage((res) => {
      console.log(res, 1111)
    })
  },
  globalData: {
    host: {}, // 配置域名
    userInfo: null
  }
})