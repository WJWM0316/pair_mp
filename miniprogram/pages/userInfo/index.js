import {
  getUserInfo
} from '../../utils/auth'
import {
  setIconType
} from '../../utils/util.js'
let app = getApp()
Page({
  data: {
    userInfo: {},
    careerVerifyInfo: {
      status: -1
    },
    pickIntention: {},
    questionList: [],
    userLabelList: [],
    isAllQuestion: 0,
    albumVerifyInfo: {},
    CDNPATH: app.globalData.CDNPATH
  },
  onShow() {
    this.getUser()
  },
  getUser() {
    return new Promise((resolve, reject) => {
      getUserInfo().then(() => {
        let res = app.globalData.userInfo
        let { userInfo, careerVerifyInfo, pickIntention, albumVerifyInfo } = res
        let { userLabelList, userAnswerList, isAllQuestion } = userInfo
        userLabelList.map(v => setIconType(v))
        this.setData({
          userInfo,
          careerVerifyInfo,
          pickIntention,
          userLabelList,
          userAnswerList,
          isAllQuestion,
          albumVerifyInfo
        }, () => resolve())
      })
    })
  },
  routeJump(e) {
    let { key } = e.currentTarget.dataset
    let { PAGEPATH } = app.globalData
    wx.navigateTo({
      url: `${PAGEPATH}/editUser/index?key=${key}`
    })    
  },
  openAlbum() {
    let { PAGEPATH } = app.globalData
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
    let { PAGEPATH } = app.globalData
    wx.navigateTo({
      url: `${PAGEPATH}/perfectUser/index?type=edit&step=2`
    })   
  },
  toast() {
    app.wxToast({title: '公司信息认证中，暂时无法编辑'})
  },
  onPullDownRefresh() {
    this.getUser().then(() => wx.stopPullDownRefresh())    
  }
})