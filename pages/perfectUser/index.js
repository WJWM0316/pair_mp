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
    labels: [],
    options: {}
  },
  fixedDomPosition: 0,
  scrollTop: 0,
  onLoad(options) {
    if(options.step) {
      this.setData({step: options.step, options})
    }
  },
  onShow() {
    this.init()
  },
  next() {
    let { step } = this.data
    step++
    this.setData({ step })
  },
  init2() {
    getLabelListApi().then(({ data }) => {
      let { options } = this.data
      let labelList = wx.getStorageSync('labelList')
      data.map((v,i) => {
        v.active = false
        if (!options.type) {
          if(!i) {
            v.active = true
          }
        } else {
          let plabelList = labelList.map(v => v.labelId)

          if(plabelList.includes(v.labelId)) {
            let clabelList = labelList.find(a => a.labelId === v.labelId).children.map(v => v.labelId)
            v.children.map(v => {
              v.active = false
              if(clabelList.includes(v.labelId)) {
                v.active = true
              }
            })
          }
        }
        switch(v.labelId) {
          case 110000:
            v.iconName = 'icon_renshe'
            break
          case 120000:
            v.iconName = 'icon_meishi'
            break
          case 130000:
            v.iconName = 'icon_yundong'
            break
          case 140000:
            v.iconName = 'icon_yinle'
            break
          case 150000:
            v.iconName = 'icon_yingshi'
            break
          case 160000:
            v.iconName = 'icon_shuji'
            break
          case 170000:
            v.iconName = 'icon_erciyuan'
            break
          case 180000:
            v.iconName = 'icon_youxi'
            break
          case 190000:
            v.iconName = 'icon_lvhang'
            break
          default:
            v.iconName = 'icon_lvhang'
            break
        }
      })
      this.setData({list: data}, () => {
        if(labelList) {
          let labels = labelList.map(v => v.labelId)
          this.setData({ labels, canClick: true })
          wx.removeStorageSync('labelList')
        }
      })
    })
  },
  init() {
    let { step } = this.data
    if(step == 1) {
      this.setData({canClick: true})
    } else if(step == 2) {
      this.init2()
    } else {

    }
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
      getSelectorQuery(dom, this).then(res => {
        this.scrollTop = res.top - 60 + this.scrollTop
        wx.pageScrollTo({ scrollTop: this.scrollTop, duration: 300})
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
  next1() {
    let params = {
      salary: this.data.salary
    }
    updateUserSalaryApi(params).then(() => {
      this.setData({ step: 2, canClick: false }, () => this.init2())
    }).catch(err => app.wxToast({title: err.msg}))
  },
  next2() {
    let { labels, options } = this.data
    let params = {
      label_id: labels.join(',')
    }
    addLabelApi(params).then(() => {
      if (options.type) {
        wx.navigateBack({ delta: 1 })
      } else {
        this.setData({ step: 3, canClick: false })
      }
    }).catch(err => app.wxToast({title: err.msg}))
  },
  next3() {
    let { formData } = this.data
    let params = {
      own_describe: formData.own_describe
    }
    updateUserDescribeApi(params).then(() => {
      this.setData({ step: 4, canClick: false })
    }).catch(err => app.wxToast({title: err.msg}))
  },
  next4() {
    let { formData } = this.data
    let params = {
      ideal_describe: formData.ideal_describe
    }
    updateUserDescribeApi(params).then(() => {
      wx.navigateBack({ delta: 1 })
    }).catch(err => app.wxToast({title: err.msg}))
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop
  }
})