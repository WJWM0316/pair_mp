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
      if(!Object.keys(careerVerifyInfo).length) {
        careerVerifyInfo = Object.assign(careerVerifyInfo, { status: -1})
      }
      this.setData({ userInfo, careerVerifyInfo, pickIntention })
    })
  },
  routeJump(e) {
    let { key } = e.currentTarget.dataset
    let { PAGEPATH } = app.globalData
    wx.setStorageSync('user', this.data)
    wx.navigateTo({
      url: `${PAGEPATH}/editUser/index?key=${key}`
    })    
  },
  openAlbum() {
    let { PAGEPATH } = app.globalData
    wx.navigateTo({
      url: `${PAGEPATH}/album/index`
    })   
  }
})