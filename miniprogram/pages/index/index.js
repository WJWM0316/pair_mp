//index.js
//获取应用实例
const app = getApp()
let phone = ''
import {getCurrentPagePath} from '../../utils/index.js'
import {silentLogin, wxLogin, quickLogin, sendMsgApi, registerApi, logoutApi} from '../../api/auth.js'
import {pickApi, pickIndexAvaApi, pickAggrApi, getPickChanceApi, pickChanceApi} from "../../api/pick.js"
import localstorage from "../../utils/localstorage.js"
Page({
  data: {
    background: '#1F252B',
    viewAreaHeight: app.globalData.viewAreaHeight,
    richText: '',
    showLoginGuide: false,
    status: {},
    userInfo: 0,
    countDown: 0,
    code: 0,
    dialogData: {},
    hasLogin: true,
    cdnPath: app.globalData.CDNPATH,
    hasPicker: false
  },
  
  onLoad: function () {
    this.getAvatarList()
  },
  onShow () {
    if(localstorage.get('hasPicker')) {
      this.setData({hasPicker: true})
    }
    this.getOtherStatus()
    let hasLogin = localstorage.get('token')
    this.setData({hasLogin})
  },
  getOtherStatus (hideLoading = true) {
    pickAggrApi({hideLoading}).then(res => {
      let countDown = 0
      if (!res.data.pickChance.todayRemain) {
        countDown = res.data.refreshAt - res.data.curTime
        let startCountDown = () => {
          this.countDownTimers = setTimeout(() => {
            if (countDown > 0) {
              countDown--
              this.setData({countDown})
              startCountDown()
            } else {
              countDown = 0
              clearInterval(this.countDownTimers)
              this.getOtherStatus()
            }
          }, 1000)
        }
        startCountDown()
      }
      if (res.data.popups.length) {
        this.selectComponent('#awardPopUp').show()
      }
      this.setData({'status': res.data, countDown})
    })
  },
  getAvatarList () {
    pickIndexAvaApi().then(res => {
      let hasLogin = app.globalData.hasLogin
      let richText = `<div class="richWrap">`
      res.data.avatarUrls.forEach((item, index) => {
        richText = `${richText}<img src='${item}' class='richDom richDom${index}' />`
      })
      richText = `${richText}</div>`
      this.setData({richText, hasLogin})
    })
  },
  getPickChance () {
    return getPickChanceApi().then(res => {
      this.setData({'dialogData': res.data})
    })
  },
  genderToggle (e) {
    this.setData({'showLoginGuide': e.detail})
  },
  // 开始兑换
  pickChance (e) {
    pickChanceApi().then(() => {
      this.getOtherStatus()
    })
  },
  subscribe() {
    app.subscribeMessage('openChat').then(() => {
      this.setData({hasPicker: true})
      localstorage.set('hasPicker', { type: 'resetTheDay' })
      this.pick()
    }).catch(() => {
      this.setData({hasPicker: true})
      localstorage.set('hasPicker', { type: 'resetTheDay' })
    })
  },
  pick () {
    let { userInfo } = app.globalData.userInfo
    if (!this.data.hasLogin) {
      this.selectComponent('#guideLogin').toggle()
      return
    }
    if(userInfo.step !== 9) {
      wx.redirectTo({url: `/pages/createUser/index?step=${userInfo.step}`})
      return
    }
    if(!this.data.status.canPick) { // 用户信息未完善或者未认证不给pick
      this.setData({code: 3}, () => this.selectComponent('#dialog').show())
    } else {
      // 已经没有次数了，但是还有兑换次数，就显示兑换弹窗
      if (!this.data.status.pickChance.todayRemain && this.data.status.pickChance.todayRemainExchangeTimes) {
        this.getPickChance().then(res => {
          this.setData({code: 5}, () => this.selectComponent('#dialog').show())
        })
      } else {
        // 有次数直接pick
        pickApi({hideLoading: true}).then(({ data }) => {
          wx.navigateTo({url: `/pages/IM/chat/index?vkey=${data.user.vkey}`})
        }).catch(e => {
          if (e.data.code === 2204) {
            this.setData({code: 3}, () => this.selectComponent('#dialog').show())
          }
        })
      }
      
    }
  },
  routeJump (e) {
    let type = e.currentTarget.dataset.route
    switch (type) {
      case 'square':
        wx.reLaunch({url: `/pages/square/index`})
    }
  },
  onHide: function () {
    clearInterval(this.countDownTimers)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    let shareInfos = app.globalData.shareInfos.sharePickme,
        random     = parseInt(Math.random() * (shareInfos.title.length - 1))
    return app.wxShare({
      options,
      title: shareInfos.title[random],
      imageUrl: shareInfos.imageUrl
    })
  }
})
