const app =  getApp();
import {registerApi, sendMsgApi} from '../../api/auth.js'
import {getPhoneNumber, phoneCodeLogin} from '../../utils/index.js'
import {mobileReg} from '../../utils/fieldRegular.js'
import {captchaApi} from '../../api/common.js'
Page({
  data: {
    canClick: false,
    cdnPath: app.globalData.CDNPATH,
    imgPath: '',
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
      case 'imgcode':
        this.imgCode = e.detail.value
        break
    }
    let canClick = !this.key ? this.phone && this.code : this.phone && this.code && this.imgCode
    if (canClick) {
      if (!this.data.canClick) this.setData({canClick: true})
    } else {
      if (this.data.canClick) this.setData({canClick: false})
    }
  },
  changeImg () {
    captchaApi().then(res => {
      this.key = res.data.key
      let imgPath = res.data.img
      this.setData({imgPath})
    })
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
      app.wxToast({title: '请输入正确的手机号'})
    }
  },
  login () {
    let params = {
      mobile: this.phone,
      code: this.code,
      captchaKey: this.key,
      captchaValue: this.imgCode
    }
    console.log(params, this.key, this.imgCode)
    phoneCodeLogin(params, this.options).catch(e => {
      if (e.code = 419) {
        this.key = e.data.key
        let imgPath = e.data.img
        this.setData({imgPath})
      }
    })
  },
  userAgreement () {
    let WEBVIEW = app.globalData.WEBVIEW,
        url     = `${WEBVIEW}/art/userProtocol/index.html`
    wx.navigateTo({url: `/pages/webview/index?p=${encodeURIComponent(url)}`})
  },
  onUnload() {
    clearTimeout(this.timer)
  },
  onHide() {
    clearTimeout(this.timer)
  },
  onShareAppMessage(options) {
    return app.wxShare({options})
  }
})