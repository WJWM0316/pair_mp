const app =  getApp();
import {
  sendEmailApi,
  verifyEmailApi
} from '../../api/common.js'

let emailReg = /^([a-zA-Z0-9]+[_|\_|\.|\-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,8}$/
let timer = null
Page({
  data: {
    time: 60,
    defaultTime: 60,
    editable: false,
    canResend: false,
    emailSuffix: '',
    formData: {
      email: '',
      code: ''
    }
  },
  onLoad(options) {
    this.setData({emailSuffix: options.emailSuffix})
  },
  bindInput(e) {
    let { key } = e.currentTarget.dataset
    let { value } = e.detail
    let { formData, emailSuffix } = this.data
    if(`${value}${emailSuffix}` !== formData[key]) {
      formData[key] = `${value}${emailSuffix}`
      this.setData({ formData })
    }
  },
  isEmail() {
    if(!emailReg.test(this.data.formData.email)) {
      app.wxToast({title: '请输入正确的邮箱地址'})
    }
    return emailReg.test(this.data.formData.email)
  },
  sendEmail() {
    if(!this.isEmail()) return
    sendEmailApi({email: this.data.formData.email}).then(res => {
      this.killTime()
    }).catch(err => app.wxToast({title: err.msg}))
  },
  editEmail() {
    if(timer) clearInterval(timer)
    this.setData({editable: false, time: this.data.defaultTime})
  },
  killTime() {
    console.log(1)
    let time = this.data.time
    this.setData({ editable: true })
    timer = setInterval(() => {
      time--
      if(time < 1) {
        clearInterval(timer)
        this.setData({canResend: true, time: this.data.defaultTime})
      } else {
        this.setData({time, canResend: false})
      }
    }, 1000)
  },
  onUnload() {
    clearInterval(timer)
  },
  verifyEmail() {
    verifyEmailApi({code: this.data.formData.code}).then(res => {
      wx.navigateBack({ delta: 1 })
    }).catch(err => app.wxToast({title: err.msg}))
  }
})