import {
  createUserStep3Api
} from '../../../../api/user'
const app = getApp()
Component({
  properties: {

  },
  data: {
    formData: {
      company_name: '',
      position_name: '',
      occupation: '',
      occupationDesc: '',
      is_need_email_verify: 0
    },
    status: 1,
    canClick: false
  },
  pageLifetimes: {
    show() {
      let { formData } = this.data
      let storage = wx.getStorageSync('searchCompany')
      if(formData.company_name !== storage.company_name) {
        formData.company_name = storage.company_name
        formData.is_need_email_verify = storage.is_need_email_verify
        this.setData({formData})
        setTimeout(() => wx.removeStorageSync('searchCompany'), 16.7)
      }
    }
  },
  methods: {
    getPickerData(e) {
      let { formData } = this.data
      formData.occupationDesc = e.detail.name
      formData.occupation = e.detail.labelId
      this.setData({ formData, canClick: true })
    },
    legalize() {
      let { PAGEPATH } = app.globalData
      wx.navigateTo({
        url: `${PAGEPATH}/methods/index`
      })
    },
    bindInput(e) {
      let { formData } = this.data
      let { value } = e.detail
      let { key } = e.currentTarget.dataset
      if(value !== formData[key]) {
        formData[key] = value
        this.setData({ formData })
      }
    },
    jump() {
      let { PAGEPATH } = app.globalData
      wx.setStorageSync('searchCompany', this.data.formData.company_name)
      wx.navigateTo({
        url: `${PAGEPATH}/searchCompany/index`
      })
    },
    next() {
      let { formData } = this.data
      let params = {
        occupation: formData.occupation,
        is_need_email_verify: formData.is_need_email_verify
      }
      if(formData.company_name) {
        params = Object.assign(params, {company_name: formData.company_name})
      }
      if(formData.position_name) {
        params = Object.assign(params, {position_name: formData.position_name})
      }
      createUserStep3Api(params).then(() => {
        let { PAGEPATH } = app.globalData
        wx.navigateTo({
          url: `${PAGEPATH}/index`
        })
      }).catch(err => app.wxToast({title: err.msg}))
    }
  }
})
