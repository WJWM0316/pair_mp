//app.js
import Socket from './utils/webSocket.js'
import {setConfig} from './env.config'
import { request } from './api/index'
import wxApi from './utils/wxApi'
import {getTitleHeight} from './utils/util.js'
import {getSubscribeApi} from './api/subscribe.js'
import {getMyInfoApi} from './api/user.js'

App({
  ...wxApi, // 挂载二次封装的微信API
  onLaunch: function () {
    // 获取系统参数，计算顶部栏高度
    this.globalData.systemInfo = wx.getSystemInfoSync();
    this.globalData.systemInfo['pxTorpxRatio'] =  this.globalData.systemInfo.windowWidth / 375 / 2
    this.globalData.systemInfo['titleHeight'] = getTitleHeight(this)
    this.globalData.navBarHeight = this.globalData.systemInfo.statusBarHeight + getTitleHeight(this)
    // console.log(this.globalData.systemInfo, '系统参数')

    // 设置环境变量
    let {appId, envVersion} = wx.getAccountInfoSync().miniProgram
    let config = setConfig(appId, envVersion)
    Object.assign(this.globalData, config)

    

    // 开启socket
    Socket.create(this.globalData.SOCKETHOST, wx.getStorageSync('token'))
    getSubscribeApi({hideLoading: true}, this)
  },
  onShow (options) {},
  globalData: {
    customerPhone: "020-28163063", // 客服电话
    customerWechat: 'zike04', // 客服微信
    systemInfo: {},
    viewAreaHeight: 0, // 有效区域高度 px
    tabBarHeight: 0, // 底部栏高度 px
    navBarHeight: 0, // 顶部栏高度 px
    userInfo: 0
  },
  reloadUserInfo(hideLoading = false) {
    return new Promise((resolve, reject) => {
      getMyInfoApi({ hideLoading }).then(({ data }) => {
        this.globalData.userInfo = data
        resolve(data)
      }).catch((e) => {
        reject(e)
      })
    })
  }
})

  
