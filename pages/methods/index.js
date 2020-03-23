const app = getApp()
Page({
  data: {
    show: false,
    CDNPATH: ''
  },
  onShow() {
    let { CDNPATH } = app.globalData
    this.setData({ CDNPATH })
    console.log(CDNPATH)
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