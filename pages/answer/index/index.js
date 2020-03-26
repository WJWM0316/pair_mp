import {
  getQuestionListApi
} from '../../../api/question.js'
let app = getApp()
Page({
  data: {
    list: []
  },
  onShow() {
    getQuestionListApi().then(res => {
      console.log(res)
    })
  }
})