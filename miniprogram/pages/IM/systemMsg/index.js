import {getSysMsgApi} from '../../../api/im.js'
import {socket} from '../../../utils/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    socket.onMessage((res) => {
      if (!res.hasOwnProperty('cmd') && res.imFromUser.vkey === 'system') {
        let messageList = this.data.messageList,
            index       = messageList.length
        this.setData({[`messageList[${index}]`]: res}, () => {
          this.pageScrollTo(index)
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getSysMsg (hideLoading = false) {
    getSysMsgApi({count: 10, hideLoading}).then(res => {
      let messageList = this.data.messageList
      messageList = res.data.concat(messageList)
      this.setData({messageList}, () => {
        this.pageScrollTo(this.data.messageList.length - 1)
      })
    })
  },
  pageScrollTo (index) {
    wx.nextTick(()=>{
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        wx.nextTick(()=>{
          wx.pageScrollTo({
            duration: 1,
            selector: `#msg${index}`
          })
        })
      }, 500)
    })
  },
  action (e) {
    let path = e.currentTarget.dataset.data.page
    wx.navigateTo({url: `/${path}`})
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({'messageList': []})
    this.getSysMsg()
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
    this.sendLastMsgTime()
  },
  // 记录最后一条记录发送时间
  sendLastMsgTime () {
    let that = this
    if (!that.data.messageList.length) return
    socket.send({
      cmd: 'send.sys',
      data: {
        "toVkey": "system", 
        "msgType": "PSYS:ReadNtf", 
        "content": {
          "lastMessageSendTime": that.data.messageList[that.data.messageList.length - 1].imData.timestamp, 
          "type":1, 
          "extra": "额外数据"
        }
      }
    })
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
  onShareAppMessage: function () {

  }
})