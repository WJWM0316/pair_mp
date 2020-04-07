//app.js
import {setConfig} from './env.config'
import {getSubscribeApi} from './api/subscribe.js'
import {getMyInfoApi} from './api/user.js'
import {wxApi, getTitleHeight, socket, loginCallback} from './utils/index.js'


App({
  ...wxApi, // 挂载二次封装的微信API
  onLaunch: function () {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'global-qlebi',
        traceUser: true,
      })
    }

    // 获取系统参数，计算顶部栏高度
    this.globalData.systemInfo = wx.getSystemInfoSync();
    this.globalData.systemInfo['pxTorpxRatio'] =  this.globalData.systemInfo.windowWidth / 375 / 2
    this.globalData.systemInfo['titleHeight'] = getTitleHeight(this)
    this.globalData.navBarHeight = this.globalData.systemInfo.statusBarHeight + getTitleHeight(this)
    console.log(this.globalData.systemInfo, '系统参数')

    // 设置环境变量
    let {appId, envVersion} = wx.getAccountInfoSync().miniProgram
    let config = setConfig(appId, envVersion)
    Object.assign(this.globalData, config)

    let token = wx.getStorageSync('token')
    
    socket.create(this.globalData.SOCKETHOST, token)
    
    // 判断微信登录状态
    wx.checkSession({
      success () {
        if (token) {
          let res = {data: {userInfo: {token}}}
          loginCallback(res)
        }
      },
      fail () {
        wx.removeStorageSync('token')
        wx.removeStorageSync('sessionToken')
      }
    })
    
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
        if(!Object.keys(data.careerVerifyInfo).length) {
          data.careerVerifyInfo = Object.assign(data.careerVerifyInfo, { status: -1})
        }
        this.globalData.userInfo = data
        resolve(data)
      }).catch((e) => {
        reject(e)
      })
    })
  }
})

  