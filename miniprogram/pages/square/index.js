import { getSquareListApi } from "../../api/square.js"
import { getCurrentPagePath, hasLogin } from '../../utils/index'
const app = getApp()
Page({
  data: {
    CDNPATH: app.globalData.CDNPATH,
    userData: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    },
    hasLogin: true,
    hasLogincb: false,
    onBottomStatus: 0,
    background: '',
    navBarHeight: app.globalData.navBarHeight
  },
  async onShow () {
    let data = await hasLogin()
    this.setData({'hasLogin': data, 'hasLogincb': true})
  },
  onLoad(options) {
    let userData = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    }
    let callback = () => {
      this.getUserList()
      this.setData({userData})
    }
    if (app.globalData.userInfo) {
      callback()
    } else {
      app.getUserInfo = () => {
        callback()
      }
    }
  },
  hasSexChange () {
    let userData = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    }
    this.setData({userData}, () => this.getUserList())
  },
  getUserList() {
    return new Promise((resolve, reject) => {
      let { userData, onBottomStatus } = this.data
      let params = { count: 20, page: userData.pageNum }
      getSquareListApi(params).then(res => {
        onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        let list = res.data
        list.map(v => {
          v.birthDesc = `${v.birth.slice(2,4)}年`
          v.heightDesc = `${v.height}CM`
        })
        userData.list = userData.list.concat(list)
        userData.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        userData.pageNum++
        userData.isRequire = true
        this.setData({ userData, onBottomStatus }, () => resolve(res))
      })
    })
  },
  routeJump(e) {
    let { item } = e.currentTarget.dataset
    let { PAGEPATH } = app.globalData
    wx.navigateTo({
      url: `${PAGEPATH}/homepage/index?vkey=${item.vkey}`
    })
  },
  // onReachBottom() {
  //   const userData = this.data.userData
  //   if (!userData.isLastPage) {
  //     this.setData({onBottomStatus: 1}, () => this.getUserList())
  //   }
  // },
  onShareAppMessage: function (options) {
    let { inviteCode } = app.globalData
    if(options.from === 'button') {
      return app.wxShare({
        options,
        path: `/pages/index/index?inviteCode=${inviteCode.code}`
      })
    } else {
      let shareInfos = app.globalData.shareInfos.shareSingleSquare,
          random     = parseInt(Math.random() * (shareInfos.title.length - 1)),
          path       = `/pages/startupPage/index?redirectTo=${encodeURIComponent(getCurrentPagePath())}`
      return app.wxShare({
        options,
        title: shareInfos.title[random],
        path,
        imageUrl: shareInfos.imageUrl
      })
    }    
  }
})