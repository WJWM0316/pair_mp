import {localstorage} from '../../utils/index.js'
const app =  getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cdnPath: app.globalData.CDNPATH
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let token = localstorage.get('token'),
        path  = ''
    if (token) {
      path = decodeURIComponent(options.redirectTo)
    } else {
      path = '/pages/index/index'
    }
    wx.reLaunch({url: path})
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    return app.wxShare({options})
  }
})