import {
  getSalaryListApi
} from '../../api/common'
import {
  updateUserSalaryApi,
  updateUserDescribeApi
} from '../../api/user'
import {
  getSelectorQuery
} from '../../utils/util.js'
import {list} from './components/step2/data'
let app = getApp()
Page({
  data: {
    step: 2,
    rangeArray: [],
    value: [0],
    formData: {
      ideal_describe: '',
      own_describe: ''
    },
    list,
    navTabIndex: 0,
    moveParams: {
      scrollLeft: 0
    },
    scrollLeft: 0,
    scrollTop: 0
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
  bindInput(e) {
    let { formData } = this.data
    let { value } = e.detail
    let { key } = e.currentTarget.dataset
    if(value !== formData[key]) {
      formData[key] = value
      this.setData({ formData })
    }
  },
  tabClick(e) {
    let { dom } = e.currentTarget.dataset
    getSelectorQuery(dom).then(res => {
      wx.pageScrollTo({
        scrollTop: res.top,
        duration: 300
       });
      console.log(res)
      let { top } = res
      this.setData({scrollTop: top - (296/2)})
      // console.log(res, dom)
    })
  },
  next() {
    let { formData } = this.data
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
      case 2:
        params = {
          salary: rangeArray[value[0]].id
        }
        funcApi = updateUserSalaryApi
        break
      case 3:
        params = {
          own_describe: formData.own_describe
        }
        funcApi = updateUserDescribeApi
        break
      case 4:
        params = {
          ideal_describe: formData.ideal_describe
        }
        funcApi = updateUserDescribeApi
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