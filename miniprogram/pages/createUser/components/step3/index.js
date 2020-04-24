import {
  createUserStep3Api
} from '../../../../api/user'

import {
  companyNameReg,
  positionReg
} from '../../../../utils/fieldRegular'
import {getUserInfo} from '../../../../utils/auth.js'

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
    canClick: false,
    stepFinish: 0
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
      app.getSubscribeTime({types: 'stepFinish'}).then(res => this.setData({stepFinish: res.times.stepFinish}))
    }
  },
  methods: {
    getPickerData(e) {
      let { formData } = this.data
      let {child, parent} = e.detail
      formData.occupationDesc = `${parent.name} - ${child.name}`
      formData.occupation = child.labelId
      formData.companyRequired = child.companyRequired
      this.setData({ formData, canClick: true })
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
    subscribe() {
      app.subscribeMessage('stepFinish').then(() => {
        app.recordSubscribeTime({type: 'stepFinish', expire: 1000 * 60 * 60 * 24 * 1}).then(() => {
          this.setData({stepFinish: 1})
          this.submit()
        }) 
      }).catch(() => {})
    },
    submit() {
      let { formData } = this.data
      let params = {
        occupation: formData.occupation,
        is_need_email_verify: formData.is_need_email_verify ? 1 : 0
      }
      if(formData.company_name) {
        params = Object.assign(params, {company_name: formData.company_name.trim(), company_id: formData.company_id ? formData.company_id : 0})
      }
      if(formData.position_name) {
        params = Object.assign(params, {position_name: formData.position_name.trim()})
      }
      if((formData.companyRequired && !params.company_name) || !companyNameReg.test(params.company_name)) {
        formData['company_name'] = params.company_name
        this.setData({ formData }, () => app.wxToast({title: '公司名称需为2-50个字'}))
        return
      }
      if((formData.companyRequired && !params.position_name) || !positionReg.test(params.position_name)) {
        formData['position_name'] = params.position_name
        this.setData({ formData }, () => app.wxToast({title: '职位名称需为2-20个字'}))
        return
      }
      createUserStep3Api(params).then(({ data }) => {
        getUserInfo().then(() => {         
          let { PAGEPATH } = app.globalData
          let userInfo = data.userInfo
          if(!userInfo.isCareerIdentity && userInfo.companyId && userInfo.isNeedCareerIdentity) {
            app.wxConfirm({
              title: '职业信息尚未认证',
              content: '跳过认证将降低你的主页展示率',
              cancelText: '暂不认证',
              confirmText: '前往认证',
              confirmBack() {
                wx.redirectTo({
                  url: `${PAGEPATH}/methods/index?type=createUser&companyId=${userInfo.companyId}`
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
