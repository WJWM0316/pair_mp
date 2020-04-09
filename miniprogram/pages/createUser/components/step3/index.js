import {
  createUserStep3Api
} from '../../../../api/user'

import {
  companyNameReg,
  positionReg
} from '../../../../utils/fieldRegular'
import {getUserInfo} from '../../../../utils/auth.js'

import {
  getUserInfo
} from '../../../../utils/auth'

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
        this.setData({formData}, () => wx.removeStorageSync('searchCompany'))
      }
    }
  },
  methods: {
    getPickerData(e) {
      let { formData } = this.data
      formData.occupationDesc = `${e.detail.p.name} - ${e.detail.name}`
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
        params = Object.assign(params, {company_name: formData.company_name.trim(), company_id: formData.company_id ? formData.company_id : 0})
      }
      if(formData.position_name) {
        params = Object.assign(params, {position_name: formData.position_name.trim()})
      }
      if(!positionReg.test(params.position_name)) {
        formData['position_name'] = params.position_name
        this.setData({ formData }, () => app.wxToast({title: '职位名称需为2-20个字'}))
        return
      }
      if(!companyNameReg.test(params.company_name)) {
        formData['company_name'] = params.company_name
        this.setData({ formData }, () => app.wxToast({title: '公司名称需为2-50个字'}))
        return
      }
      createUserStep3Api(params).then(({ data }) => {
        getUserInfo().then(() => {         
          let { PAGEPATH } = app.globalData
          let userInfo = data.userInfo
          let { formData } = this.data
          let that = that
          if(!userInfo.isCareerIdentity && userInfo.companyId && userInfo.isNeedCareerIdentity) {
            app.wxConfirm({
              title: '职业信息尚未认证',
              content: '跳过认证将降低你的主页展示率',
              cancelText: '暂不认证',
              confirmText: '前往认证',
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
