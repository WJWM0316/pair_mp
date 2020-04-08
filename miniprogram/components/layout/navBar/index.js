const app =  getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    navBarBg: {
      type: String,
      value: "#F3F3F3"
    },
    color: {
      type: String,
      value: "#1F252B"
    },
    page: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
    }
  },
  data: {
    showBackBtn: false,
  },
  pageLifetimes: {
    show: function() {
      let callback = () => {
        let route = getCurrentPages()
        let  { showBackBtn } = this.data
        let { userInfo } = app.globalData.userInfo
        showBackBtn = route.length > 1 ? true : false
        this.setData({userInfo, showBackBtn})
      }
      if (app.globalData.userInfo) {
        callback()
      } else {
        app.getUserInfo = () => callback()
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    titleHeight: app.globalData.systemInfo.titleHeight,
    statusBarHeight: app.globalData.systemInfo.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    show: false,
    userInfo: {},
    CDNPATH: app.globalData.CDNPATH
  },
  ready () {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    openPicker() {
      this.setData({show: true})
    },
    reback() {
      if (this.data.customBack) {
        this.triggerEvent('backEvent')
      } else {
        wx.navigateBack({delta: 1})
      }
    }
  }
})
