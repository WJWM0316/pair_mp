const app =  getApp();
import {registerApi, sendMsgApi} from '../../api/auth.js'
import {getPhoneNumber, phoneCodeLogin} from '../../utils/index.js'
let phone = '',
    code = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canClick: false
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

  },
  getPhoneNumber (e) {
    getPhoneNumber(e, this.options)
  },
  bindinput (e) {
    switch(e.currentTarget.dataset.type) {
      case 'phone':
        phone = e.detail.value
        break
      case 'code':
        code = e.detail.value
        break
    }
    if (phone && code) {
      if (!this.data.canClick) this.setData({canClick: true})
    } else {
      if (this.data.canClick) this.setData({canClick: false})
    }
  },
  sendMsg () {
    sendMsgApi({mobile: phone}).then(res => {
      app.wxToast({title: '发送成功', icon: 'success'})
    })
  },
  login () {
    let data = {
      mobile: phone,
      code
    }
    phoneCodeLogin(data, this.options)
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