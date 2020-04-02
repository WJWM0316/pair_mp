import {
  getMyInfoApi
} from '../../api/user.js'
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
    albumVerifyInfo: {}
  },
  onShow() {
    let callback = () => {
      let res = app.globalData.userInfo
      let { userInfo, careerVerifyInfo, pickIntention, albumVerifyInfo } = res
      let { userLabelList, userAnswerList, isAllQuestion } = userInfo
      if(!Object.keys(careerVerifyInfo).length) {
        careerVerifyInfo = Object.assign(careerVerifyInfo, { status: -1})
      }
      userLabelList.map((v,i) => {
        switch(v.labelId) {
          case 110000:
            v.iconName = 'icon_renshe'
            break
          case 120000:
            v.iconName = 'icon_meishi'
            break
          case 130000:
            v.iconName = 'icon_yundong'
            break
          case 140000:
            v.iconName = 'icon_yinle'
            break
          case 150000:
            v.iconName = 'icon_yingshi'
            break
          case 160000:
            v.iconName = 'icon_shuji'
            break
          case 170000:
            v.iconName = 'icon_erciyuan'
            break
          case 180000:
            v.iconName = 'icon_youxi'
            break
          case 190000:
            v.iconName = 'icon_lvhang'
            break
          default:
            v.iconName = 'icon_lvhang'
            break
        }
      })
      this.setData({
        userInfo,
        careerVerifyInfo,
        pickIntention,
        userLabelList,
        userAnswerList,
        isAllQuestion,
        albumVerifyInfo
      })
    }
    if (app.globalData.userInfo) {
      callback()
    } else {
      app.getUserInfo = () => callback()
    }
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
    let { userLabelList } = this.data
    let { PAGEPATH } = app.globalData
    wx.setStorageSync('labelList', userLabelList)
    wx.navigateTo({
      url: `${PAGEPATH}/perfectUser/index?type=edit&step=2`
    })   
  }
})