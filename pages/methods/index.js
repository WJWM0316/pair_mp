import {
  hasCompanyEmailApi,
  verifyCareerApi
} from '../../api/common.js'
const app = getApp()
Page({
  data: {
    CDNPATH: '',
    showEmailEntry: false,
    email: '',
    emailSuffix: '',
    show: false,
    itemList: [
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
    ],
    formData: {}
  },
  onLoad(options) {
    let { CDNPATH } = app.globalData
    this.setData({ CDNPATH })
    options.companyId && this.hasCompanyEmail(options)
  },
  onShow() {
    let formData = wx.getStorageSync('searchCompany')
    if(formData) {
      this.setData({formData}, () => wx.removeStorageSync('searchCompany'))
    }
  },
  hasCompanyEmail(options) {
    hasCompanyEmailApi({company_id: options.companyId}).then(({ data }) => {
      let showEmailEntry = data.emailSuffix ? data.emailSuffix : false
      this.setData({showEmailEntry, ...data})
    }).catch(err => app.wxToast({title: err.msg}))
  },
  stopPageScroll() {
	  return false
  },
  open(e) {
    let params = e
    this.setData({ show: true})
  },
  verifyCareer(attach_id) {
    verifyCareerApi({attach_id}).then(() => {
      wx.navigateBack({ delta: 1 })
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
        app.photoUpload(1).then(({ data }) => {
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
    let { emailSuffix, formData } = this.data
    wx.setStorageSync('searchCompany', formData)
    wx.navigateTo({
      url: `${PAGEPATH}/email/index?emailSuffix=${emailSuffix}`
    })
  }
})