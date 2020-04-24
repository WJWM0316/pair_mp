const app =  getApp();
import {getSelectorQuery, socket} from '../../../utils/index.js'
import {getChatDetailApi, getImTopDeatilApi} from '../../../api/im.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    messageList: [],
    selectIndex: null, // 选择发送类型
    showDebutWord: false,
    showSystemHint: false,
    longpressData: {},
    othersUserInfo: {},
    mineUserInfo: {},
    curTimestamp: '',
    noMoreData: false,
    hasRequire: false,
    options: {},
    chatDetail: {},
    cdnPath: app.globalData.CDNPATH
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.options = options
    this.setData({options})
    this.onMessage()
  },
  onMessage () {
    socket.onMessage((res) => {
      // 监听融云返回的消息
      if (!res.hasOwnProperty('cmd')) {
        // 别人发给我 或者 撤回的消息 需要动态渲染出来
        if (res.from === 'target' || res.msgType === 'RC:RcCmd') {
          let index = this.data.messageList.length
          this.setData({[`messageList[${index}]`]: res}, () => {
            wx.nextTick(()=>{
              this.selectComponent('#footer').pageScrollToDom('bottom')
            });
          })
        }
        // 我自己发送的消息 IM回调成功后要赋值一下msgUid
        if (res.from === 'self' && res.msgType !== 'RC:RcCmd') {
          console.log(this.data.messageList[this.index])
          if (this.data.messageList.length && this.data.messageList[this.index].imData.content.sendTimestamp === res.imData.content.sendTimestamp) {
            this.setData({[`messageList[${this.index}].imData.msgUID`]: res.imData.msgUID, [`messageList[${this.index}].imData.sending`]: false})
          }
        }
      } else {
        //针对自己发送的消息 监听后端返回的消息 做异常处理
        if (res.data.msgType !== 'RC:RcCmd') {
          if (res.code !== 200) {
            switch (res.code) {
              case 2101: // 已拉黑
                if (!this.data.chatDetail.blackInfo.blacked) this.setData({[`chatDetail.blackInfo.blacked`]: 1})
                break
              case 2102: // 被拉黑
                if (!this.data.chatDetail.blackInfo.beBlacked) this.setData({[`chatDetail.blackInfo.beBlacked`]: 1})
                break
              case 2103: // 发送三条限制
                if (!this.data.chatDetail.blackInfo.limitSend) this.setData({[`chatDetail.blackInfo.limitSend`]: 1})
                break
            }
            if (this.data.messageList.length && this.data.messageList[this.index].imData.content.sendTimestamp === res.data.data.content.sendTimestamp) {
              this.setData({[`messageList[${this.index}].imData.content.sendFail`]: true, [`messageList[${this.index}].imData.sending`]: false})
            }
          }
        }
      }
    })
  },
  closeWs () {
    socket.close()
  },
  // 发送数据， 先显示再界面上
  sendMsg (e) {
    const that = this
    this.index = this.data.messageList.length
    this.setData({[`messageList[${this.index}]`]: e.detail}, () => {
      wx.nextTick(()=>{
        that.resetView()
        that.selectComponent('#footer').pageScrollToDom('bottom')
      });
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let getData = () => {
      if (!app.globalData.lockonShow) {
        this.getChatMsg()
        this.getImDetail()
      }
      app.globalData.lockonShow = false
    }
    if (app.globalData.userInfo) {
      this.setData({'mineUserInfo': app.globalData.userInfo.userInfo})
      getData()
    } else {
      app.getUserInfo = () => {
        this.setData({'mineUserInfo': app.globalData.userInfo.userInfo})
        getData()
      }
    }
  },
  pageScrollTo () {
    setTimeout(() => {
      wx.nextTick(()=>{
        wx.pageScrollTo({
          duration: 1,
          selector: this.preDomId
        })
      })
    }, 500)
  },
  getChatMsg (hideLoading = false) {
    return getChatDetailApi({vkey: this.options.vkey, hideLoading, count: 10, timestamp: this.timestamp}).then(res => {
      let noMoreData = res.data.length ? false : true
      if (!noMoreData) this.timestamp = res.data[0].imData.timestamp
      this.preDomId = `#msg${res.data.length - 1}`
      let messageList = res.data.concat(this.data.messageList)
      this.setData({messageList, hasRequire: true, noMoreData})
      this.pageScrollTo()
    })
  },
  getImDetail () {
    return getImTopDeatilApi({vkey: this.options.vkey}).then(res => {
      wx.setNavigationBarTitle({
        title: res.data.userInfo.nickname
      })
      let showDebutWord = false,
          showSystemHint= false
      if (!res.data.chatInfo || (res.data.chatInfo && res.data.chatInfo.fromVkey === this.data.mineUserInfo.vkey)) {
        showDebutWord = true
      } 
      if (res.data.chatInfo && res.data.chatInfo.toVkey === this.data.mineUserInfo.vkey) {
        if (res.data.chatInfo.source === 2) showSystemHint = true
      }
      if (res.data.chatInfo && res.data.chatInfo.isHideUserCard) {
        this.selectComponent('#header').toggle('index')
      }
      if (res.data.blackInfo && (res.data.blackInfo.beBlacked || res.data.blackInfo.blacked)) {
        app.wxToast({title: res.data.blackInfo.beBlacked ? '你已被拉黑，无法发送消息' : '对方已被拉黑，无法发送消息'})
      }
      this.setData({'othersUserInfo': res.data.userInfo, 'chatDetail': res.data, showDebutWord, showSystemHint})
    })
  },
  // 拉黑状态变更
  changeBlackStatus (e) {
    let blacked = e.detail
    this.setData({[`chatDetail.blackInfo.blacked`]: blacked})
    setTimeout(() => {
      wx.nextTick(()=>{
        wx.pageScrollTo({
          duration: 1,
          selector: `#bottomBlock`
        })
      })
    }, 500)
  },
  // 长按功能
  longpress (e) {
    
    let dataset  = e.currentTarget.dataset,
        own      = dataset.object.imFromUser.vkey === app.globalData.userInfo.userInfo.vkey
    getSelectorQuery(`.${dataset.class}`, this).then(res => {
      let longpressData = {
        index: dataset.index
      },
      curTimestamp = new Date().getTime(),
      position = {}
      if (res.top >= 80) {
        if (own) {
          longpressData.style = `right:0;top:-100rpx;`
          longpressData.iconStyle = 'right:45rpx;bottom:-31rpx;'
        } else {
          longpressData.style = `left:0;top:-100rpx;`
          longpressData.iconStyle = 'left:14rpx;bottom:-31rpx;'
        }
      } else {
        if (own) {
          longpressData.style = `right:0;bottom:-100rpx;`
          longpressData.iconStyle = 'right:45rpx;top:-31rpx;transform: rotate(180deg);'
        } else {
          longpressData.style = `left:0;bottom:-100rpx;`
          longpressData.iconStyle = 'left:14rpx;top:-31rpx;transform: rotate(180deg);'
        }
      }
      this.setData({longpressData, curTimestamp})
    })
  },
  // 长按功能-列表选项
  action (e) {
    let type = e.currentTarget.dataset.type,
        msgdata = e.currentTarget.dataset.msgdata,
        index  = e.currentTarget.dataset.index
    switch (type) {
      case 'copy':
        wx.setClipboardData({
          data: msgdata.imData.content.content,
          success: () => {
            let longpressData = {
              index: null
            }
            this.setData({'longpressData': null})
            app.wxToast({title: '已复制'})
          }
        })
        break
      case 'withdraw':
        this.withdrawMsg(msgdata.imData.msgUID)
        let longpressData = {
          index: null
        }
        this.setData({[`messageList[${index}]`]: '', longpressData})
        break
    }
  },
  // 撤销消息
  withdrawMsg (msgUID) {
    console.log(msgUID, 111)
    let that = this
    socket.send({
      cmd: 'send.im',
      data: {
        "toVkey": that.options.vkey, 
        "msgType": "RC:RcCmd", 
        "content": {
          "messageUId": msgUID
        }
      }
    })
  },
  // 复位
  resetView (e) {
    let setData = {'longpressData': null}
    if ([0, 3, 4].includes(this.data.selectIndex)) {
      setData.selectIndex = null
    }
    this.setData(setData)
  },
  selectType (e) {
    this.setData({'selectIndex': e.detail})
  },
  // 记录最后一条记录发送时间
  sendLastMsgTime () {
    if (!that.data.messageList.length) return
    let that = this
    socket.send({
      cmd: 'send.im',
      data: {
          "toVkey": that.options.vkey, 
          "msgType": "RC:ReadNtf", 
          "content": {
            "lastMessageSendTime": that.data.messageList[that.data.messageList.length - 1].imData.timestamp, 
            "type":1, 
            "extra": "额外数据"
          }
      }
    })
  },
  // 获取header展开状态
  headerPutUp (e) {
    this.putUp = e.detail
  },
  // 打开开场白
  bindtapMpre (e) {
    this.setData({'selectIndex': 4})
  },
  // 选择开场白赋值给输入框
  selectResult (e) {
    this.selectComponent('#footer').selectResult(e)
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },
  // 记录最后一条记录发送时间
  sendLastMsgTime () {
    let that = this
    if (!that.data.messageList.length) return
    socket.send({
      cmd: 'send.im',
      data: {
          "toVkey": that.options.vkey, 
          "msgType": 
          "RC:ReadNtf", 
          "content": {
            "lastMessageSendTime": that.data.messageList[that.data.messageList.length - 1].imData.timestamp, 
            "type":1, 
            "extra": "额外数据"
          }
      }
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.sendLastMsgTime()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  
  onPullDownRefresh: function (e) {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.scrollTop && !this.data.noMoreData && this.data.hasRequire) {
      this.scrollTop === true
      this.getChatMsg(true).then(() => {
        this.scrollTop === false
        this.pageScrollTo()
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    app.globalData.lockonShow = true
    return app.wxShare({options})
  }
})