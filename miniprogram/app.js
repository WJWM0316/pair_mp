//app.js
import {setConfig} from './env.config'
import {getConfigMiniProgramApi} from './api/subscribe.js'
import {shareInfosApi} from './api/common.js'
import {getMyInfoApi} from './api/user.js'
import {wxApi, relaunchSilentLogin, getTitleHeight, socket, loginCallback, localstorage} from './utils/index.js'


App({
  ...wxApi, // 挂载二次封装的微信API
  onLaunch: function () {
    this.checkUpdateVersion()
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

    // 网络监测
    wx.onNetworkStatusChange(function (res) {
      if (!res.isConnected) {
        that.isNoConnected = true
        wx.showLoading({
          title: '网络异常',
          mask: true
        })
      } else {
        if (that.isNoConnected) {
          that.isNoConnected = false
          setTimeout(() => {
            socket.reConnect()
          }, 1000)
        }
      }
    })

    // 静默登录
    relaunchSilentLogin(this)

    this.getConfigMiniProgram()
    this.getShareInfos()
  },
  onShow (options) {
    if (socket.hasCreated) {
      socket.testSocket()
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
  // 小程序热更新
  checkUpdateVersion() {
    //判断微信版本是否 兼容小程序更新机制API的使用
    if (wx.canIUse('getUpdateManager')) {
      //创建 UpdateManager 实例
      const updateManager = wx.getUpdateManager();
      //检测版本更新
      updateManager.onCheckForUpdate(function(res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          //监听小程序有版本更新事件
          updateManager.onUpdateReady(function() {
            //TODO 新的版本已经下载好，调用 applyUpdate 应用新版本并重启 （ 此处进行了自动更新操作）
            updateManager.applyUpdate();
          })
          updateManager.onUpdateFailed(function() {
            // 新版本下载失败
            wx.showModal({
              title: '已经有新版本喽~',
              content: '请您删除当前小程序，到微信 “发现-小程序” 页，重新搜索打开哦~',
            })
          })
        }
      })
    } else {
      //TODO 此时微信版本太低（一般而言版本都是支持的）
      wx.showModal({
        title: '溫馨提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
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

  
