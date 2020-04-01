//index.js
//获取应用实例
const app = getApp()
let phone = ''
import {getCurrentPagePath} from '../../utils/index.js'
import {silentLogin, wxLogin, quickLogin, sendMsgApi, registerApi, logoutApi} from '../../api/auth.js'
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
    if (app.globalData.userInfo) {
    } else {
      app.getUserInfo = () => {
      }
    }
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
    wx.redirectTo({url: `/pages/login/index?redirectTo=${encodeURIComponent(getCurrentPagePath())}`})
        return
    pickApi().then(res => {
      wx.navigateTo({url: `/pages/homepage/index?vkey=${res.data.vkey}`})
    })
  }
})
