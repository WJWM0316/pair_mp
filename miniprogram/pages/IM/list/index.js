const app =  getApp();
import {getRelationlistApi, deleteMsgApi} from '../../../api/im.js'
import {getUserInfoAuth, socket} from '../../../utils/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasTips: true,
    userInfo: 0,
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
    this.setData({'userInfo': app.globalData.userInfo, 'viewAreaHeight': app.globalData.viewAreaHeight})
    socket.onMessage((res) => {
      if (res.imFromUser.vkey !== app.globalData.userInfo.userInfo.vkey) {
        let vkey        = res.imFromUser.vkey,
            msgData     = res.imData,
            newMsgData  = {},
            messageList = this.data.messageList
        newMsgData.lastMsgTime = msgData.msgTimestamp
        newMsgData.imFromUser = {}
        newMsgData.imFromUser.avatarUrl = msgData.content.user.portrait
        newMsgData.imFromUser.name = msgData.content.user.name
        newMsgData.imFromUser.vkey = vkey
        newMsgData.lastMsgTime = msgData.msgTimestamp
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
        for (let i = 0; i < messageList.length - 1; i++) {
          if (messageList[i].imFromUser && messageList[i].imFromUser.vkey === vkey) {
            newMsgData.unreadMsgNum = messageList[i].unreadMsgNum + 1
            hasExist = true
            if (i === 0) {
              this.setData({['messageList[0]']: newMsgData})
            } else {
              console.log(messageList, i)
              messageList.splice(i, 1)
              messageList.unshift(newMsgData)
              this.setData({messageList})
            }
            return
          }
        }
        if (!hasExist) {
          newMsgData.unreadMsgNum = 1
          messageList.unshift(newMsgData)
          this.setData({messageList})
        }
      }
    })
  },
  getList () {
    getRelationlistApi({count: 100, hideLoding: true}).then(res => {
      let index = this.data.messageList.length ? this.data.messageList.length - 1 : 0
      this.setData({messageList: res.data, hasRequire: true})
    })
  },
  getSwipeStatus (e) {
    let lockIndex = e.detail.lockIndex,
        curIndex  = e.detail.curIndex
    if (lockIndex !== null && curIndex !== null && lockIndex !== curIndex) {
      this.setData({'lockIndex': lockIndex}, () => {
        this.setData({'lockIndex': null})
      })
    }
  },
  startChat (e) {
    let vkey = e.currentTarget.dataset.vkey
    wx.navigateTo({url: `/pages/IM/chat/index?vkey=${vkey}`})
  },
  closeTips () {
    this.setData({'hasTips': false})
  },
  remove (e) {
    let index = e.currentTarget.dataset.index
    deleteMsgApi({vkey: this.data.messageList[index].vkey, hideLoding: true})
    console.log(`#swipeOut${index}`, this.selectComponent(`#swipeOut${index}`))
    this.selectComponent(`#swipeOut${index}`).reset()
    this.setData({[`messageList[${index}]`]: '', lockIndex: null})
  },
  pick () {
    wx.navigateTo({url: '/pages/index/index'})
  },
  follow () {
    this.selectComponent('#popup').show()
  },
  onGotUserInfo (e) {
    getUserInfoAuth(e)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    this.getList()
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

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    return app.wxShare({options})
  }
})