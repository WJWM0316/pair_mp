import {
  getLabelListApi,
  addLabelApi
} from '../../api/common'
import {
  updateUserSalaryApi,
  updateUserDescribeApi
} from '../../api/user'
import {
  getSelectorQuery,
  setIconType
} from '../../utils/util.js'

import {
  getUserInfo
} from '../../utils/auth.js'

import {
  idealDescribeReg,
  ownDescribeReg
} from '../../utils/fieldRegular'

let app = getApp()
Page({
  data: {
    salary: 2,
    show: true,
    formData: {
      ideal_describe: '',
      own_describe: ''
    },
    list: [],
    canClick: false,
    labels: [],
    options: {}
  },
  scrollTop: 0,
  onLoad(options) {
    this.setData({options})
  },
  onShow() {
    if (app.globalData.userInfo) {
      this.init()
    } else {
      app.getUserInfo = () => this.init()
    }
  },
  init2() {
    let callback = (data) => {
      let userLabelList = app.globalData.userInfo && app.globalData.userInfo.userInfo && app.globalData.userInfo.userInfo.userLabelList
      data.map((v,i) => {
        v.active = false
        if(!i) {
          v.active = true
        }
        let plabelList = userLabelList.map(v => v.labelId)
        if(plabelList.includes(v.labelId)) {
          let clabelList = userLabelList.find(a => a.labelId === v.labelId).children.map(v => v.labelId)
          v.children.map(v => {
            v.active = false
            if(clabelList.includes(v.labelId)) {
              v.active = true
            }
          })
        }
        setIconType(v)
      })
      this.setData({list: data}, () => {
        if(userLabelList) {
          let labels = []
          userLabelList.map(v => {
            v.children.map(c => {
              labels.push(c.labelId)
            })
          })
          this.setData({ labels, canClick: labels.length < 5 ? false : true })
        }
      })
    }
    getLabelListApi().then(({ data }) => {
      if (app.globalData.userInfo) {
        callback(data)
      } else {
        app.getUserInfo = () => callback(data)
      }
    })
  },
  init() {
    let {options} = this.data
    let { userInfo } = app.globalData.userInfo
    switch(options.step) {
      case '1':
        this.setData({
          canClick: true,
          salary: userInfo.salary ? userInfo.salary : 2,
          show: userInfo.showSalary
        })
        break;
      case '2':
        this.init2()
        break;
      case '3':
        this.setData({
          formData: {
            own_describe: userInfo.ownDescribe
          },
          canClick: userInfo.ownDescribe.length >= 5
        })
        break;
      case '4':
        this.setData({
          formData: {
            ideal_describe: userInfo.idealDescribe
          },
          canClick: userInfo.idealDescribe.length >= 5
        })
        break
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
    if(labels.length >= 20) {
      if(item.active) {
        let i = labels.findIndex(v => v === item.labelId)
        labels.splice(i, 1);
        item.active = false
      } else {
        app.wxToast({title: '最多选择20个标签'})
      }
      this.setData({ list, labels, canClick: labels.length >= 5})
    } else {
      if(item.active) {
        let i = labels.findIndex(v => v === item.labelId)
        labels.splice(i, 1);
        item.active = false
      } else {
        item.active = true
        labels.push(item.labelId)
      }
      this.setData({ list, labels, canClick: labels.length >= 5})
    }
    
  },
  toggle() {
    this.setData({show: !this.data.show})
  },
  bindInput(e) {
    let { formData } = this.data
    let { value } = e.detail
    let { key } = e.currentTarget.dataset
    if(value !== formData[key]) {
      formData[key] = value
      this.setData({ formData, canClick: value.length >= 5 })
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
    let {options,salary,show} = this.data
    let params = {salary, show}

    updateUserSalaryApi(params).then(() => {
      getUserInfo().then(() => {
        let { PAGEPATH } = app.globalData
        wx.navigateTo({
          url: `${PAGEPATH}/perfectUser/index?step=2&redirectTo=${options.redirectTo}`
        })
      })
    }).catch(err => app.wxToast({title: err.msg}))
  },
  next2() {
    let { labels, options } = this.data
    let params = {
      label_id: labels.join(',')
    }
    if(labels.length < 5) {
      app.wxToast({title: '至少选择5个个性标签'})
      return
    }
    addLabelApi(params).then(() => {
      getUserInfo().then(() => {
        let { PAGEPATH } = app.globalData
        if (options.type) {
          wx.navigateBack({ delta: 1 })
        } else {
          wx.navigateTo({
            url: `${PAGEPATH}/perfectUser/index?step=3&redirectTo=${options.redirectTo}`
          })
        }
      })      
    }).catch(err => app.wxToast({title: err.msg}))
  },
  next3() {
    let { formData, options } = this.data
    let params = {
      own_describe: formData.own_describe.trim()
    }
    if(params.own_describe.length < 5) {
      formData['own_describe'] = params.own_describe
      this.setData({ formData }, () => app.wxToast({title: '自我描述至少需要5个字'}))
      return
    }
    updateUserDescribeApi(params).then(() => {
      getUserInfo().then(() => {
        let { PAGEPATH } = app.globalData
        wx.navigateTo({
          url: `${PAGEPATH}/perfectUser/index?step=4&redirectTo=${options.redirectTo}`
        })
      })      
    }).catch(err => app.wxToast({title: err.msg}))
  },
  next4() {
    let { formData, options } = this.data
    let params = {
      ideal_describe: formData.ideal_describe.trim()
    }
    if(params.ideal_describe.length < 5) {
      formData['ideal_describe'] = params.ideal_describe
      this.setData({ formData }, () => app.wxToast({title: '理想型描述至少需要5个字'}))
      return
    }
    updateUserDescribeApi(params).then(() => {
      getUserInfo().then(() => {
        wx.navigateBack({
          delta: 4
        })
      })      
    }).catch(err => app.wxToast({title: err.msg}))
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    return app.wxShare({options})
  }
})