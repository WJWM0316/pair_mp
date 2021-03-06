import {
  getUserInfoApi
} from '../../api/user.js'
import {localstorage, hasLogin, getSceneParams} from "../../utils/index.js"
import { getChargeInfoApi, chatApi } from "../../api/square.js"
import {
  removeBackApi
} from '../../api/black.js'

import {
  setIconType
} from '../../utils/util.js'

const app =  getApp();
Page({
  data: {
    userInfo: {},
    hasLogin: true,
    isOwner: true,
    currentIndex: 0,
    options: {},
    isError: false,
    albumVerifyInfo: {
      status: 1,
      statusDesc: '审核通过'
    },
    CDNPATH: app.globalData.CDNPATH,
    buttonInfo: {},
    code: 0,
    chargeInfo: {},
    httpCode: 0,
    userCompleteInfo: {
      canPick: 0
    },
    navBarHeight: app.globalData.navBarHeight
  },
  onLoad(options) {
    if (options.scene) options = getSceneParams(options.scene)
    this.setData({ options })
  },
  onUnload () {
    app.globalData.lockonShow = false
  },
  async onShow() {
    let data = await hasLogin()
    this.setData({'hasLogin': data})
    await this.getUser(true)
  },
  legalize() {
    let { PAGEPATH } = app.globalData
    let { userInfo } = this.data
    wx.setStorageSync('searchCompany', {
      company_name: userInfo.companyName
    })
    wx.navigateTo({
      url: `${PAGEPATH}/methods/index?companyId=${userInfo.companyId ? userInfo.companyId : ''}`
    })
  },
  getUser(hideLoading = true) {
    return new Promise((resolve, reject) => {
      let { options, hasLogin } = this.data
      let callback = (data) => {
        let isOwner = false
        if(hasLogin) {
          if(options.vkey === app.globalData.userInfo.userInfo.vkey) {
            isOwner = true
          } else {
            isOwner = false
          }
        }
        let {
          userInfo,
          albumVerifyInfo = {
            status: 1,
            statusDesc: '审核通过'
          },
          buttonInfo = {},
          userCompleteInfo = {
            canPick: 0
          }
        } = data
        let { userLabelList, userAnswerList, isAllQuestion } = userInfo
        let pIds = isOwner ? app.globalData.userInfo.userInfo.userLabelList.map(v => v.labelId): [];
        userLabelList.map((v,i) => {
          if (isOwner) {
            if(pIds.includes(v.labelId)) {
              let cIds = app.globalData.userInfo.userInfo.userLabelList.find(field => field.labelId === v.labelId).children.map(field => field.labelId)
              v.children.map(c => {
                if(cIds.includes(c.labelId)) {
                  c.active = true
                }
              })
            }
          }
          setIconType(v)
        })
        userInfo.birthDesc = userInfo.birth.slice(2, 4)
        wx.setNavigationBarTitle({title: userInfo.nickname})
        this.setData({
          userInfo,
          userLabelList,
          userAnswerList,
          isAllQuestion,
          albumVerifyInfo,
          isOwner,
          buttonInfo,
          userCompleteInfo
        }, () => resolve())
      }
      try {
        let eventChannel = this.getOpenerEventChannel();
        eventChannel.on('userInfo', res => {
          let isOwner = false
          if(hasLogin) {
            if(options.vkey === app.globalData.userInfo.userInfo.vkey) {
              isOwner = true
            } else {
              isOwner = false
            }
          }
          this.setData({ options, userInfo: res, isOwner })
        });
      } catch(err) {}
      if(!app.globalData.lockonShow) {
        getUserInfoApi({vkey: options.vkey, hideLoading }).then(res => {
          this.setData({httpCode: res.code}, () => callback(res.data))        
        })
        app.globalData.lockonShow = false
      }      
    })
  },
  
  bindchange(e) {
    let { current } = e.detail
    this.setData({currentIndex: current})
  },
  edit(e) {
    let { dataset } = e.currentTarget
    if (dataset.type) {
      app.wxReportAnalytics('button_click_event', {
        button_id: 'Degree-information',
        button_name: '去到编辑资料总览页'
      })
    } else {
      app.wxReportAnalytics('button_click_event', {
        button_id: 'redact_All-information',
        button_name: '自主完善信息'
      })
    }
    let { PAGEPATH } = app.globalData
    wx.navigateTo({
      url: `${PAGEPATH}/userInfo/index`
    })
  },
  album() {
    let { PAGEPATH } = app.globalData
    wx.navigateTo({
      url: `${PAGEPATH}/album/index`
    })   
  },
  chat() {
    let { PAGEPATH, userInfo } = app.globalData
    let { options, httpCode } = this.data
    if (!userInfo.wechatInfo.wxNickname) {
      this.selectComponent('#popup').show()
      return
    }
    
    let jump = (options) => {
      wx.navigateTo({
        url: `${PAGEPATH}/IM/chat/index?vkey=${options.vkey}`
      })
    }
    if(httpCode === 2101) {
      app.wxConfirm({
        title: '取消拉黑',
        content: '你已拉黑对方，是否取消拉黑？',
        cancelText: '否',
        confirmText: '是',
        confirmBack() {
          removeBackApi({vkey: options.vkey}).then(() => jump(options))
        },
        cancelBack() {}
      })
    } else {
      jump(options)
    }    
  },
  fetch() {
    app.wxReportAnalytics('button_click_event', {
      button_id: 'Want_know',
      button_name: '想认识TA'
    })
    let { userInfo } = app.globalData.userInfo
    let { options, userCompleteInfo } = this.data
    let otherInfo = this.data.userInfo
    // if (!this.data.hasLogin) {
    //   this.selectComponent('#guideLogin').toggle()
    //   return
    // }
    if(!userInfo.inviteCode) {
      wx.redirectTo({url: `/pages/invitation/index`})
      return
    }
    if(userInfo.step !== 9) {
      wx.redirectTo({url: `/pages/createUser/index?step=${userInfo.step}`})
      return
    }
    if(!userCompleteInfo.canPick) {
      // app.globalData.lockonShow = false
      this.getUser(true).then(() => {
        if(!userCompleteInfo.canPick) {
          this.setData({code: 3}, () => this.selectComponent('#dialog').show())
        }
      })
    } else {
      getChargeInfoApi({toUserVkey: options.vkey}).then(({ data }) => {
        if(data.chargeInfo.needCharge ) {
          let myAvatar = userInfo.avatarInfo.smallUrl
          let mySex = userInfo.gender
          let userAvatar = otherInfo.avatarInfo.smallUrl
          let userSex = otherInfo.gender
          data = Object.assign(data, {myAvatar, userAvatar, mySex, userSex})
          this.setData({code: 4, chargeInfo: data}, () => this.selectComponent('#dialog').show())
        } else {
          this.chat()
        }
      })
    }
  },
  picker() {
    let { options } = this.data
    chatApi({toUserVkey: options.vkey}).then(res => {
      this.chat()
    })
  },
  dialogEvent(e) {
    let rtn = e.detail
    switch(rtn.action) {
      case 'charge':
        this.picker()
        break
    }
  },
  todoAction(e) {
    let { PAGEPATH } = app.globalData
    let { dataset } = e.currentTarget
    switch(dataset.action) {
      case 'answer':
        wx.navigateTo({
          url: `${PAGEPATH}/answer/index/index`
        })
        break
      case 'label':
        wx.navigateTo({
          url: `${PAGEPATH}/perfectUser/index?type=edit&step=2`
        })
        break
      case 'ownDescribe':
        wx.navigateTo({
          url: `${PAGEPATH}/editUser/index?key=ownDescribe`
        })   
        break
      case 'idealDescribe':
        wx.navigateTo({
          url: `${PAGEPATH}/editUser/index?key=idealDescribe`
        })   
        break
    }
  },
  report() {
    let { PAGEPATH } = app.globalData
    let { options } = this.data
    wx.navigateTo({
      url: `${PAGEPATH}/report/index?vkey=${options.vkey}`
    })
  },
  onPullDownRefresh() {
    // app.globalData.lockonShow = false
    this.getUser(false).then(() => wx.stopPullDownRefresh())
  },
  previewImage(e) {
    app.globalData.lockonShow = true
    let {
      userInfo,
      isOwner,
      currentIndex,
      albumVerifyInfo
    } = this.data
    let albumList = []
    if(isOwner) {
      if(albumVerifyInfo.status === 1) {
        albumList = userInfo.userAlbumList
      } else {
        albumList = userInfo.userAlbumTempList
      }
    } else {
      albumList = userInfo.userAlbumList
    }
    let current = albumList.find((v,i) => i === currentIndex).url
    albumList = albumList.map(field => field.url)
    wx.previewImage({current, urls: albumList})
  },
  onShareAppMessage: function (options) {
    app.globalData.lockonShow = true
    let wxShare = {},
        userInfo= app.globalData.userInfo.userInfo
    let title   = `${userInfo.birth.slice(2, 4)}年身高${userInfo.height}`
    if (userInfo.industryArr && userInfo.industryArr.length) {
      title = title + '，' + userInfo.industryArr[0].name
    }
    if (userInfo.residentArr && userInfo.residentArr.length) {
      title = title + '，现居' + userInfo.residentArr[1].title + userInfo.residentArr[2].title
    }
    if (userInfo.degreeDesc && userInfo.degreeDesc !== '其他') {
      title = title + '，' + userInfo.degreeDesc + '学历'
    }
    if (userInfo.userLabelList && userInfo.userLabelList.length) {
      let label = []
      userInfo.userLabelList.forEach((item) => {
        item.children.forEach((item0) => {
          label.push(item0.name)
        })
      })
      title = title + '，' + label.join('、')
    }
    if (this.data.isOwner) {
      wxShare = {
        title,
        imageUrl: userInfo.avatarInfo.middleUrl,
        path: `/pages/homepage/index?vkey=${userInfo.vkey}`
      }
      app.wxReportAnalytics('button_click_event', {
        button_id: 'share_applet-card',
        button_name: '分享小程序卡片'
      })
    }
    return app.wxShare({
      options,
      ...wxShare
    })
  }
})