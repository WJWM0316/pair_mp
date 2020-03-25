import {
  updateUserBaseApi
} from '../../api/user.js'
let app = getApp()
Page({
  data: {
    options: {},
    userInfo: {}
  },
  onLoad(options) {
    this.setData({ options })
    console.log(options)
  },
  onShow() {
    let { options } = this.data
    let title = ''
    let userInfo = wx.getStorageSync('userInfo')
    switch(options.key) {
      case 'nickname':
        title = '昵称'
        break
      case 'birth':
        title = '生日'
        break
      case 'resident':
        title = '常驻地'
        break
      case 'height':
        title = '身高'
        break
      case 'companyName':
        title = '公司'
        break
      case 'ownDescribe':
        title = '自我描述'
        break
      case 'isHasQuestion':
        title = '我的问答'
        break
      default:
        break
    }
    wx.setNavigationBarTitle({title})
    this.setData({userInfo})
    setTimeout(() => wx.removeStorageSync('userInfo'), 16.7)
  },
  bindInput(e) {
    let { userInfo } = this.data
    let { key } = e.currentTarget.dataset
    let { value } = e.detail
    if(userInfo[key] !== value) {
      userInfo[key] = value
      this.setData({ userInfo })
    }
  },
  next() {
    let { options, userInfo } = this.data
    let params = {}
    switch(options.key) {
      case 'nickname':
        params = Object.assign(params, {nickname: userInfo.nickname})
        break
      default:
        break
    }
    updateUserBaseApi(params).then(res => {
      wx.navigateBack({ delta: 1 })
    }).catch(err => app.wxToast({title: err.msg}))
  }
})