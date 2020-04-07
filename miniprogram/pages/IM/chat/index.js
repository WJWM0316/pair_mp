const app =  getApp();
import {getSelectorQuery, socket, util} from '../../../utils/index.js'
import {getChatDetailApi, getImTopDeatilApi, } from '../../../api/im.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    messageList: [],
    selectIndex: null, // 选择发送类型
    longpressData: {},
    othersUserInfo: {},
    mineUserInfo: {},
    emojiPath: app.globalData.CDNPATH
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.options = options
  },
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    socket.onMessage((res) => {
      let data = res.imData
      // 如果是自己发的消息IM回调了需要更替成IM的数据
      if (Number(res.imFromUser.vkey) === this.options.vkey && Number(res.imFromUser.uid) !== Number(this.data.mineUserInfo.id)) {
        let index = this.data.messageList.length
        this.setData({[`messageList[${index}]`]: res}, () => {
          wx.nextTick(()=>{
            this.selectComponent('#footer').pageScrollToDom('bottom')
          });
        })
      }
    })
  },
  // 发送数据， 先显示再界面上
  sendMsg (e) {
    const that = this
    let index = this.data.messageList.length
    this.setData({[`messageList[${index}]`]: e.detail}, () => {
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
    if (!app.globalData.lockonShow) {
      this.getChatMsg()
      this.getImDetail()
    }
    if (app.globalData.userInfo) {
      this.setData({'mineUserInfo': app.globalData.userInfo.userInfo})
    } else {
      app.getUserInfo = () => {
        this.setData({'mineUserInfo': app.globalData.userInfo.userInfo})
      }
    }
    app.globalData.lockonShow = false
  },
  getChatMsg () {
    getChatDetailApi({vkey: this.options.vkey, count: 11}).then(res => {
      this.setData({messageList: res.data}, () => {
        wx.nextTick(()=>{
          wx.pageScrollTo({
            duration: 1,
            selector: `#bottomBlock`
          })
        });
      })
    })
  },
  getImDetail () {
    getImTopDeatilApi({vkey: this.options.vkey}).then(res => {
      this.setData({'othersUserInfo': res.data.userInfo})
    })
  },
  // 长按功能
  longpress (e) {
    let dataset  = e.currentTarget.dataset,
        own      = dataset.object.imFromUser.uid === this.data.myUid
    getSelectorQuery(`.${dataset.class}`, this).then(res => {
      let longpressData = {
        index: dataset.index
      },
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
      this.setData({longpressData})
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
  // 获取header展开状态
  headerPutUp (e) {
    this.putUp = e.detail
  },
  // 打开开场白
  bindtapMpre (e) {
    this.setData({'selectIndex': 4})
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  // 记录最后一条记录发送时间
  sendLastMsgTime () {
    let that = this
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
    this.sendLastMsgTime
  },

  // 页面滚动时执行
  onPageScroll: function(e) {

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

  },

  onShareAppMessage: function (options) {
    app.globalData.lockonShow = true
    let that = this
    return app.wxShare({
      options, 
      title: '来撩吧！', 
      path: `/pages/IM/chat/index?vkey=${that.data.mineUserInfo.vkey}`
    })
  }
})