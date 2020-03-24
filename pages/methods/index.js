import {
  hasCompanyEmailApi
} from '../../api/common.js'
const app = getApp()
Page({
  data: {
    show: false,
    CDNPATH: '',
    showEmailEntry: false,
    email: '',
    emailSuffix: ''
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
  close() {
	  this.setData({ show: false})
  },
  open() {
  	this.setData({ show: true})
  },
  fillEmail() {
    let { PAGEPATH } = app.globalData
    wx.navigateTo({
      url: `${PAGEPATH}/email/index`
    })
  },
  chooseImage(e) {
    let that = this
    let { from } = e.currentTarget.dataset
    that.setData({show: false})
    if(from === 'album') {
      app.chooseImageUpload().then(res => {
        app.uploadFile(res.tempFiles[0]).then(({ data }) => {
          let result = data.attachListItem[0]
          console.log(result)
        }).catch(err => {

        })
      })
    } else {
      app.photoUpload().then(res => {
        app.uploadFile(res.tempFiles[0]).then(({ data }) => {
          let result = data.attachListItem[0]
          console.log(result)
        }).catch(err => {

        })
      })
    }
  }
})