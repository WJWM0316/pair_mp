import {
  postQuestionApi
} from '../../../api/question.js'
let app = getApp()
Page({
  data: {
    info: {},
    options: {},
    canClick: false,
    body: ''
  },
  onLoad(options) {
    let info = wx.getStorageSync('question')
    this.setData({ options, info}, () => wx.removeStorageSync('question'))
  },
  bindInput(e) {
    let { body } = this.data
    let { value } = e.detail
    if(body !== value) {
      this.setData({body: value})
    }
  },
  save() {
    let { info, body } = this.data
    if(!body.trim()) {
      app.wxToast({title: '请添加问答内容'})
      return
    }
    let params = {
      question_id: info.id,
      body
    }
    postQuestionApi(params).then(res => {
      wx.navigateBack({ delta: 1 })
    }).catch(err => app.wxToast({title: err.msg}))
  }
})