//index.js
//获取应用实例
const app = getApp()
import {silentLogin, wxLogin} from '../../api/auth.js'
import {getIndustryApi, getAreaApi} from "../../api/fixedData.js"
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    actions : [
        {
            name : '喜欢',
            color : '#fff',
            fontsize : '20',
            width : 100,
            icon : 'like',
            background : '#ed3f14'
        },
        {
            name : '返回',
            width : 100,
            color : '#80848f',
            fontsize : '20',
            icon : 'undo'
        }
    ],
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
  }
})
