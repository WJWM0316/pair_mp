const app =  getApp();
import {
  sendEmailApi,
  verifyEmailApi
} from '../../api/common.js'

import {
  emailReg
} from '../../utils/fieldRegular.js'
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
  onShow() {
    let searchCompany = wx.getStorageSync('searchCompany')
    let formData = Object.assign(this.data.formData, searchCompany)
    if(searchCompany) {
      this.setData({formData}, () => wx.removeStorageSync('searchCompany'))
      console.log(this.data, 'app')
    }
  },
  bindInput(e) {
    let { key } = e.currentTarget.dataset
    let { value } = e.detail
    let { formData, emailSuffix } = this.data
    if(`${value}${emailSuffix}` !== formData[key]) {
      formData[key] = value
      this.setData({ formData })
    }
  },
  isEmail() {
    let { formData, emailSuffix } = this.data
    if(!emailReg.test(`${formData.email}${emailSuffix}`)) {
      app.wxToast({title: '请输入正确的邮箱地址'})
    }
    return emailReg.test(`${formData.email}${emailSuffix}`)
  },
  sendEmail() {
    let { formData, emailSuffix } = this.data
    let email = `${formData.email}${emailSuffix}`
    if(!this.isEmail()) return
    sendEmailApi({email, company_id: formData.company_id }).then(res => {
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
    let { formData } = this.data
    let { PAGEPATH } = app.globalData
    verifyEmailApi({code: formData.code, company_id: formData.id}).then(res => {
      if(formData.from) {
        wx.reLaunch({
          url: `${PAGEPATH}/index/index`
        })
      } else {
        wx.navigateBack({ delta: 1 })
      }
    }).catch(err => app.wxToast({title: err.msg}))
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    return app.wxShare({options})
  }
})