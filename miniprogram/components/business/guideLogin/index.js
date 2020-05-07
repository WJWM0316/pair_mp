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
    open: {
      type: Boolean,
      value: false
    },
    type: {
      type: String,
      value: 'default',
      observer(newVal, oldVal) {
      } 
    }
  },
  
  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toggle () {
      app.wxReportAnalytics('button_click_event', {
        button_id: 'guide_login_tab',
        button_name: 'Pick功能引导登录',
        result: !this.data.open
      })
      this.setData({'open': !this.data.open})
    },
    userAgreement () {
      let WEBVIEW = app.globalData.WEBVIEW,
          url     = `${WEBVIEW}/art/userProtocol/index.html`
      wx.navigateTo({url: `/pages/webview/index?p=${encodeURIComponent(url)}`})
    },
    login () {
      app.wxReportAnalytics('button_click_event', {
        button_id: 'Tel-enter',
        button_name: '手机号登录'
      })
      wx.navigateTo({
        url: `/pages/login/index?redirectTo=${encodeURIComponent(getCurrentPagePath())}`
      })
    },
    getPhoneNumber (e) {
      app.wxReportAnalytics('button_click_event', {
        button_id: 'WeChat-enter',
        button_name: '微信登录'
      })
      let options = {
        redirectTo: encodeURIComponent(getCurrentPagePath())
      }
      getPhoneNumber(e, options)
    }
  }
})
