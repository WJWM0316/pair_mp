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
      is_need_email_verify: 0,
      companyRequired: 0,
      company_id: 0,
      from: 'createUser'
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
        formData.company_id = storage.company_id
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
      formData.companyRequired = e.detail.companyRequired
      this.setData({ formData, canClick: true })
    },
    legalize() {
      let { PAGEPATH } = app.globalData
      let { formData } = this.data
      wx.setStorageSync('searchCompany', formData)
      wx.navigateTo({
        url: `${PAGEPATH}/methods/index?companyId=${formData.company_id ? formData.company_id : ''}`
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
        params = Object.assign(params, {company_name: formData.company_name, company_id: formData.company_id ? formData.company_id : 0})
      }
      if(formData.position_name) {
        params = Object.assign(params, {position_name: formData.position_name})
      }
      createUserStep3Api(params).then(({ data }) => {
        app.reloadUserInfo().then(() => {         
          let { PAGEPATH } = app.globalData
          let userInfo = data.userInfo
          let { formData } = this.data
          let that = that
          if(!userInfo.isCareerIdentity && userInfo.companyId && userInfo.isNeedCareerIdentity) {
            app.wxConfirm({
              title: '认证',
              content: '是否前往职业认证',
              cancelText: '取消',
              confirmText: '确认',
              confirmBack() {
                wx.setStorageSync('searchCompany', formData)
                wx.redirectTo({
                  url: `${PAGEPATH}/methods/index?type=createUser&companyId=${userInfo.companyId ? userInfo.companyId : ''}`
                })
              },
              cancelBack() {
                wx.reLaunch({
                  url: `${PAGEPATH}/index/index`
                })
              }
            })
          } else {
            wx.reLaunch({
              url: `${PAGEPATH}/index/index`
            })
          }
        })
      }).catch(err => app.wxToast({title: err.msg}))
    }
  }
})