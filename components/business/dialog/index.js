const app = getApp()
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    code: {
      type: Number,
      value: 0
    },
  },
  data: {
    show: true,
    CDNPATH: app.globalData.CDNPATH,
    userInfo: {
      infoCompletePercent: 90,
      infoCompletePercentDesc: '90%'
    }
  },
  methods: {
    show() {
      this.setData({ show: true })
    },
    close() {
      this.setData({ show: false })
    }
  }
})
