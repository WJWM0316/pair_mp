const app = getApp()
Page({
  data: {
    show: false
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
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: [from],
      success (res) {
        that.upload(res.tempFiles[0])
      }
    })
  },
  upload(file) {
    let that = this
    let formData = {
      'img1': file.path,
      'size': file.size || 0,
      attach_type: 'img'
    }
    let { APIHOST } = app.globalData

    wx.uploadFile({
      url: `${APIHOST}/attaches`,
      filePath: file.path,
      methos: 'post',
      name: 'file',
      header: {
        'Authorization': wx.getStorageSync('token')
        // 'Wechat-Version': VERSION
      }, 
      formData,
      success(res) {
        wx.navigateBack({ delta: 1 })
        let data = typeof res.data === "string" ? JSON.parse(res.data) : res.data
        console.log(res)
      },
      fail(err) {
        //
      }
    })
  }
})