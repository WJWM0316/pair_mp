import {
  getMyInfoApi,
  getMyLabelApi,
  getUserInfoApi
} from '../../api/user.js'
import {
  getMyQuestionListApi
} from '../../api/question.js'
Page({
  data: {
    careerVerifyInfo: {},
    pickIntention: {},
    userInfo: {},
    isOwer: true,
    currentIndex: 0,
    options: {}
  },
  onLoad(options) {
    this.setData({options})
  },
  onShow() {
    getUserInfoApi({vkey: 'ighvcabv'}).then(({ data }) => {
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
            data.map((v,i) => {
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
            this.setData({labelList: data})
          })
        }
      })
    })
  },
  bindchange(e) {
    let { current } = e.detail
    this.setData({currentIndex: current})
  }
})