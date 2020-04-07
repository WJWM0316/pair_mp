const app =  getApp();
Component({
  /**
   * 组件的属性列表
   */
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
    },
    userInfo: {
      type: Object,
      value: {},
      observer (val) {
      }
    }
  },
  attached () {
  },
  /**
   * 组件的初始数据
   */
  data: {
    titleHeight: app.globalData.systemInfo.titleHeight,
    statusBarHeight: app.globalData.systemInfo.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    show: false
  },
  ready () {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    routeJump() {
      this.setData({show: true})
    },
    back() {
      wx.navigateBack({ delta: 1 })
    }
  }
})