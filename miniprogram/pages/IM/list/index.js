const app =  getApp();
import {getRelationlistApi, deleteMsgApi} from '../../../api/im.js'
import {getUserInfoAuth, socket, hasLogin} from '../../../utils/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasTips: true,
    userInfo: 0,
    hasLogin: true,
    hasLogincb: false,
    cdnPath: app.globalData.CDNPATH,
    messageList: [],
    hasRequire: false,
    viewAreaHeight: 0,
    lockIndex: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({'viewAreaHeight': app.globalData.viewAreaHeight})
  },
  onMessage () {
    socket.onMessage((res) => {
      if (!res.hasOwnProperty('cmd') && (res.from === 'target' || res.from === 'system')) {
        // 别人发给我 或者 撤回的消息 需要动态渲染出来
        let vkey        = res.imFromUser.vkey,
            msgData     = res.imData,
            newMsgData  = {},
            messageList = this.data.messageList
        newMsgData.lastMsgTime = parseInt(msgData.msgTimestamp)
        newMsgData.imFromUser = {
          avatarUrl: msgData.content.user.portrait,
          name: msgData.content.user.name,
          vkey: vkey
        }
        newMsgData.source = res.sourceInfo.source
        newMsgData.vkey = res.imUserRelationVkey
        newMsgData.id = res.imUserRelationId
        switch (res.msgType) {
          case "RC:TxtMsg":
            newMsgData.lastMsg = msgData.content.content
            break
          case "RC:ImgMsg":
            newMsgData.lastMsg = '[图片]'
            break
          case "RC:VcMsg":
            newMsgData.lastMsg = '[语音]'
            break
        }
        let hasExist = false
        for (let i = 0; i <= messageList.length - 1; i++) {
          if (messageList[i].imFromUser && messageList[i].imFromUser.vkey === vkey) {
            newMsgData.unreadMsgNum = messageList[i].unreadMsgNum + 1
            hasExist = true
            if (i === 0) {
              this.setData({['messageList[0]']: newMsgData})
            } else {
              messageList.splice(i, 1)
              messageList.unshift(newMsgData)
              this.setData({messageList})
            }
          }
        }
        if (!hasExist) {
          newMsgData.unreadMsgNum = 1
          messageList.unshift(newMsgData)
          this.setData({messageList})
        }
      }
      if ((res.msgType === "RC:VcMsg" || res.msgType === "RC:ImgMsg" || res.msgType === "RC:TxtMsg")) {
        this.selectComponent('#tabBar').add()
      }
    })
  },
  getList (type) {
    let messageList = this.data.messageList,
        relation_id = []
    for (let {id} of messageList) {
      relation_id.push(id) 
    }
    if (type === 'onShow') {
      relation_id = []
      messageList = []
    }
    getRelationlistApi({count: 10, hideLoading: true, relation_id: relation_id.join(), with_sys: 1}).then(res => {
      messageList = messageList.concat(res.data)
      if (!res.data.length) this.noMore = true
      this.setData({messageList, hasRequire: true})
    }).catch((e) => {
      this.setData({hasRequire: true})
    })
  },
  getSwipeStatus (e) {
    let lockIndex = e.detail.lockIndex,
        curIndex  = e.detail.curIndex
    if (lockIndex !== null && curIndex !== null && lockIndex !== curIndex) {
      this.setData({'lockIndex': lockIndex}, () => {
        this.setData({'lockIndex': null})
      })
    } else {
      this.setData({'lockIndex': lockIndex})
    }
  },
  startChat (e) {
    let data = e.currentTarget.dataset.data
    let vkey = data.imFromUser.vkey,
        isSys= data.isSys
    if (isSys !== 1) {
      wx.navigateTo({url: `/pages/IM/chat/index?vkey=${vkey}`})
    } else {
      wx.navigateTo({url: `/pages/IM/systemMsg/index`})
    }
    
  },
  closeTips () {
    this.setData({'hasTips': false})
  },
  remove (e) {
    let index = e.currentTarget.dataset.index
    deleteMsgApi({vkey: this.data.messageList[index].vkey, hideLoding: true})
    this.selectComponent(`#swipeOut${index}`).reset()
    this.setData({[`messageList[${index}]`]: '', lockIndex: null}, () => {
      let array = this.data.messageList.filter((item) => item !== "")
      if (!array.length) this.setData({messageList: []})
    })
  },
  pick () {
    app.wxReportAnalytics('button_click_event', {
      button_id: 'Try-Pick',
      button_name: 'Pick一下'
    })
    wx.navigateTo({url: '/pages/index/index'})
  },
  follow () {
    app.wxReportAnalytics('button_click_event', {
      button_id: 'Official-Accounts',
      button_name: '引导授权/关注公众号',
      result: '关注公众号'
    })
    this.selectComponent('#popup').show()
  },
  onGotUserInfo (e) {
    app.wxReportAnalytics('button_click_event', {
      button_id: 'Official-Accounts',
      button_name: '引导授权/关注公众号',
      result: '授权'
    })
    getUserInfoAuth(e)
  },


  /**
   * 生命周期函数--监听页面显示
   */
  async onShow () {
    if (!app.globalData.lockonShow) {
      app.globalData.lockonShow = false
      let data = await hasLogin()
      let setData = {}
      this.setData({'hasLogin': data, 'hasLogincb': true})
      if (app.globalData.userInfo) {
        setData = Object.assign(setData, {'userInfo': app.globalData.userInfo})
        this.setData(setData)
      } else {
        app.getUserInfo = () => {
          setData = Object.assign(setData, {'userInfo': app.globalData.userInfo})
          this.setData(setData)
        }
      }
      this.onMessage()
      this.getList('onShow')
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.noMore) return
    this.getList()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    app.globalData.lockonShow = true
    let { inviteCode } = app.globalData
    if(options.from === 'button') {
      return app.wxShare({
        options,
        path: `/pages/index/index?inviteCode=${inviteCode.code}`
      })
    } else {
      return app.wxShare({options})
    }    
  }
})