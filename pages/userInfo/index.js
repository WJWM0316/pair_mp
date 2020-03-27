import {
  getMyInfoApi,
  getMyLabelApi
} from '../../api/user.js'
import {
  getMyQuestionListApi
} from '../../api/question.js'
let app = getApp()
Page({
  data: {
    userInfo: {},
    careerVerifyInfo: {},
    pickIntention: {},
    questionList: [],
    labelList: [],
    isAll: 0
  },
  onShow() {
    wx.removeStorageSync('userInfo')
    getMyInfoApi().then(({ data }) => {
      let { userInfo, careerVerifyInfo, pickIntention } = data
      if(!Object.keys(careerVerifyInfo).length) {
        careerVerifyInfo = Object.assign(careerVerifyInfo, { status: -1})
      }
      this.setData({ userInfo, careerVerifyInfo, pickIntention }, () => {
        if(userInfo.isHasQuestion) {
          getMyQuestionListApi().then(({data}) => {
            let { answerList, isAll} = data
            this.setData({questionList: answerList, isAll})
          })
        }
        if(userInfo.isHasLabel) {
          getMyLabelApi().then(({data}) => {
            this.setData({labelList: data})
          })
        }
      })
    })
  },
  routeJump(e) {
    let { key } = e.currentTarget.dataset
    let { PAGEPATH } = app.globalData
    wx.setStorageSync('user', this.data)
    wx.navigateTo({
      url: `${PAGEPATH}/editUser/index?key=${key}`
    })    
  },
  openAlbum() {
    let { PAGEPATH } = app.globalData
    let { userInfo } = this.data
    wx.setStorageSync('userInfo', userInfo)
    wx.navigateTo({
      url: `${PAGEPATH}/album/index`
    })   
  },
  addQuestion() {
    let { PAGEPATH } = app.globalData
    wx.navigateTo({
      url: `${PAGEPATH}/answer/index/index`
    })   
  },
  updateQuestion(e) {
    let { info } = e.currentTarget.dataset
    let { PAGEPATH } = app.globalData
    wx.setStorageSync('question', info)
    wx.navigateTo({
      url: `${PAGEPATH}/answer/add/index?id=${info.id}`
    })   
  },
  updateLabel(e) {
    let { labelList } = this.data
    let { PAGEPATH } = app.globalData
    wx.setStorageSync('labelList', labelList)
    wx.navigateTo({
      url: `${PAGEPATH}/perfectUser/index?type=edit&step=2`
    })   
  }
})