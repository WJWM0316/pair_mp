import {getUserInfoAuth} from "../../../utils/index.js"
const app =  getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value: 'follow'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    selected: true,
    cdnPath: app.globalData.CDNPATH
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close () {
      this.setData({'show': false})
    },
    show () {
      this.setData({'show': true})
    },
    toggle () {
      this.setData({selected: !this.data.selected})
    },
    jump () {
      let url = `${app.globalData.WEBVIEW}/art/userProtocol/index.html`
      wx.navigateTo({url: `/pages/webview/index?p=${encodeURIComponent(url)}`})
    },
    toast () {
      if (!this.data.selected) {
        app.wxToast({title: '请先勾选用户协议'})
        return
      }
    },
    onGotUserInfo (e) {
      this.close()
      getUserInfoAuth(e)
    }
  }
})
