import {
  createUserStep2Api
} from '../../../../api/user'
const app =  getApp();
Component({
  data: {
    height: '163'
  },
  methods: {
    bindvalue2(e) {
      let { value } = e.detail
      if(value !== this.data.height) {
        this.setData({ height: String(value) }, () => wx.vibrateShort())
      }
    },
    next() {
      createUserStep2Api({height: this.data.height}).then(() => {
        this.triggerEvent('next', true)
      }).catch(err => app.wxToast({title: err.msg}))
    },
    resultEvent(e) {
      if(e.detail.value !== this.data.height) {
        this.setData({height: e.detail.value}, () => wx.vibrateShort())
      }
    }
  }
})
