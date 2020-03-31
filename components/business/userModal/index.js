import {
  getUserInfoApi
} from '../../../api/user.js'

const app = getApp()
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },
  data: {
    CDNPATH: app.globalData.CDNPATH
  },
  pageLifetimes: {
    show() {
      let { options } = this.data
      console.log(options)
      getUserInfoApi({vkey: 'ighvcabv'}).then(({ data }) => {
        let {
          userInfo,
          careerVerifyInfo = {},
          pickIntention = {},
          albumVerifyInfo = {
            status: 1,
            statusDesc: '审核通过'
          }
        } = data
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
      })
    }
  },
  methods: {
    close() {
      this.setData({show: !this.data.show})
    },
    routeJump() {
      let { PAGEPATH } = app.globalData
      wx.navigateTo({
        url: `${PAGEPATH}/homepage/index?vkey=${'ighvcabv'}`
      })
    },
    upload() {
      let { PAGEPATH } = app.globalData
      let { userInfo } = this.data
      wx.setStorageSync('userInfo', userInfo)
      wx.navigateTo({
        url: `${PAGEPATH}/album/index`
      })   
    },
    update() {
      let { PAGEPATH } = app.globalData
      wx.navigateTo({
        url: `${PAGEPATH}/userInfo/index`
      })
    }
  }
})
