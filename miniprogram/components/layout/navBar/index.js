import {localstorage, hasLogin} from "../../../utils/index.js"
const app =  getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    type: {
      type: String,
      value: ''
    },
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
    hasLogin: {
      type: Boolean,
      value: true
    }
  },
  data: {
    showBackBtn: true
  },
  pageLifetimes: {
    async show() {
      let callback = () => {
        let route = getCurrentPages()
        let  { showBackBtn } = this.data
        let { userInfo } = app.globalData
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
    showGender: false,
    userInfo: {},
    CDNPATH: app.globalData.CDNPATH
  },
  attached () {
    this.triggerEvent('genderToggle', this.data.showGender)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    openPicker() {
      if (!this.data.hasLogin) {
        this.setData({showGender: !this.data.showGender})
        this.triggerEvent('genderToggle', this.data.showGender)
        return
      }
      let userInfo = this.data.userInfo
      if (userInfo && userInfo.userInfo && userInfo.userInfo.id && userInfo.userInfo.step === 9) {
        this.setData({show: true})
      }
    },
    choiceGender () {
      this.openPicker()
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
