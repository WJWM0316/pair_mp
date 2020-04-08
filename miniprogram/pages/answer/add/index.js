import {
  postQuestionApi,
  removeQuestionApi
} from '../../../api/question.js'
let app = getApp()
Page({
  data: {
    info: {
      body: ''
    },
    options: {}
  },
  onLoad(options) {
    let info = wx.getStorageSync('question')
    this.setData({ options, info: Object.assign(this.data.info, info)}, () => wx.removeStorageSync('question'))
  },
  bindInput(e) {
    let { info } = this.data
    let { value } = e.detail
    if(info.body !== value) {
      info.body = value
      this.setData({ info })
    }
  },
  delete() {
    let { options } = this.data
    removeQuestionApi({id: options.id}).then(() => {
      app.globalData.userInfo.userInfo.userAnswerList = app.globalData.userInfo.userInfo.userAnswerList.filter(v => v.id != options.id )
      wx.navigateBack({ delta: 1 })
    }).catch(err => app.wxToast({title: err.msg}))
  },
  save() {
    let { info } = this.data
    if(!info.body.trim()) {
      app.wxToast({title: '请添加问答内容'})
      return
    }
    let params = {
      question_id: info.questionId || info.id,
      body: info.body
    }
    postQuestionApi(params).then(res => {
      app.reloadUserInfo().then(() => {
        wx.navigateBack({ delta: 1 })
      })   
    }).catch(err => app.wxToast({title: err.msg}))
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    return app.wxShare({options})
  }
})