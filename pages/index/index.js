//index.js
//获取应用实例
const app = getApp()
let phone = ''
import {silentLogin, wxLogin, quickLogin, sendMsgApi, registerApi, logoutApi} from '../../api/auth.js'
import {getIndustryApi, getAreaApi} from "../../api/fixedData.js"
import {pickApi, pickIndexAvaApi, pickAggrApi} from "../../api/pick.js"
Page({
  data: {
    background: '#1F252B',
    viewAreaHeight: app.globalData.viewAreaHeight,
    richText: '',
    status: {}
  },
  
  onLoad: function () {
    if (!app.globalData.viewAreaHeight) {
      app.getTabHInit = () => {
        this.setData({'viewAreaHeight': app.globalData.viewAreaHeight})
      }
    } else {
      this.setData({'viewAreaHeight': app.globalData.viewAreaHeight})
    }
    this.getAvatarList()
  },
  onShow () {
    this.getOtherStatus()
  },
  getOtherStatus () {
    pickAggrApi().then(res => {
      this.setData({'status': res.data})
    })
  },
  getAvatarList () {
    pickIndexAvaApi().then(res => {
      let richText = `<div class="richWrap">`
      res.data.avatarUrls.forEach((item, index) => {
        richText = `${richText}<img src='${item}' class='richDom richDom${index}' />`
      })
      richText = `${richText}</div>`
      this.setData({richText})
    })
  },
  pick () {
    pickApi().then(res => {
      wx.navigateTo({url: `/pages/homepage/index?vkey=${res.data.vkey}`})
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
        this.pick()
        break
      case 'detail':
        wx.navigateTo({url: '/pages/userInfo/index'})
        break
      case 'logout':
        logoutApi()
    }
  }
})
