import {
  hasCompanyEmailApi
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
    ]
  },
  onLoad(options) {
    let { CDNPATH } = app.globalData
    this.setData({ CDNPATH })
    options.companyId && this.hasCompanyEmail(options)
  },
  hasCompanyEmail(options) {
    hasCompanyEmailApi({company_id: options.companyId}).then(({ data }) => {
      let showEmailEntry = data.emailSuffix ? data.emailSuffix : false
      this.setData({showEmailEntry, ...data})
    })
  },
  stopPageScroll() {
	  return false
  },
  open(e) {
    let params = e
    this.setData({ show: true})
    console.log(1)
  },
  drawerAction(e) {
    let detail = e.detail
    let that = this
    switch(detail.action) {
      case 'photo':
        that.setData({ show: false})
        app.chooseImageUpload(1).then(({ data }) => {
          let result = data.attachListItem[0]
          console.log(result)
        })
        break
      case 'camera':
        that.setData({ show: false})
        app.photoUpload(1).then(({ data }) => {
          let result = data.attachListItem[0]
          console.log(result)
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
    let { emailSuffix } = this.data
    wx.navigateTo({
      url: `${PAGEPATH}/email/index?emailSuffix=${emailSuffix}`
    })
  }
})