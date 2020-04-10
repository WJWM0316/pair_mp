import {logoutApi, wxLogin, registerApi, quickLogin} from '../api/auth.js'
import {getMyInfoApi} from '../api/user.js'
import Socket from './webSocket.js'
// 主动授权
const getUserInfoAuth = function(e) {
  if (e.detail.detail.errMsg.indexof('fail') !== -1) return
  let data = {
    session_token: wx.getStorageSync('sessionToken'),
    iv_key: e.detail.iv,
    data: e.detail.encryptedData
  }
  wxLogin(data).then(res => {
    loginCallback(res)
  })
}

const hasLogin = () => {
  let hasLogin = 0
  return new Promise((resolve, reject) => {
    let app = getApp()
    if (app.globalData.hasOwnProperty('hasLogin')) {
      hasLogin = app.globalData.hasLogin
      resolve(hasLogin)
    } else {
      app.loginInit = () => {
        hasLogin = app.globalData.hasLogin
        resolve(hasLogin)
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
  if (res.data.userInfo.sessionToken) wx.setStorageSync('sessionToken', res.data.userInfo.sessionToken)
  if (res.data.userInfo.token) {
    getApp().globalData['hasLogin'] = true
    if (getApp().loginInit) getApp().loginInit()
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
    if (getApp().loginInit) getApp().loginInit()
  }
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
  if (e.detail.detail.errMsg.indexof('fail') !== -1) return
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
  hasLogin,
  getUserInfoAuth,
  getUserInfo,
  getPhoneNumber,
  phoneCodeLogin,
  logout,
  loginCallback
}
