import {
  getUserShareCodeApi
} from '../../../api/user.js'

const app = getApp()
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    inviteCode: {},
    CDNPATH: app.globalData.CDNPATH
  },

  /**
   * 组件的方法列表
   */
  methods: {
    fetch() {
      this.setData({show: false})
    },
    show() {
      getUserShareCodeApi().then(({data}) => {
        Object.assign(app.globalData, {inviteCode: data.inviteCode})
        this.setData({show: true, inviteCode: data.inviteCode, show: true})
      })
    },
    stopPageScroll () {
      return false
    },
    close () {
      this.setData({show: false}, () => this.triggerEvent('close'))
    },
    todoAction(e) {
      let { itemList } = this.data
      let { index } = e.currentTarget.dataset
      let result = itemList.find((v, i) => i === index)
      this.setData({show: false}, () => this.triggerEvent('close'))
      this.triggerEvent('drawerAction', result)
    },
    download() {
      let { PAGEPATH } = app.globalData
      this.setData({show: false}, () => {
        wx.navigateTo({
          url: `${PAGEPATH}/poster/index`
        })
      })
    },
    copy() {
      let callback = () => {
        let { inviteCode } = this.data
        let  { userInfo } = app.globalData.userInfo
let shareContent = `【${userInfo.nickname} 邀请你加入Pick Me】\n专属邀请码是 \n${inviteCode.code}\n搜索【PickMe】小程序，匹配最适合你的TA`
        wx.setClipboardData({data: shareContent })
      }
      if (app.globalData.userInfo) {
        callback()
      } else {
        app.getUserInfo = () => callback()
      }
    }
  }
})
