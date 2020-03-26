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
    labelList: []
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
            this.setData({questionList: data})
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
  }
})