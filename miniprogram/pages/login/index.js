const app =  getApp();
import {registerApi, sendMsgApi} from '../../api/auth.js'
import {getPhoneNumber, phoneCodeLogin} from '../../utils/index.js'
import {mobileReg} from '../../utils/fieldRegular.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canClick: false,
    cdnPath: app.globalData.CDNPATH,
    sendTimes: 60
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
    if (e.detail.errMsg.indexOf('fail') !== -1) return
    getPhoneNumber(e, this.options)
  },
  bindinput (e) {
    switch(e.currentTarget.dataset.type) {
      case 'phone':
        this.phone = e.detail.value
        break
      case 'code':
        this.code = e.detail.value
        break
    }
    if (this.phone && this.code) {
      if (!this.data.canClick) this.setData({canClick: true})
    } else {
      if (this.data.canClick) this.setData({canClick: false})
    }
  },
  countDown () {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      let sendTimes = this.data.sendTimes
      if (sendTimes > 0) {
        sendTimes--
        this.countDown()
      } else {
        sendTimes = 60
        clearTimeout(this.timer)
      }
      this.setData({sendTimes})
    }, 1000)
  },
  sendMsg () {
    if (mobileReg.test(this.phone)) {
      sendMsgApi({mobile: this.phone}).then(res => {
        this.countDown()
        app.wxToast({title: '发送成功', icon: 'success'})
      })
    } else {
      app.wxToast({title: '请输入正确是手机号'})
    }
  },
  login () {
    let data = {
      mobile: this.phone,
      code: this.code
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