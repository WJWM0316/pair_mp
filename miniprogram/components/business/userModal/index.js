import {
  setPickerIntentionApi
} from '../../../api/pick.js'
import {localstorage} from '../../../utils/index.js'
const app = getApp()
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer(newVal, oldVal) {
        app.getSubscribeTime({types: 'inviteFriend'}).then(res => this.setData({inviteFriend: res.times.inviteFriend}))
      } 
    },
    infos: {
      type: Object,
      default: {
        userInfo: {},
        pickIntention: {},
        albumVerifyInfo: {
          status: 1
        },
        isSignIn: 0
      }
    }
  },
  data: {
    CDNPATH: app.globalData.CDNPATH,
    code: 0,
    inviteFriend: 0
  },
  methods: {
    subscribe() {
      app.subscribeMessage('inviteFriend').then(() => {
        app.recordSubscribeTime({type: 'inviteFriend', expire: 1000 * 60 * 60 * 24 * 1}).then(() => {
          this.setData({inviteFriend: 1})
          this.selectComponent('#invitationBox').show()
        })   
      }).catch(() => {})
    },
    todoAction(e) {
      let { dataset } = e.currentTarget
      let { PAGEPATH } = app.globalData
      let { userInfo } = this.data.infos
      switch(dataset.action) {
        case 'close':
          this.setData({show: !this.data.show})
          break
        case 'homepage':
          this.setData({show: !this.data.show}, () => {
            wx.navigateTo({
              url: `${PAGEPATH}/homepage/index?vkey=${userInfo.vkey}`,
              success(res) {
                res.eventChannel.emit('userInfo', userInfo)
              }
            })
          })
          break
        case 'upload':
          this.setData({show: !this.data.show}, () => {
            wx.navigateTo({
              url: `${PAGEPATH}/album/index`
            }) 
          })
          break
        case 'update':
          this.setData({code: 2}, () => this.selectComponent('#dialog').show())
          break
        case 'setting':
          this.setData({show: !this.data.show}, () => {
            wx.navigateTo({
              url: `${PAGEPATH}/setting/index`
            })
          })
          break
        case 'sex':
          this.setData({code: 1}, () => this.selectComponent('#dialog').show())
          break
        case 'account':
          this.setData({show: !this.data.show}, () => {
            wx.navigateTo({
              url: `${PAGEPATH}/account/index`
            })
          })
          break
        case 'album':
          this.setData({show: !this.data.show}, () => {
            wx.navigateTo({
              url: `${PAGEPATH}/album/index`
            })
          })
          break
        case 'invitation':
          this.selectComponent('#invitationBox').show()
          // this.setData({show: !this.data.show}, () => {
          //   wx.navigateTo({
          //     url: `${PAGEPATH}/account/index?showModel=true`
          //   })
          // })
          break
      }
    },
    dialogEvent(e) {
      let rtn = e.detail
      setPickerIntentionApi({gender: rtn.sex}).then(() => {
        if (app.globalData.userInfo.pickIntention.gender !== rtn.sex) {
          this.triggerEvent('hasSexChange')
        }
        app.globalData.userInfo.pickIntention.gender = rtn.sex
        let { infos } = this.data
        infos = app.globalData.userInfo
        this.setData({ infos })
      })
    }
  }
})
