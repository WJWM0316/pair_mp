import {
  hasCompanyEmailApi,
  verifyCareerApi
} from '../../api/common.js'
import {getUserInfo} from '../../utils/index.js'
const app = getApp()
Page({
  data: {
    showEmailEntry: false,
    show: false,
    itemList: [],
    formData: {},
    updateCareer: 0
  },
  onLoad(options) {
    this.setData({ options })
    app.getSubscribeTime({types: 'updateCareer'}).then(res => this.setData({updateCareer: res.times.updateCareer}))
    options.companyId && this.hasCompanyEmail(options)
  },
  // async onShow() {
  //   let { options } = this.data
  //   options.companyId && this.hasCompanyEmail(options)
  // },
  subscribe() {
    app.subscribeMessage('updateCareer').then(() => {
      app.recordSubscribeTime({type: 'updateCareer', expire: 1000 * 60 * 60 * 24 * 1}).then(() => {
        this.setData({updateCareer: 1})
        this.open()
      })      
    }).catch(() => {})
  },
  hasCompanyEmail(options) {
    hasCompanyEmailApi({company_id: options.companyId}).then(({ data }) => {
      let showEmailEntry = data.emailSuffix ? data.emailSuffix : false
      let { formData } = this.data
      formData = Object.assign(formData, data, {company_id: options.companyId})
      this.setData({showEmailEntry, formData})
    }).catch(err => app.wxToast({title: err.msg}))
  },
  stopPageScroll() {
	  return false
  },
  open(e) {
    let itemList = [
      {
        text: '从相册选择相片',
        action: 'photo'
      },
      {
        text: '拍摄',
        action: 'camera'
      },
      {
        text: '取消',
        action: 'cancle'
      }
    ]
    this.setData({ show: true, itemList})
  },
  verifyCareer(attach_id) {
    let { PAGEPATH } = app.globalData
    let { options } = this.data
    verifyCareerApi({attach_id}).then(() => {
      getUserInfo().then(() => {
        if(options.type === 'createUser') {
          wx.reLaunch({
            url: `${PAGEPATH}/index/index`
          })
        } else {
          if(options.reback) {
            wx.navigateBack({ delta: 2 })
          } else {
            wx.navigateBack({ delta: 1 })
          }          
        }        
      })     
    }).catch(err => app.wxToast({title: err.msg}))
  },
  drawerAction(e) {
    let detail = e.detail
    let that = this
    switch(detail.action) {
      case 'photo':
        that.setData({ show: false})
        app.chooseImageUpload().then(({ data }) => {
          let result = data.attachListItem[0]
          this.verifyCareer(result.id)
        })
        break
      case 'camera':
        that.setData({ show: false})
        app.photoUpload(false).then(({ data }) => {
          let result = data.attachListItem[0]
          this.verifyCareer(result.id)
        })
        break
      default:
        break
    }
  },
  close() {
	  this.setData({ show: false})
  },
  fillEmail() {
    let { PAGEPATH } = app.globalData
    let { formData } = this.data
    formData.email = ''
    wx.setStorageSync('searchCompany', formData)
    wx.navigateTo({
      url: `${PAGEPATH}/email/index?emailSuffix=${formData.emailSuffix}`
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    return app.wxShare({options})
  }
})