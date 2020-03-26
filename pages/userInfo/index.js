import {
  getMyInfoApi
} from '../../api/user.js'
let app = getApp()
Page({
  data: {
    userInfo: {},
    careerVerifyInfo: {},
    pickIntention: {}
  },
  onShow() {
    wx.removeStorageSync('userInfo')
    getMyInfoApi().then(({ data }) => {
      let { userInfo, careerVerifyInfo, pickIntention } = data
      this.setData({ userInfo, careerVerifyInfo, pickIntention })
    })
  },
  routeJump(e) {
    let { userInfo } = this.data
    let { key } = e.currentTarget.dataset
    let { PAGEPATH } = app.globalData
    wx.setStorageSync('user', this.data)
    wx.navigateTo({
      url: `${PAGEPATH}/editUser/index?key=${key}`
    })    
  }
})