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
let fixedDomPosition = 0
let scrollTop = 0
let curDom = '.ul0'
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
    moveParams: {
      scrollLeft: 0
    },
    scrollLeft: 0,
    fixedDom: false,
    canClick: false
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
        getSalaryListApi().then(({ data }) => this.setData({rangeArray: data, canClick: true}))
        break
      case 2:
        getSelectorQuery('.scroll-box').then(res => fixedDomPosition = res.top || 0)
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
      this.setData({ formData, canClick: true })
    }
  },
  tabClick(e) {
    let { index } = e.currentTarget.dataset
    let { dom } = e.currentTarget.dataset
    let { list } = this.data
    let callback = () => {
      getSelectorQuery(dom).then(res => {
        scrollTop = res.top - 60 + scrollTop
        wx.pageScrollTo({
          scrollTop,
          duration: 300
        })
      })
    }
    list.map((v, i, a) => {
      v.active = false
      if(i === index) {
        v.active = true
        callback()
      }
    })
    this.setData({ list })
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
      let { step } = this.data
      step++
      this.setData({ step }, () => {
        if(step === 4) {
          wx.navigateBack({ delta: 1 })
        }
      })
    }).catch(err => app.wxToast({title: err.msg}))
  },
  onPageScroll(e) {
    scrollTop = e.scrollTop
    if(e.scrollTop >= fixedDomPosition - 10) {
      if(!this.data.fixedDom) this.setData({fixedDom: true})
    } else {
      if(this.data.fixedDom) this.setData({fixedDom: false})
    }
  }
})