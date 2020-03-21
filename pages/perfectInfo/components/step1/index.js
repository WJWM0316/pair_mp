import {
  getSalaryListApi
} from '../../../../api/common'
import {
  updateUserSalaryApi
} from '../../../../api/user'

Component({
  properties: {

  },
  data: {
    rangeArray: [],
    value: [0]
  },
  attached () {
    this.init()
  },
  methods: {
    init() {
      getSalaryListApi().then(({ data }) => {
        this.setData({rangeArray: data})
      })
    },
    bindChange(e) {
      let { value } = e.detail
      if(value[0] !== this.data.value[0]) {
        this.setData({ value })
      }
    },
    next() {
      let { rangeArray } = this.data
      let { value } = this.data
      let params = {
        salary: rangeArray[value[0]].id
      }
      console.log(rangeArray[value[0]])
      updateUserSalaryApi(params).then(res => {
        this.triggerEvent('next', true)
      }, err => {
        app.wxToast({title: err.msg})
      })
    }
  }
})
