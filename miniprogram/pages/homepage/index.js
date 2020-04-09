import {
  getUserInfoApi
} from '../../api/user.js'
import {localstorage, hasLogin} from "../../utils/index.js"
import { getChargeInfoApi, chatApi } from "../../api/square.js"

const app =  getApp();
Page({
  data: {
    careerVerifyInfo: {},
    pickIntention: {},
    userInfo: {},
    hasLogin: true,
    isOwer: true,
    currentIndex: 0,
    options: {},
    isError: false,
    albumVerifyInfo: {
      status: 1,
      statusDesc: '审核通过'
    },
    CDNPATH: app.globalData.CDNPATH,
    buttonInfo: {},
    code: 0,
    chargeInfo: {}
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
  getUser() {
    return new Promise((resolve, reject) => {
      let { options } = this.data
      let rtn = app.globalData.userInfo
      let callback = (data, myself) => {
        if(!myself) app.globalData.userInfo = data
        let {
          userInfo,
          careerVerifyInfo = {},
          pickIntention = {},
          albumVerifyInfo = {
            status: 1,
            statusDesc: '审核通过'
          },
          buttonInfo = {}
        } = data
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
        wx.setNavigationBarTitle({title: userInfo.nickname})
        this.setData({
          userInfo,
          careerVerifyInfo,
          pickIntention,
          userLabelList,
          userAnswerList,
          isAllQuestion,
          albumVerifyInfo,
          isOwer: myself ? false : true,
          buttonInfo
        }, () => resolve())
      }
      getUserInfoApi({vkey: options.vkey}).then(({ data }) => {
        callback(data, rtn.userInfo.vkey == options.vkey ? 0 : rtn)
      })
    })
  },
  async onShow() {
    this.getUser()
    let data = await hasLogin()
    this.setData({'hasLogin': data})
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
  },
  chat() {
    let { PAGEPATH } = app.globalData
    let { options } = this.data
    wx.navigateTo({
      url: `${PAGEPATH}/IM/chat/index?vkey=${options.vkey}`
    })
  },
  fetch() {
    let { options } = this.data
    let { userInfo } = this.data
    getChargeInfoApi({toUserVkey: options.vkey}).then(({ data }) => {
      if(data.chargeInfo.needCharge ) {
        let myAvatar = app.globalData.userInfo.userInfo.avatarInfo.smallUrl
        let mySex = app.globalData.userInfo.userInfo.gender
        let userAvatar = userInfo.avatarInfo.smallUrl
        let userSex = userInfo.gender
        data = Object.assign(data, {myAvatar, userAvatar, mySex, userSex})
        this.setData({code: 4, chargeInfo: data}, () => this.selectComponent('#dialog').show())
      } else {
        this.chat()
      }
    })
  },
  picker() {
    let { options } = this.data
    chatApi({toUserVkey: options.vkey}).then(res => {
      this.chat()
    })
  },
  dialogEvent(e) {
    let rtn = e.detail
    switch(rtn.action) {
      case 'charge':
        this.picker()
        break
    }
  },
  todoAction(e) {
    console.log(e)
    let { PAGEPATH } = app.globalData
    let { dataset } = e.currentTarget
    switch(dataset.action) {
      case 'answer':
        wx.navigateTo({
          url: `${PAGEPATH}/answer/index/index`
        })
        break
      case 'label':
        wx.navigateTo({
          url: `${PAGEPATH}/perfectUser/index?type=edit&step=2`
        })
        break
      case 'ownDescribe':
        wx.navigateTo({
          url: `${PAGEPATH}/editUser/index?key=ownDescribe`
        })   
        break
      case 'idealDescribe':
        wx.navigateTo({
          url: `${PAGEPATH}/editUser/index?key=idealDescribe`
        })   
        break
    }
  },
  report() {
    let { PAGEPATH } = app.globalData
    let { options } = this.data
    wx.navigateTo({
      url: `${PAGEPATH}/report/index?vkey=${options.vkey}`
    })
  },
  onPullDownRefresh() {
    this.getUser().then(() => wx.stopPullDownRefresh())
  }
})