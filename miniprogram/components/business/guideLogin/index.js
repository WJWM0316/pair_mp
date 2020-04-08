import {getCurrentPagePath, getPhoneNumber} from '../../../utils/index.js'
const app =  getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    open: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toggle () {
      this.setData({'open': !this.data.open})
    },
    userAgreement () {
      let WEBVIEW = app.globalData.WEBVIEW,
          url     = `${WEBVIEW}/art/userProtocol/index.html`
      wx.navigateTo({url: `/pages/webview/index?p=${encodeURIComponent(url)}`})
    },
    login () {
      wx.navigateTo({
        url: `/pages/login/index?redirectTo=${encodeURIComponent(getCurrentPagePath())}`
      })
    },
    getPhoneNumber (e) {
      let options = {
        redirectTo: encodeURIComponent(getCurrentPagePath())
      }
      getPhoneNumber(e, options)
    }
  }
})
