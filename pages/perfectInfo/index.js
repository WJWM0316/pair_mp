import {
  getLabelListApi,
  addLabelApi
} from '../../api/common'
import {
  updateUserSalaryApi,
  updateUserDescribeApi
} from '../../api/user'
import {
  getSelectorQuery
} from '../../utils/util.js'
let app = getApp()
let fixedDomPosition = 0
let scrollTop = 0
Page({
  data: {
    step: 1,
    salary: 2,
    formData: {
      ideal_describe: '',
      own_describe: ''
    },
    list: [],
    fixedDom: false,
    canClick: false,
    labels: []
  },
  onUnload() {
    fixedDomPosition = 0
    scrollTop = 0
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
    if(this.data.step) {
      this.setData({canClick: true})
    }
    getSelectorQuery('.scroll-box').then(res => fixedDomPosition = res.top || 0)
    getLabelListApi().then(({ data }) => {
      data.map((v,i) => v.active = !i ? true : false)
      this.setData({list: data})
    })
  },
  pickerResult(e) {
    let salary = e.detail.id
    if(salary !== this.data.salary) {
      this.setData({ salary })
    }
  },
  check(e) {
    let { list, labels } = this.data
    let { child, parent } = e.currentTarget.dataset
    let item = list[parent].children[child]
    if(item.active) {
      let i = labels.findIndex(v => v === item.labelId)
      labels.splice(i, 1);
      item.active = false
    } else {
      item.active = true
      labels.push(item.labelId)
    }
    this.setData({ list, labels, canClick: !!labels.length})
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
    let { formData, labels } = this.data
    let params = {}
    let funcApi = null
    switch(this.data.step) {
      case 1:
        params = {
          salary: this.data.salary
        }
        funcApi = updateUserSalaryApi
        break
      case 2:
        params = {
          label_id: labels.join(',')
        }
        funcApi = addLabelApi
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
        if(step > 4) {
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