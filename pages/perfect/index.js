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
  }
})