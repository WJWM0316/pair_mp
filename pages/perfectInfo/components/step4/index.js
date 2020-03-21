import {
  wxToast
} from '../../../../utils/func.js'
import {
  updateUserDescribeApi
} from '../../../../api/user'
Component({
  data: {
    ideal_describe: ''
  },
  methods: {
    bindInput(e) {
      let { value } = e.detail
      if(value !== this.data.ideal_describe) {
        this.setData({ideal_describe: value})
      }
    },
    next() {
      updateUserDescribeApi({ideal_describe: this.data.ideal_describe.trim()}).then(res => {
        this.triggerEvent('next', true)
      }, err => {
        wxToast({title: err.msg})
      })
    }
  }
})
