import {
  getSugarWalletApi,
  getSugarInfoApi
} from '../../api/sugar'
import {
  userSignApi,
  getCurrentWeekSignInApi,
  getWxOfficialShareCodeApi,
  getUserShareCodeApi
} from '../../api/user'

import {hasLogin} from "../../utils/index.js"

const app = getApp()
Page({
  data: {
    CDNPATH: app.globalData.CDNPATH,
    weekSignConfig: {},
    awardPopData: [],
    wallet: {
      amount: 0,
      id: 0,
      remain: 0,
      topUpAmount: 0,
      topUpTimes: 0,
      uid: 0,
      vkey: '',
      todaySigned: true
    },
    show: false,
    inviteCode: {},
    userInvite: {},
    shareInvite: {},
    hasLogin: 0,
    signIn: 0,
    inviteFriend: 0
  },
  onLoad(options) {
    this.setData({options})
    this.getCurrentWeekSignIn()
    this.getSugarInfo()
  },
  async onShow () {
    let data = await hasLogin()
    this.setData({'hasLogin': data})
    if (this.data.hasLogin) app.getSubscribeTime({types: 'signIn,inviteFriend'}).then(res => this.setData({signIn: res.times.signIn, inviteFriend: res.times.inviteFriend}))
  },
  subscribe() {
    app.subscribeMessage('signIn').then(() => {
      app.recordSubscribeTime({type: 'signIn', expire: 1000 * 60 * 60 * 24 * 1}).then(() => {
        this.setData({signIn: 1})
        this.sign()
      })   
    }).catch(() => {})
  },
  getSugarInfo() {
    return new Promise((resolve, reject) => {
      getSugarInfoApi().then(({data}) => {
        this.setData({wallet: data.wallet}, () => resolve())
      }).catch(() => resolve())
    })
  },
  getRurrentDate() {
    let date = new Date();
    let month = date.getMonth() + 1 < 10 ? "0"+(date.getMonth() + 1):date.getMonth() + 1;
    let strDate = date.getDate() <10 ? "0" + date.getDate():date.getDate();
    return date.getFullYear() + '-'  + month  + '-'  + strDate;
  },
  getCurrentWeekSignIn() {
    getCurrentWeekSignInApi().then(({ data }) => {
      let signIndex = data.list.map(v => v.weekDateIndex)
      let dateArr = data.list.map(v => v.date) || []
      let currentDate = this.getRurrentDate()
      data.configList.map((v, i) => {
        v.hasSign = false
        if(signIndex.includes(i+1)) {
          v.hasSign = true
        }
      })
      this.setData({ weekSignConfig: data, todaySigned: dateArr.includes(currentDate)})
    })
  },
  viewBill() {
    let { PAGEPATH } = app.globalData
    wx.navigateTo({
      url: `${PAGEPATH}/bill/index`
    })
  },
  getUserShareCode() {
    app.subscribeMessage('inviteFriend').then(() => {
      app.recordSubscribeTime({type: 'inviteFriend', expire: 1000 * 60 * 60 * 24 * 1}).then(() => {
        this.setData({inviteFriend: 1})
        this.invite()
      })   
    }).catch(() => {})
  },
  invite() {
    app.wxReportAnalytics('button_click_event', {
      button_id: 'invite',
      button_name: '立即邀请'
    })
    this.selectComponent('#invitationBox').show()
  },
  sign() {
    app.wxReportAnalytics('button_click_event', {
      button_id: 'sign',
      button_name: '立即签到'
    })
    userSignApi().then(({data}) => {
      this.setData({'awardPopData': data.popups}, () => {
        this.selectComponent('#awardPopUp').show()
      })
      this.getCurrentWeekSignIn()
    })
  },
  wxReportAnalytics () {
    app.wxReportAnalytics('button_click_event', {
      button_id: 'TO_top-up',
      button_name: '去充值'
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    let { inviteCode } = app.globalData
    if(options.from === 'button') {
      return app.wxShare({
        options,
        title: '我发现了这个优质靠谱的单身配对交友平台，想脱单就来看看吧~',
        path: `/pages/index/index?inviteCode=${inviteCode.code}`
      })
    } else {
      return app.wxShare({options})
    }    
  },
  onPullDownRefresh() {
    this.getSugarInfo().then(() => wx.stopPullDownRefresh())
  },
  stopPageScroll () {
    return false
  },
  close () {
    this.setData({show: false}, () => this.triggerEvent('close'))
  },
  todoAction(e) {
    let { itemList } = this.data
    let { index } = e.currentTarget.dataset
    let result = itemList.find((v, i) => i === index)
    this.setData({show: false}, () => this.triggerEvent('close'))
    this.triggerEvent('drawerAction', result)
  },
  download() {
    let { PAGEPATH } = app.globalData
    this.setData({show: false})
    wx.navigateTo({
      url: `${PAGEPATH}/poster/index`
    })
  },
  copy() {
    let callback = () => {
      let { inviteCode } = this.data
      let  { userInfo } = app.globalData.userInfo
let shareContent = `
【${userInfo.nickname} 邀请你加入Pick Me】
专属邀请码是      
${inviteCode.code}   
搜索【PickMe】小程序，匹配最适合你的TA      
`
      wx.setClipboardData({data: shareContent })
    }
    if (app.globalData.userInfo) {
      callback()
    } else {
      app.getUserInfo = () => callback()
    }
  }
})