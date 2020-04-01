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
    let callback = () => {
      let { userInfo } = app.globalData.userInfo
      this.setData({ userInfo })
    }

    if (app.globalData.userInfo) {
      callback()
    } else {
      app.getUserInfo = () => callback()
    }
  },
  // attached () {
  //   let callback = () => {
  //     let { userInfo } = app.globalData.userInfo
  //     this.setData({ userInfo })
  //     console.log(userInfo, 'llll')
  //   }
  //   if (app.globalData.userInfo) {
  //     callback()
  //   } else {
  //     app.getUserInfo = () => {
  //       callback()
  //     }
  //   }
  // },
  // pageLifetimes: {
  //   show() {
  //     if (app.globalData.userInfo) {
  //       console.log(app.globalData.userInfo, 'k')
  //     } else {
  //       app.getUserInfo = () => {
  //         console.log(app.globalData.userInfo, 'b')
  //       }
  //     }
  //   }
  // },
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
