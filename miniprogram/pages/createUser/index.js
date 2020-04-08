Page({
  data: {
    step: 1
  },
  onLoad(options) {
    if (options.step) {
      this.setData({step: options.step})
    }
  },
  next() {
    let { step } = this.data
    step++
    this.setData({ step })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    return app.wxShare({options})
  }
})