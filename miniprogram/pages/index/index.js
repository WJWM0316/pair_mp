//index.js
//获取应用实例
const app = getApp()
let phone = ''
import {getCurrentPagePath} from '../../utils/index.js'
import {silentLogin, wxLogin, quickLogin, sendMsgApi, registerApi, logoutApi} from '../../api/auth.js'
import {pickApi, pickIndexAvaApi, pickAggrApi, getPickChanceApi, pickChanceApi} from "../../api/pick.js"
Page({
  data: {
    background: '#1F252B',
    viewAreaHeight: app.globalData.viewAreaHeight,
    richText: '',
    status: {},
    userInfo: 0,
    countDown: 0,
    code: 0,
    dialogData: {},
    hasLogin: app.globalData.hasLogin,
    cdnPath: app.globalData.CDNPATH
  },
  
  onLoad: function () {
    if (!app.globalData.viewAreaHeight) {
      app.getTabHInit = () => {
        this.setData({'viewAreaHeight': app.globalData.viewAreaHeight})
      }
    } else {
      this.setData({'viewAreaHeight': app.globalData.viewAreaHeight})
    }
    this.getAvatarList()
  },
  onShow () {
    if (app.globalData.userInfo) {
      this.setData({'userInfo': app.globalData.userInfo})
    } else {
      app.getUserInfo = () => {
        this.setData({'userInfo': app.globalData.userInfo})
      }
    }
    this.getOtherStatus()
  },
  
  getOtherStatus () {
    pickAggrApi({hideLoading: true}).then(res => {
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
  // 开始兑换
  pickChance (e) {
    pickChanceApi().then(() => {
      this.getOtherStatus()
    })
  },
  pick () {
    let { userInfo } = app.globalData.userInfo
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
          wx.navigateTo({url: `/pages/homepage/index?vkey=${data.user.vkey}`})
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
})
