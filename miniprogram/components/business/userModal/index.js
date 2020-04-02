import {
  setPickerIntentionApi
} from '../../../api/pick.js'

const app = getApp()
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },
  data: {
    CDNPATH: app.globalData.CDNPATH,
    userInfo: {},
    code: 0,
    pickIntention: {id: 0, uid: 0, gender: -1}
  },
  ready () {
    this.setData({
      userInfo: app.globalData.userInfo.userInfo,
      pickIntention: app.globalData.userInfo.pickIntention
    })
  },

  methods: {
    todoAction(e) {
      let { dataset } = e.currentTarget
      let { PAGEPATH } = app.globalData
      switch(dataset.action) {
        case 'close':
          this.setData({show: !this.data.show})
          break
        case 'homepage':
          this.setData({show: !this.data.show}, () => {
            wx.navigateTo({
              url: `${PAGEPATH}/homepage/index?vkey=${'ighvcabv'}`
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
      }
    },
    dialogEvent(e) {
      let rtn = e.detail
      setPickerIntentionApi({gender: rtn.sex}).then(() => {
        app.globalData.userInfo.pickIntention.gender = Number(rtn.sex)
        this.setData({
          pickIntention: app.globalData.userInfo.pickIntention
        })
      })
    }
  }
})
