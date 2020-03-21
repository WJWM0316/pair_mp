import {
  wxToast
} from '../../../../utils/wxApi.js'
import {
  updateUserDescribeApi
} from '../../../../api/user'

Component({
  data: {
    own_describe: ''
  },
  methods: {
    bindInput(e) {
      let { value } = e.detail
      if(value !== this.data.own_describe) {
        this.setData({own_describe: value})
      }
    },
    next() {
      updateUserDescribeApi({own_describe: this.data.own_describe.trim()}).then(res => {
        this.triggerEvent('next', true)
      }, err => {
        wxToast({title: err.msg})
      })
    }
  }
})
