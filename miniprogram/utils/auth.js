import {silentLogin, logoutApi, wxLogin, registerApi, quickLogin} from '../api/auth.js'
import {getMyInfoApi} from '../api/user.js'
import Socket from './webSocket.js'

// 静默登录
const relaunchSilentLogin = function (that) {
  wx.login({
    success: function (res0) {
      let code = res0.code
      wxLogin({code}, that).then(res => {
        that.silentLoginOver()
        loginCallback(res)
      })
    },
    fail: function (e) {
      console.log('登录失败', e)
    }
  })
}

// 主动授权
const getUserInfoAuth = function(e) {
  if (e.detail.errMsg.indexOf('fail') !== -1) return
  let data = {
    session_token: wx.getStorageSync('sessionToken'),
    iv_key: e.detail.iv,
    data: e.detail.encryptedData
  }
  wxLogin(data).then(res => {
    loginCallback(res)
  })
}

// 判断是否有登录
const hasLogin = (that) => {
  return new Promise((resolve, reject) => {
    let hasLogin = 0
    let app = that || getApp()
    if (app.globalData.hasOwnProperty('hasLogin')) {
      hasLogin = app.globalData.hasLogin
      resolve(hasLogin)
    } else {
      app.loginInit = () => {
        hasLogin = app.globalData.hasLogin
        return resolve(hasLogin)
      }
    }
  })
}

// 需要用户信息
const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    getMyInfoApi({hideLoading: true}).then(res => {
      let userInfo = res.data
      if(!Object.keys(userInfo.careerVerifyInfo).length) {
        userInfo.careerVerifyInfo = Object.assign(userInfo.careerVerifyInfo, {status: -1})
      }
      getApp().globalData.userInfo = userInfo
      resolve(userInfo)
      if (getApp().getUserInfo) {
        getApp().getUserInfo()
      }
    })
  })
}


// 统一的登录回调
const loginCallback = (res, options) => {
  if (res.data.sessionToken) wx.setStorageSync('sessionToken', res.data.sessionToken)
  if (res.data.userInfo && res.data.userInfo.sessionToken) wx.setStorageSync('sessionToken', res.data.userInfo.sessionToken)
  if (res.data.userInfo && res.data.userInfo.token) {
    getApp().globalData['hasLogin'] = true
    wx.setStorageSync('token', res.data.userInfo.token)
    Socket.login(res.data.userInfo.token)
    getUserInfo()
    if (res.data.userInfo.hasOwnProperty('step') && res.data.userInfo.step !== 9) {
      wx.redirectTo({
        url: `/pages/createUser/index?step=${res.data.userInfo.step}`
      })
    } else {
      if (options && options.redirectTo) wx.redirectTo({url: decodeURIComponent(options.redirectTo)})
    }
  } else {
    getApp().globalData['hasLogin'] = false
  }
  if (getApp().loginInit) getApp().loginInit()

}

// 手机号登录
const phoneCodeLogin = (data, options) => {
  return new Promise((resolve, reject) => {
    registerApi(data).then(res => {
      loginCallback(res, options)
    }).catch(e => {
      reject(e)
    })
  })
}

// 微信快捷登录
const getPhoneNumber =  (e, options) => {
  if (e.detail.errMsg.indexOf('fail') !== -1) return
  let data = {
    session_token: wx.getStorageSync('sessionToken'),
    iv_key: e.detail.iv,
    data: e.detail.encryptedData
  }
  quickLogin(data).then(res => {
    loginCallback(res, options)
  })
}

// 退出登录
const logout = (e) => {
  logoutApi().then(res => {
    getApp().globalData.userInfo = 0
    getApp().globalData['hasLogin'] = false
    getApp().loginInit = ''
    wx.removeStorageSync('token')
    wx.reLaunch({url: `/pages/index/index`})
  })
}

module.exports = {
  relaunchSilentLogin,
  hasLogin,
  getUserInfoAuth,
  getUserInfo,
  getPhoneNumber,
  phoneCodeLogin,
  logout,
  loginCallback
}
