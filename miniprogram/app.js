//app.js
import {setConfig} from './env.config'
import {getConfigMiniProgramApi} from './api/subscribe.js'
import {shareInfosApi} from './api/common.js'
import {getMyInfoApi} from './api/user.js'
import {wxApi, getTitleHeight, socket, loginCallback, localstorage} from './utils/index.js'


App({
  ...wxApi, // 挂载二次封装的微信API
  onLaunch: function () {
    this.hasLaunch = true
    const that = this

    // 获取系统参数，计算顶部栏高度
    this.globalData.systemInfo = wx.getSystemInfoSync();
    this.globalData.systemInfo['pxTorpxRatio'] =  this.globalData.systemInfo.windowWidth / 375 / 2
    this.globalData.systemInfo['titleHeight'] = 44
    this.globalData.navBarHeight = this.globalData.systemInfo.statusBarHeight + 44
    this.globalData.tabBarHeight = this.globalData.systemInfo.screenHeight - this.globalData.systemInfo.safeArea.bottom + (178 * this.globalData.systemInfo['pxTorpxRatio'])
    
    this.globalData.viewAreaHeight = this.globalData.systemInfo.screenHeight - this.globalData.tabBarHeight - this.globalData.navBarHeight
    console.log(this.globalData.systemInfo, '系统参数')

    // 设置环境变量
    let {appId, envVersion} = wx.getAccountInfoSync().miniProgram
    let config = setConfig(appId, envVersion)
    Object.assign(this.globalData, config)

    let token = localstorage.get('token')
    
    socket.create(this.globalData.SOCKETHOST, token)
    wx.onNetworkStatusChange(function (res) {
      if (!res.isConnected) {
        that.isNoConnected = true
      } else {
        if (that.isNoConnected) {
          that.isNoConnected = false
          socket.create(that.globalData.SOCKETHOST, token)
        }
      }
    })
    // 判断微信登录状态
    wx.checkSession({
      success () {
        if (token) {
          let res = {data: {userInfo: {token}}}
          loginCallback(res)
        }
      }
    })
    this.getConfigMiniProgram()
    this.getShareInfos()
  },
  onShow (options) {
    if (socket.hasCreated) {
      if (socket.SocketTask.readyState !== 1) {
        let token = localstorage.get('token')
        socket.create(this.globalData.SOCKETHOST, token)
      }
    }
  },
  globalData: {
    customerPhone: "020-28163063", // 客服电话
    customerWechat: 'zike04', // 客服微信
    systemInfo: {},
    viewAreaHeight: 0, // 除去自定义顶部栏 + 自定义底部栏，有效区域高度 px
    tabBarHeight: 0, // 底部栏高度 px
    navBarHeight: 0, // 顶部栏高度 px
    userInfo: 0
  },
  getShareInfos () {
    shareInfosApi({hideLoading: true}, this).then(({data}) => {
      this.globalData.shareInfos = data
    })
  },
  getConfigMiniProgram () {
    getConfigMiniProgramApi({hideLoading: true}, this).then(({ data }) => {
      let { subscribeConfig } = data.miniProgram
      Object.assign(this.globalData, { subscribeConfig })
    })
  }
})

  
