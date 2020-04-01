
const app = getApp()
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    infos: {
      type: Object,
      value: {}
    }
  },
  data: {
    CDNPATH: app.globalData.CDNPATH,
    userInfo: {}
  },
  ready () {
    this.setData({'userInfo': app.globalData.userInfo.userInfo})
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
    },
    setting () {
      let { PAGEPATH } = app.globalData
      wx.navigateTo({
        url: `${PAGEPATH}/setting/index`
      })
    }
  }
})
