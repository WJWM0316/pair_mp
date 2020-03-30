//index.js
//获取应用实例
const app = getApp()
let phone = ''
import {silentLogin, wxLogin, quickLogin, sendMsgApi, registerApi, logoutApi} from '../../api/auth.js'
import {getIndustryApi, getAreaApi} from "../../api/fixedData.js"
import {pickApi, pickIndexAvaApi} from "../../api/pick.js"
Page({
  data: {
    background: '#1F252B',
    viewAreaHeight: app.globalData.viewAreaHeight,
    richText: ''
  },
  
  onLoad: function () {
    if (!app.globalData.viewAreaHeight) {
      app.getTabHInit = () => {
        this.setData({'viewAreaHeight': app.globalData.viewAreaHeight})
      }
    } else {
      this.setData({'viewAreaHeight': app.globalData.viewAreaHeight})
    }
    pickIndexAvaApi().then(res => {
      let richText = `<div class="richWrap">`
      res.data.avatarUrls.forEach((item, index) => {
        richText = `${richText}<img src='${item}' class='richDom richDom${index}' />`
      })
      richText = `${richText}</div>`
      this.setData({richText})
    })
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
  pick () {
    pickApi().then(res => {
      console.log(res, 111)
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
        
        break
      case 'detail':
        wx.navigateTo({url: '/pages/userInfo/index'})
        break
      case 'logout':
        logoutApi()
    }
  }
})
