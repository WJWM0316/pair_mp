//index.js
//获取应用实例
const app = getApp()
let phone = ''
import {silentLogin, wxLogin, quickLogin, sendMsgApi, registerApi, logoutApi} from '../../api/auth.js'
import {getIndustryApi, getAreaApi} from "../../api/fixedData.js"
import {pickApi} from "../../api/pick.js"
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  
  onLoad: function () {
    getAreaApi()
    getAreaApi()
  },
  getUserInfo: function(e) {
    let data = {
      session_token: wx.getStorageSync('sessionToken'),
      iv_key: e.detail.iv,
      data: e.detail.encryptedData
    }
    wxLogin(data).then(res => {
      if (res.data.sessionToken) wx.setStorageSync('sessionToken', res.data.sessionToken)
      if (res.data.token) wx.setStorageSync('token', res.data.token)
    })
  },
  getPhoneNumber (e) {
    let data = {
      session_token: wx.getStorageSync('sessionToken'),
      iv_key: e.detail.iv,
      data: e.detail.encryptedData
    }
    quickLogin(data).then(res => {
      if (res.data.wechatInfo.sessionToken) wx.setStorageSync('sessionToken', res.data.wechatInfo.sessionToken)
      if (res.data.userLogin.token) wx.setStorageSync('token', res.data.userLogin.token)
    })
  },
  bindinput (e) {
    phone = e.detail.value
  },
  sendMsg () {
    sendMsgApi({mobile: phone})
  },
  phoneLogin () {
    registerApi({mobile: phone, code: '1111'}).then(res => {
      if (res.data.sessionToken) wx.setStorageSync('sessionToken', res.data.sessionToken)
      if (res.data.token) wx.setStorageSync('token', res.data.token)
    })
  },
  action (e) {
    let type = e.currentTarget.dataset.type
    switch (type) {
      case 'login':
        wx.navigateTo({url: '/pages/login/index'})
        break
      case 'createUser':
        wx.navigateTo({url: '/pages/createUser/index'})
        break
      case 'perfectUser':
        wx.navigateTo({url: '/pages/perfectUser/index'})
        break
      case 'pick':
        pickApi().then(res => {
          console.log(res, 111)
        })
        break
      case 'detail':
        wx.navigateTo({url: '/pages/userInfo/index'})
        break
      case 'logout':
        logoutApi()
    }
  }
})
