//index.js
//获取应用实例
const app = getApp()
let phone = ''
import {getCurrentPagePath, getSceneParams} from '../../utils/index.js'
import {silentLogin, wxLogin, quickLogin, sendMsgApi, registerApi, logoutApi} from '../../api/auth.js'
import {pickApi, pickIndexAvaApi, pickAggrApi, getPickChanceApi, pickChanceApi} from "../../api/pick.js"
import {localstorage, hasLogin} from "../../utils/index.js"
Page({
  data: {
    background: '#1F252B',
    viewAreaHeight: app.globalData.viewAreaHeight,
    richText: '',
    hideGif: true,
    richTextShadow: '',
    richTextBall: `<div class="richWrap">
                    <div class="center ball ball1"></div>
                    <div class="center ball ball2"></div>
                    <div class="center ball ball3"></div>
                    <div class="center ball ball4"></div>
                    <div class="center ball ball5"></div>
                    <div class="center ball ball6"></div>
                    <div class="center ball ball7"></div>
                    <div class="center ball ball8"></div>
                    <div class="center ball ball9"></div>
                  <div>`,
    showLoginGuide: false,
    status: {},
    userInfo: 0,
    countDown: 0,
    code: 0,
    dialogData: {},
    hasLogin: true,
    hasLogincb: false,
    cdnPath: app.globalData.CDNPATH,
    pickUser: false
  },
  
  onLoad: function (options) {
    if (options.scene) options = getSceneParams(options.scene)
    if(options.inviteCode) {
      wx.setStorageSync('inviteCode', options.inviteCode)
    }
    
    if (!this.data.richText) this.getAvatarList()
  },
  async onShow () {
    let data = await hasLogin()
    this.setData({'hasLogin': data, 'hasLogincb': true})
    if (this.data.hasLogin) {
      this.getOtherStatus()
      app.getSubscribeTime({types: 'pickUser'}).then(res => this.setData({pickUser: res.times.pickUser}))
    } 
  },
  // 性别变化了
  hasSexChange () {
    this.getAvatarList()
  },
  getOtherStatus (hideLoading = true) {
    return new Promise((resolve, reject) => {
      if (!this.data.hasLogin) return
      pickAggrApi({hideLoading}).then(res => {
        let countDown = 0
        if (!res.data.pickChance.todayRemain) {
          countDown = res.data.refreshAt * 1000 - res.data.curTime * 1000
          let startCountDown = () => {
            this.countDownTimers = setTimeout(() => {
              if (countDown > 0) {
                countDown = parseInt(countDown - 1000)
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
        let richTextShadow = ''
        if (res.data.pickChance.todayRemain) {
          richTextShadow = `<div class="richWrap richTextShadow"><div>`
        } else if (!res.data.pickChance.todayRemain && res.data.pickChance.todayRemainExchangeTimes) {
          richTextShadow = `<div class="richWrap richTextShadow chongzhi"><div>`
        } else {
          richTextShadow = `<div class="richWrap richTextShadow default"><div>`
        }
        this.setData({'status': res.data, countDown, richTextShadow}, () => resolve())
      })
    })
  },
  getAvatarList () {
    let richText = localstorage.get('richText')
    if (richText) {
      this.setData({richText: richText.value})
      return
    }
    let data = {}
    if (!this.data.hasLogin) data = {gender: localstorage.get('sex')}
    pickIndexAvaApi(data).then(res => {
      richText = `<div class="richWrap">`
      res.data.avatarUrls.forEach((item, index) => {
        richText = `${richText}<div class="richDom richDom${index}"><img src='${item}' class='avator' /></div>`
      })
      richText = `${richText}
      <div class="center circle1"></div>
      <div class="center circle2"></div>
      <div class="center circle3"></div>
      <div class="center circle4"></div>
      </div>`
      this.setData({richText})
      localstorage.set('richText', {type: 'resetTheDay', value: this.data.richText})
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
    app.subscribeMessage('pickUser').then(() => {
      app.recordSubscribeTime({type: 'pickUser', expire: 1000 * 60 * 60 * 24 * 1}).then(() => {
        this.setData({pickUser: 1})
        this.pick()
      })      
    }).catch(() => {})
  },
  pick () {
    app.wxReportAnalytics('button_click_event', {
      button_id: 'Pick-choose',
      button_name: 'Pick挑选'
    })
    let { userInfo, wechatInfo } = app.globalData.userInfo
    if (!this.data.hasLogin) {
      let pickTimes = localstorage.get('pickTimes') || 0
      if (pickTimes < 5) {
        pickTimes++
        localstorage.set('pickTimes', pickTimes)
        // 未登录的pick直接去到用户主页
        this.openGif()
        pickApi({hideLoading: true, gender: wx.getStorageSync('sex')}).then(({ data }) => {
          wx.navigateTo({
            url: `/pages/homepage/index?vkey=${data.user.vkey}`,
            success: async () => {
              await this.hideGif()
            }
          })
        }).catch(async (e) => {
          await this.hideGif()
        })
      } else {
        this.selectComponent('#guideLogin').toggle()
      }
      return
    }
    if (!wechatInfo || (wechatInfo && !wechatInfo.wxNickname)) {
      this.selectComponent("#popup").show()
      return
    }
    if(!userInfo.inviteCode) {
      wx.reLaunch({url: `/pages/invitation/index`})
      return
    }
    if(userInfo.step !== 9) {
      wx.reLaunch({url: `/pages/createUser/index?step=${userInfo.step}`})
      return
    }
    if(!this.data.status.canPick) { // 用户信息未完善或者未认证不给pick
      this.getOtherStatus().then(() => {
        if(!this.data.status.canPick) {
          this.setData({code: 3}, () => this.selectComponent('#dialog').show())
        }
      })
    } else {
      if (this.data.status.pickChance.todayRemain) {
        // 有次数直接pick
        this.openGif()
        pickApi({hideLoading: true}).then(({ data }) => {
          wx.navigateTo({url: `/pages/IM/chat/index?vkey=${data.user.vkey}`,
            success: async () => {
              await this.hideGif()
            }
          })
        }).catch(async ({ data }) => {
          await this.hideGif()
          if (data.code === 2204) {
            this.setData({code: 3}, () => this.selectComponent('#dialog').show())
          }
        })
      } else {
        // 已经没有次数了，但是还有兑换次数，就显示兑换弹窗
        if (this.data.status.pickChance.todayRemainExchangeTimes) {
          app.wxReportAnalytics('button_click_event', {
            button_id: 'get-times',
            button_name: '获取更多Pick次数'
          })
          this.getPickChance().then(() => {
            this.setData({code: 5}, () => this.selectComponent('#dialog').show())
          })
        }
      }
    }
  },
  openGif () {
    this.openTime = new Date().getTime()
    this.setData({'hideGif': false})
    
  },
  hideGif () {
    this.nowTime = new Date().getTime()
    this.intervalTime = this.nowTime - this.openTime
    return new Promise((resolve) => {
      if (this.intervalTime < 2000) {
        setTimeout(() => {
          this.setData({'hideGif': true})
          resolve()
        }, 2000 - this.intervalTime)
      } else {
        resolve()
        this.setData({'hideGif': true})
      }
    })
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
