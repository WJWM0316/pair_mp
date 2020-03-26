import {
  getQuestionListApi
} from '../../../api/question.js'
let app = getApp()
Page({
  data: {
    list: []
  },
  onShow() {
    getQuestionListApi().then(({ data }) => {
      this.setData({ list: data })
    })
  },
  onClick(e) {
    let { PAGEPATH } = app.globalData
    let { info } = e.currentTarget.dataset
    wx.setStorageSync('question', info)
    wx.redirectTo({
      url: `${PAGEPATH}/answer/add/index`
    })
  }
})