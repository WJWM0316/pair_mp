import {postInviteCodeApi} from '../../api/user.js'
import {getUserInfo} from '../../utils/auth.js'
import {logout} from '../../utils/index.js'

const app = getApp()
Page({
  onLoad() {
    wx.hideHomeButton()
  },
  data: {
    CDNPATH: app.globalData.CDNPATH,
    code: ''
  },
  open() {
    this.selectComponent('#popup').show()
  },
  bindInput(e) {
    let {value} = e.detail
    this.setData({code: value})
  },
  post() {
    let params = {
      code: this.data.code.trim()
    }
    console.log(params)
    if(!params.code) {
      app.wxToast({title: '请输入邀请码'})
      return
    }
    postInviteCodeApi(params).then(() => {
      getUserInfo().then(() => {
        let { userInfo } = app.globalData.userInfo
        if (userInfo.step !== 9) {
          wx.reLaunch({
            url: `/pages/createUser/index?step=${userInfo.step}`
          })
        } else {
          wx.reLaunch({url: `/pages/index/index`})
        }
      })      
    }).catch(err => app.wxToast({title: err.msg}))
  },
  logout() {
    app.wxConfirm({
      title: '切换账号', 
      content: '是否确认切换账号？',
      cancelText: '否',
      confirmText: '是',
      confirmBack: () => {
        logout()
      }
    })
  }
})