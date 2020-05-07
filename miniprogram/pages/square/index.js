import { getSquareListApi } from "../../api/square.js"
import { getCurrentPagePath, hasLogin, localstorage } from '../../utils/index'

const app = getApp()
const getdate = () => {
  let date = new Date()
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  return date
}

Page({
  data: {
    CDNPATH: app.globalData.CDNPATH,
    squareData: {
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
    if (app.globalData.userInfo) {
      this.getUserList()
    } else {
      app.getUserInfo = () => {
        this.getUserList()
      }
    }
  },
  // onLoad(options) {
  //   let callback = () => {
  //     if(localstorage.get('squareData')) {
  //       this.setData({ squareData: localstorage.get('squareData').value })
  //     }
  //     this.getUserList()
  //   }
  //   if (app.globalData.userInfo) {
  //     callback()
  //   } else {
  //     app.getUserInfo = () => {
  //       callback()
  //     }
  //   }
  // },
  hasSexChange () {
    let squareData = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    }
    this.setData({squareData}, () => this.getUserList())
  },
  getUserList() {
    return new Promise((resolve, reject) => {
      let { squareData, onBottomStatus } = this.data
      let params = { count: 20, page: squareData.pageNum }
      if(Date.parse(new Date()) >= Date.parse(getdate()) + 12 * 60 * 60 * 1000 && Date.parse(new Date()) <= Date.parse(getdate()) + 13 * 60 * 60 * 1000) {
        wx.removeStorageSync('squareData')
      }
      if (localstorage.get('squareData')) {
        this.setData({ squareData: localstorage.get('squareData').value}, () => resolve())
      } else {
        getSquareListApi(params).then(res => {
          onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
          let list = res.data
          list.map(v => {
            v.birthDesc = `${v.birth.slice(2,4)}年`
            v.heightDesc = `${v.height}CM`
          })
          squareData.list = squareData.list.concat(list)
          squareData.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
          
          squareData.isRequire = true
          squareData.list = squareData.list.concat(list)
          squareData.pageNum++
          this.setData({ squareData, onBottomStatus }, () => resolve(res))
          localstorage.set('squareData', {type: 'resetTheDay', value: squareData})
        }).catch(err => console.log(reject()))
      }
    })
  },
  routeJump(e) {
    let { item } = e.currentTarget.dataset
    let { PAGEPATH } = app.globalData
    wx.navigateTo({
      url: `${PAGEPATH}/homepage/index?vkey=${item.vkey}`,
      success(res) {
        res.eventChannel.emit('userInfo', item)
      }
    })
  },
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