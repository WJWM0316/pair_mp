import {
  getUserInfoApi
} from '../../api/user.js'
const app =  getApp();
Page({
  data: {
    careerVerifyInfo: {},
    pickIntention: {},
    userInfo: {},
    isOwer: true,
    currentIndex: 0,
    options: {},
    isError: false,
    albumVerifyInfo: {
      status: 1,
      statusDesc: '审核通过'
    },
    CDNPATH: app.globalData.CDNPATH
  },
  onLoad(options) {
    this.setData({ options })
  },
  legalize() {
    let { PAGEPATH } = app.globalData
    let { userInfo } = this.data
    wx.setStorageSync('searchCompany', {
      company_name: userInfo.companyName
    })
    wx.navigateTo({
      url: `${PAGEPATH}/methods/index?companyId=${userInfo.companyId ? userInfo.companyId : ''}`
    })
  },
  onShow() {
    let { options } = this.data
    let todoAction = () => {
      let res = app.globalData.userInfo
      let callback = (res, myself) => {
        let {
          userInfo,
          careerVerifyInfo = {},
          pickIntention = {},
          albumVerifyInfo = {
            status: 1,
            statusDesc: '审核通过'
          }
        } = res
        let { userLabelList, userAnswerList, isAllQuestion } = userInfo
        if(!Object.keys(careerVerifyInfo).length) {
          careerVerifyInfo = Object.assign(careerVerifyInfo, { status: -1})
        }
        let pIds = myself ? myself.userInfo.userLabelList.map(v => v.labelId): [];
        userLabelList.map((v,i) => {

          if (myself) {
            if(pIds.includes(v.labelId)) {
              let cIds = myself.userInfo.userLabelList.find(field => field.labelId === v.labelId).children.map(field => field.labelId)
              v.children.map(c => {
                if(cIds.includes(c.labelId)) {
                  c.active = true
                }
              })
            }
          }
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
        userInfo.birthDesc = userInfo.birth.slice(2, 4)
        this.setData({
          userInfo,
          careerVerifyInfo,
          pickIntention,
          userLabelList,
          userAnswerList,
          isAllQuestion,
          albumVerifyInfo,
          isOwer: myself ? false : true
        })
      }
      if(res.userInfo.vkey === options.vkey) {
        callback(res)
      } else {
        getUserInfoApi({vkey: options.vkey}).then(({ data }) => callback(data, res))
      }
    }
    if (app.globalData.userInfo) {
      todoAction()
    } else {
      app.getUserInfo = () => todoAction()
    }
  },
  bindchange(e) {
    let { current } = e.detail
    this.setData({currentIndex: current})
  },
  edit() {
    let { PAGEPATH } = app.globalData
    wx.navigateTo({
      url: `${PAGEPATH}/userInfo/index`
    })
  },
  album() {
    let { PAGEPATH } = app.globalData
    wx.navigateTo({
      url: `${PAGEPATH}/album/index`
    })   
  }
})