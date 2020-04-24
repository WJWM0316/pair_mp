import {
  getQuestionListApi
} from '../../../api/question.js'
let app = getApp()
Page({
  data: {
    list: [],
    CDNPATH: app.globalData.CDNPATH
  },
  onLoad() {
    getQuestionListApi().then(({ data }) => this.setData({ list: data }))
  },
  onClick(e) {
    let { PAGEPATH } = app.globalData
    let { info } = e.currentTarget.dataset
    wx.setStorageSync('question', info)
    wx.redirectTo({ url: `${PAGEPATH}/answer/add/index`})
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    return app.wxShare({options})
  }
})