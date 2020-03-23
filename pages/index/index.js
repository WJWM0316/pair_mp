//index.js
//获取应用实例
const app = getApp()
let phone = ''
import {silentLogin, wxLogin, quickLogin, sendMsgApi, registerApi} from '../../api/auth.js'
import {getIndustryApi, getAreaApi} from "../../api/fixedData.js"
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    getIndustryApi({data: wx.getStorageSync('sessionToken')})
    getAreaApi({data: wx.getStorageSync('sessionToken')})
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
  }
})
