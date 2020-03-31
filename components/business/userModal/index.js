import {
  getUserInfoApi
} from '../../../api/user.js'

const app = getApp()
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },
  data: {
    CDNPATH: app.globalData.CDNPATH,
    userInfo: {}
  },
  pageLifetimes: {
    show() {
      setTimeout(() => {
        let { userInfo } = app.globalData.userInfo
        this.setData({ userInfo })
      }, 3000)
    }
  },
  methods: {
    close() {
      this.setData({show: !this.data.show})
    },
    routeJump() {
      let { PAGEPATH } = app.globalData
      wx.navigateTo({
        url: `${PAGEPATH}/homepage/index?vkey=${'ighvcabv'}`
      })
    },
    upload() {
      let { PAGEPATH } = app.globalData
      let { userInfo } = this.data
      wx.setStorageSync('userInfo', userInfo)
      wx.navigateTo({
        url: `${PAGEPATH}/album/index`
      })   
    },
    update() {
      let { PAGEPATH } = app.globalData
      wx.navigateTo({
        url: `${PAGEPATH}/userInfo/index`
      })
    }
  }
})
