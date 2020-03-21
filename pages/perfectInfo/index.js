import {
  getSalaryListApi
} from '../../api/common'
import {
  updateUserSalaryApi
} from '../../api/user'
let app = getApp()
Page({
  data: {
    step: 1,
    rangeArray: [],
    value: [0],
    title: '年收入范围'
  },
  onShow() {
    this.init()
  },
  next() {
    let { step } = this.data
    step++
    this.setData({ step })
  },
  init() {
    switch(this.data.step) {
      case 1:
        getSalaryListApi().then(({ data }) => this.setData({rangeArray: data}))
        break
      default:
        break
    }
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
    let params = {}
    let funcApi = null
    switch(this.data.step) {
      case 1:
        params = {
          salary: rangeArray[value[0]].id
        }
        funcApi = updateUserSalaryApi
        break
      default:
        break
    }
    funcApi(params).then(res => {
      this.triggerEvent('next', true)
    }).catch(err => app.wxToast({title: err.msg}))
  },
  onPageScroll(e) {
    console.log(e, 'kkkk1')
  }
})