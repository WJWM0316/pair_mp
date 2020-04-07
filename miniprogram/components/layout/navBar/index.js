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
  pageLifetimes: {
    show: function() {
      if (app.globalData.userInfo) {
        this.setData({'userInfo': app.globalData.userInfo.userInfo})
      } else {
        app.getUserInfo = () => {
          this.setData({'userInfo': app.globalData.userInfo.userInfo})
        }
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
