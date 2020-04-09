const app =  getApp();
import {registerApi, sendMsgApi} from '../../api/auth.js'
import {getPhoneNumber, phoneCodeLogin} from '../../utils/index.js'
import {mobileReg} from '../../utils/fieldRegular.js'

Page({
  data: {
    canClick: false,
    cdnPath: app.globalData.CDNPATH,
    sendTimes: 60
  },
  onLoad(options) {
    this.options = options
  },
  onShow() {},
  getPhoneNumber (e) {
    if (e.detail.errMsg.indexOf('fail') !== -1) return
    getPhoneNumber(e, this.options)
  },
  bindinput (e) {
    switch(e.currentTarget.dataset.type) {
      case 'phone':
        this.phone = e.detail.value
        break
      case 'code':
        this.code = e.detail.value
        break
    }
    if (this.phone && this.code) {
      if (!this.data.canClick) this.setData({canClick: true})
    } else {
      if (this.data.canClick) this.setData({canClick: false})
    }
  },
  countDown () {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      let sendTimes = this.data.sendTimes
      if (sendTimes > 0) {
        sendTimes--
        this.countDown()
      } else {
        sendTimes = 60
        clearTimeout(this.timer)
      }
      this.setData({sendTimes})
    }, 1000)
  },
  sendMsg () {
    if (mobileReg.test(this.phone)) {
      sendMsgApi({mobile: this.phone}).then(res => {
        this.countDown()
        app.wxToast({title: '发送成功', icon: 'success'})
      })
    } else {
      app.wxToast({title: '请输入正确是手机号'})
    }
  },
  login () {
    let data = {
      mobile: this.phone,
      code: this.code
    }
    phoneCodeLogin(data, this.options)
  },
  userAgreement () {
    let WEBVIEW = app.globalData.WEBVIEW,
        url     = `${WEBVIEW}/art/userProtocol/index.html`
    wx.navigateTo({url: `/pages/webview/index?p=${encodeURIComponent(url)}`})
  },
  onUnload() {
    clearTimeout(this.timer)
  },
  onShareAppMessage(options) {
    return app.wxShare({options})
  }
})