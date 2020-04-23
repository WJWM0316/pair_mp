import {
  getUserInfoCompleteApi
} from '../../../api/user.js'
import {
  getPickChanceApi,
  pickChanceApi
} from '../../../api/pick'
import {getCurrentPagePath} from '../../../utils/index.js'

const app = getApp()
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    code: {
      type: Number,
      value: 0
    },
    showClose: {
      type: Boolean,
      value: true
    },
    other: {
      type: Object,
      value: {}
    }
  },
  data: {
    show: false,
    CDNPATH: app.globalData.CDNPATH,
    userInfo: app.globalData.userInfo.userInfo,
    userCompleteInfo: null,
    albumVerifyInfo: null,
    careerVerifyInfo: null,
    uploadAvatar: 0
  },
  methods: {
    subscribe() {
      let { PAGEPATH } = app.globalData
      app.subscribeMessage('uploadAvatar').then(() => {
        app.recordSubscribeTime({type: 'uploadAvatar', expire: 1000 * 60 * 60 * 24 * 1}).then(() => {
          this.setData({uploadAvatar: 1})
          this.setData({ show: false }, () => {
            wx.navigateTo({
              url: `${PAGEPATH}/album/index`
            })
          })
        })   
      }).catch(() => {})
    },
    show() {
      let { code } = this.data
      switch(code) {
        case 2:
          getUserInfoCompleteApi({hideLoading: true}).then(({ data }) => {
            this.setData({userCompleteInfo: data.userCompleteInfo, show: true, userInfo: app.globalData.userInfo.userInfo})
          }) 
          break
        case 3:
          app.getSubscribeTime({types: 'uploadAvatar'}).then(res => this.setData({uploadAvatar: res.times.uploadAvatar}))
          getUserInfoCompleteApi({hideLoading: true}).then(({ data }) => {
            let { userInfo } = app.globalData.userInfo
            if(!Object.keys(data.careerVerifyInfo).length) {
              data.careerVerifyInfo = Object.assign(data.careerVerifyInfo, { status: -1})
            }
            userInfo.infoCompletePercent = data.userCompleteInfo.infoCompletePercent
            userInfo.infoCompletePercentDesc = `${data.userCompleteInfo.infoCompletePercent}%`
            this.setData({
              userCompleteInfo: data.userCompleteInfo,
              show: true,
              careerVerifyInfo: data.careerVerifyInfo,
              albumVerifyInfo: data.albumVerifyInfo,
              userInfo
            })
          }) 
          break
        default:
          this.setData({ show: true, userInfo: app.globalData.userInfo.userInfo })
          break
      }
    },
    close() {
      this.setData({ show: false })
    },
    click(e) {
      let { dataset } = e.currentTarget
      this.close()
      this.triggerEvent('click', dataset)
    },
    routeJump(e) {
      let { dataset } = e.currentTarget
      let { PAGEPATH } = app.globalData
      let { userInfo, userCompleteInfo } = this.data
      switch(dataset.page) {
        case 'userInfo':
          this.setData({ show: false }, () => {
            wx.navigateTo({
              url: `${PAGEPATH}/userInfo/index`
            }) 
          })          
          break
        case 'perfectUser':
          this.setData({ show: false }, () => {
            if(userCompleteInfo.infoCompletePercent >= 40 && userCompleteInfo.infoCompletePercent < 80) {
              wx.navigateTo({
                url: `${PAGEPATH}/perfectUser/index?step=1&redirectTo=${encodeURIComponent(getCurrentPagePath())}`
              }) 
            } else {
              wx.navigateTo({
                url: `${PAGEPATH}/userInfo/index`
              })
            }            
          })     
          break
        case 'album':
          this.setData({ show: false }, () => {
            wx.navigateTo({
              url: `${PAGEPATH}/album/index`
            })
          })              
          break
        case 'answer':
          this.setData({ show: false }, () => {
            wx.navigateTo({
              url: `${PAGEPATH}/answer/index/index`
            })
          })    
          break
        case 'career':
          this.setData({ show: false }, () => {
            if(userInfo.companyId) {
              wx.setStorageSync('searchCompany', {
                company_id: userInfo.companyId,
                company_name: userInfo.companyName
              })
            }
            wx.navigateTo({
              url: `${PAGEPATH}/methods/index?type=createUser&companyId=${userInfo.companyId ? userInfo.companyId : ''}`
            })
          })    
          break
        default:
          break
      }
    }
  }
})
