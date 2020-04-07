const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageUrl: '',
    cdnPath: app.globalData.CDNPATH,
		h5Data: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.options = options
  },
  onShow() {
    this.setData({pageUrl: ''}, () => {
      this.init(this.options)
    })
  },
  init (options) {
    let pageUrl = ''
    let sessionToken = wx.getStorageSync('sessionToken')
    let token = wx.getStorageSync('token')
    if (options.p) {
      let path = decodeURIComponent(options.p)
      if (path.indexOf('?') !== -1) {
        pageUrl = `${path}&sessionToken=${sessionToken}&token=${token}`
      } else {
        pageUrl = `${path}?sessionToken=${sessionToken}&token=${token}`
      }
    }
    console.log('h5链接', pageUrl)
    this.setData({pageUrl})
  },
  getMessage (e) {
    if (e.detail.data[0].isShare) {
      this.wxShare = e.detail.data[0]
      console.log(this.wxShare, '分享信息')
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(options) {
    return app.wxShare({
      options,
      ...wxShare
    })
  }
})