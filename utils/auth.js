import {logoutApi, wxLogin, registerApi, quickLogin} from '../api/auth.js'
const getUserInfo = function(e) {
  let data = {
    session_token: wx.getStorageSync('sessionToken'),
    iv_key: e.detail.iv,
    data: e.detail.encryptedData
  }
  wxLogin(data).then(res => {
    if (res.data.sessionToken) wx.setStorageSync('sessionToken', res.data.sessionToken)
    if (res.data.token) wx.setStorageSync('token', res.data.token)
  })
}
const phoneCodeLogin = (data, options) => {
  registerApi(data).then(res => {
    if (res.data.userInfo.sessionToken) wx.setStorageSync('sessionToken', res.data.userInfo.sessionToken)
    if (res.data.userInfo.token) wx.setStorageSync('token', res.data.userInfo.token)
    console.log(res, '注册')
    if(res.data.userInfo.step === 9) {
      if (options.redirectTo) wx.redirectTo({url: decodeURIComponent(options.redirectTo)})
    } else {
      wx.navigateTo({
        url: `/pages/createUser/index`
      })
    }
  })
}
const getPhoneNumber =  (e, options) => {
  console.log(e, 222)
  let data = {
    session_token: wx.getStorageSync('sessionToken'),
    iv_key: e.detail.iv,
    data: e.detail.encryptedData
  }
  quickLogin(data).then(res => {
    if (res.data.wechatInfo && res.data.wechatInfo.sessionToken) wx.setStorageSync('sessionToken', res.data.wechatInfo.sessionToken)
    if (res.data.userLogin.token) wx.setStorageSync('token', res.data.userLogin.token)
    if(res.data.userInfo.step === 9) {
      if (options.redirectTo) wx.redirectTo({url: decodeURIComponent(options.redirectTo)})
    } else {
      wx.navigateTo({
        url: `/pages/createUser/index`
      })
    }
  })
}

const logout = (e) => {
  logoutApi().then(res => {
    wx.removeStorageSync('token')
    wx.reLaunch({url: `/pages/index/index`})
  })
}

module.exports = {
  getUserInfo,
  getPhoneNumber,
  phoneCodeLogin,
  logout
}
