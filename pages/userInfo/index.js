import {
  getMyInfoApi
} from '../../api/user.js'
let app = getApp()
Page({
  data: {
    userInfo: {}
  },
  onShow() {
    wx.removeStorageSync('userInfo')
    getMyInfoApi().then(({ data }) => {
      let userInfo = data.userInfo
      this.setData({ userInfo })
    })
  },
  routeJump(e) {
    let { userInfo } = this.data
    let { key } = e.currentTarget.dataset
    let { PAGEPATH } = app.globalData
    wx.setStorageSync('userInfo', userInfo)
    wx.navigateTo({
      url: `${PAGEPATH}/editUser/index?key=${key}`
    })    
  }
})