const app =  getApp();
import {getRelationlistApi} from '../../../api/im.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasTips: true,
    messageList: [],
    viewAreaHeight: 0,
    lockIndex: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!app.globalData.viewAreaHeight) {
      app.getTabHInit = () => {
        this.setData({'viewAreaHeight': app.globalData.viewAreaHeight})
      }
    } else {
      this.setData({'viewAreaHeight': app.globalData.viewAreaHeight})
    }
    this.getList()
  },
  getList () {
    getRelationlistApi({count: 100}).then(res => {
      let index = this.data.messageList.length ? this.data.messageList.length - 1 : 0
      this.setData({[`messageList[${index}]`]: res.data})
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  onShareAppMessage: function () {

  }
})