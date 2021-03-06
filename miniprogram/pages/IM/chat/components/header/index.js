const app =  getApp();
import {getSelectorQuery} from '../../../../../utils/util.js'
import {putHeaderApi, delHeaderApi} from '../../../../../api/im.js'
import {setBackApi, removeBackApi} from '../../../../../api/black.js'
Component({
  externalClasses: ['my-class'],
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    othersUserInfo: Object,
    mineUserInfo: Object,
    chatDetail: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    putUp: true,
    tips: true,
    cdnPath: app.globalData.CDNPATH,
    showNoviceGuide: false,
    pxTorpxRatio: app.globalData.systemInfo.pxTorpxRatio
  },
  attached () {
    this.getNoviceGuide()
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    // 开启新手引导
    getNoviceGuide () {
      let showNoviceGuide = wx.getStorageSync('showNoviceGuide')
      this.setData({showNoviceGuide: !showNoviceGuide})
    },
    // 关闭新手引导
    closeNoviceGuide () {
      wx.setStorageSync('showNoviceGuide', true)
      this.setData({showNoviceGuide: false})
    },
    toggle (toggle) {
      let putUp = this.data.putUp
      this.setData({'putUp': !putUp})
      if (toggle === 'index') return
      if (putUp) {
        putHeaderApi({vkey: this.data.othersUserInfo.vkey, hideLoading: true})
      } else {
        delHeaderApi({vkey: this.data.othersUserInfo.vkey, hideLoading: true})
      }
    },
    more () {
      const that = this
      let itemList = that.data.chatDetail.blackInfo.blacked ? ['举报', '移出黑名单'] : ['举报', '拉入黑名单']
      wx.showActionSheet({
        itemList,
        success (res) {
          switch (res.tapIndex) {
            case 0:
              that.report()
              break
            case 1:
              that.setBlack()
              break
          }
        },
        fail (res) {
          console.log(res.errMsg)
        }
      })
    },
    setBlack () {
      const that = this
      let isBlacked = this.data.chatDetail.blackInfo.blacked
      app.wxConfirm({
        title: isBlacked ? '移出黑名单' : '拉入黑名单',
        content: isBlacked ? '移出黑名单后，你将继续收到对方发送的消息，确认将其移出黑名单？' : '拉入黑名单后，你将不再收到对方发送的消息，确认将其拉入黑名单？',
        confirmBack: () => {
          let fun = isBlacked ? removeBackApi : setBackApi
          fun({vkey: this.data.othersUserInfo.vkey, hideLoading: true}).then(res => {
            that.setData({[`chatDetail.blackInfo.blacked`]: !isBlacked})
            that.triggerEvent('changeBlackStatus', !isBlacked)
            app.wxToast({title: isBlacked ? '已移出黑名单' : '已拉入黑名单', icon: 'success'})
          })
        }
      })
    },
    report () {
      wx.navigateTo({url: `/pages/report/index?vkey=${this.data.othersUserInfo.vkey}`})
    },
    jump (e) {
      let { dataset } = e.currentTarget
      wx.navigateTo({
        url: `/pages/homepage/index?vkey=${dataset.vkey}`,
        success(res) {
          res.eventChannel.emit('userInfo', dataset.info)
        }
      })
    }
  }
})
