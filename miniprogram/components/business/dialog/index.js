import {
  getUserInfoCompleteApi
} from '../../../api/user.js'
import {
  getPickChanceApi,
  pickChanceApi
} from '../../../api/pick'
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
    careerVerifyInfo: null
  },
  methods: {
    show() {
      let { code } = this.data
      switch(code) {
        case 2:
          getUserInfoCompleteApi({hideLoading: true}).then(({ data }) => {
            this.setData({userCompleteInfo: data.userCompleteInfo, show: true, userInfo: app.globalData.userInfo.userInfo})
          }) 
          break
        case 3:
          getUserInfoCompleteApi({hideLoading: true}).then(({ data }) => {
            this.setData({
              userCompleteInfo: data.userCompleteInfo,
              show: true,
              careerVerifyInfo: app.globalData.userInfo.careerVerifyInfo,
              albumVerifyInfo: app.globalData.userInfo.albumVerifyInfo,
              userInfo: app.globalData.userInfo.userInfo
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
      let { userInfo } = this.data
      switch(dataset.page) {
        case 'userInfo':
          this.setData({ show: false }, () => {
            wx.navigateTo({
              url: `${PAGEPATH}/userInfo/index`
            }) 
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
