import {
  createUserStep2Api
} from '../../../../api/user'
const app =  getApp();
let list = []
for(let i = 100; i <= 300; i++) {
  list.push(i)
}
Component({
  data: {
    list,
    height: '170',
    value: 0,
    val: 0,
    value2: 0,
    styles: {
      line: '#C7D7E7',
      bginner: '#ffffff',
      bgoutside: '#ffffff',
      lineSelect: '#0CCDDA',
      font: '#1F252B'
    }
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
      }, err => {
        app.wxToast({title: err.msg})
      })
    }
  }
})
