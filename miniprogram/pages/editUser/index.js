import {
  updateUserBaseApi,
  updateUserSalaryApi,
  updateUserDescribeApi
} from '../../api/user.js'
import {
  getCompanyNameListApi
} from '../../api/common.js'
import {
  idealDescribeReg,
  ownDescribeReg,
  companyNameReg,
  positionReg
} from '../../utils/fieldRegular'

import {
  getUserInfo
} from '../../utils/auth'

let app = getApp()
Page({
  data: {
    options: {},
    userInfo: {},
    careerVerifyInfo: {},
    pickIntention: {},
    nameList: []
  },
  onLoad(options) {
    this.setData({ options })
    console.log(options)
  },
  debounce(fn, context, delay, text) {
    clearTimeout(fn.timeoutId)
    fn.timeoutId = setTimeout(() => fn.call(context, text), delay)
  },
  legalize() {
    let { PAGEPATH } = app.globalData
    let { userInfo, careerVerifyInfo } = this.data
    wx.setStorageSync('searchCompany', {
      company_name: userInfo.companyName
    })
    wx.navigateTo({
      url: `${PAGEPATH}/methods/index?companyId=${userInfo.companyId ? userInfo.companyId : ''}&reback=2`
    })
  },
  onShow() {
    let { options } = this.data
    let title = ''
    switch(options.key) {
      case 'nickname':
        title = '昵称'
        break
      case 'birth':
        title = '生日'
        break
      case 'resident':
        title = '常驻地'
        break
      case 'height':
        title = '身高'
        break
      case 'companyName':
        title = '公司'
        break
      case 'ownDescribe':
        title = '自我描述'
        break
      case 'isHasQuestion':
        title = '我的问答'
        break
      case 'occupation':
        title = '职业'
        break
      case 'idealDescribe':
        title = '我的理想型'
        break
      case 'ownDescribe':
        title = '自我描述'
        break
      case 'degree':
        title = '学历'
        break
      case 'school':
        title = '学校'
        break
      case 'salary':
        title = '年收入'
        break
      case 'positionName':
        title = '担任职位'
        break
      case 'hometown':
        title = '家乡'
        break
      default:
        break
    }
    wx.setNavigationBarTitle({title})
    let callback = () => {
      let { userInfo, careerVerifyInfo, pickIntention } = app.globalData.userInfo
      if(!Object.keys(careerVerifyInfo).length) {
        careerVerifyInfo = Object.assign(careerVerifyInfo, { status: -1})
      }
      this.setData({
        userInfo,
        careerVerifyInfo,
        pickIntention
      })
    }

    if (app.globalData.userInfo) {
      callback()
    } else {
      app.getUserInfo = () => callback()
    }
  },
  toggle() {
    let { userInfo } = this.data
    userInfo.showSalary = !userInfo.showSalary
    this.setData({userInfo})
  },
  bindInput(e) {
    let { userInfo, options } = this.data
    let { key } = e.currentTarget.dataset
    let { value } = e.detail
    if(userInfo[key] !== value) {
      userInfo[key] = value
      this.setData({ userInfo }, () => {
        if(options.key === 'companyName') {
          this.debounce(this.getCompanyNameList, null, 300, value)
        }
      })
    }
  },
  getCompanyNameList(name) {
    let { userInfo } = this.data
    userInfo.companyName = name
    this.setData({userInfo, canClick: true}, () => {
      if (!name) return
      getCompanyNameListApi({company_name: name}).then(res => {
        let nameList = res.data
        nameList.map(field => {
          field.html = field.companyName.replace(new RegExp(name,'g'),`<span style="color: #00C4CD;">${name}</span>`)
          field.html = `<div>${field.html}</div>`
        })
        this.setData({ nameList })
      })
    })
  },
  selectCompany(e) {
    let { userInfo } = this.data
    let { info } = e.currentTarget.dataset
    userInfo.companyName = info.companyName
    setTimeout(() => {
      this.setData({userInfo, nameList: []})
    }, 16.7)
  },
  pickerResult(e) {
    let { options, userInfo } = this.data
    let detail = e.detail
    switch(options.key) {
      case 'birth':
        userInfo = Object.assign(userInfo, {birth: detail.desc})
        break
      case 'resident':
        userInfo = Object.assign(userInfo, {resident_str: detail.desc})
        break
      case 'height':
        userInfo = Object.assign(userInfo, {height: detail.value})
        break
      case 'hometown':
        userInfo = Object.assign(userInfo, {area_id_hometown: detail.areaId})
        break
      case 'occupation':
        userInfo = Object.assign(userInfo, {occupation: detail.labelId})
        break
      case 'salary':
        userInfo = Object.assign(userInfo, {salary: detail.id})
        break
      case 'degree':
        userInfo = Object.assign(userInfo, {degree: detail.id})
        break
      default:
        break
    }
    this.setData({ userInfo })
  },
  next() {
    let { options, userInfo } = this.data
    let params = {}
    let funcApi = updateUserBaseApi
    let needCheck = [
      'companyName',
      'positionName',
      'ownDescribe',
      'idealDescribe'
    ]
    switch(options.key) {
      case 'nickname':
        params = Object.assign(params, {nickname: userInfo.nickname})
        break
      case 'birth':
        params = Object.assign(params, {birth: userInfo.birth})
        break
      case 'resident':
        params = Object.assign(params, {resident_str: userInfo.resident_str})
        break
      case 'height':
        params = Object.assign(params, {height: String(userInfo.height)})
        break
      case 'hometown':
        params = Object.assign(params, {area_id_hometown: userInfo.area_id_hometown})
        break
      case 'occupation':
        params = Object.assign(params, {occupation: userInfo.occupation})
        break
      case 'companyName':
        params = Object.assign(params, {company_name: userInfo.companyName.trim()})
        break
      case 'positionName':
        params = Object.assign(params, {position_name: userInfo.positionName.trim()})
        break
      case 'salary':
        params = Object.assign(params, {salary: userInfo.salary, show: userInfo.showSalary})
        funcApi = updateUserSalaryApi
        break
      case 'school':
        params = Object.assign(params, {school: userInfo.school})
        break
      case 'degree':
        params = Object.assign(params, {degree: userInfo.degree})
        break
      case 'ownDescribe':
        params = Object.assign(params, {own_describe: userInfo.ownDescribe.trim()})
        funcApi = updateUserDescribeApi
        break
      case 'idealDescribe':
        params = Object.assign(params, {ideal_describe: userInfo.idealDescribe.trim()})
        funcApi = updateUserDescribeApi
        break
      default:
        break
    }
    funcApi(params).then(() => {
      getUserInfo().then(() => {
        let modifiedUserInfo = app.globalData.userInfo.userInfo
        let { userInfo } = this.data
        let { options } = this.data
        let { PAGEPATH } = app.globalData
        if(options.key === 'companyName' && modifiedUserInfo.companyId !== userInfo.companyId) {
          wx.setStorageSync('searchCompany', {
            company_name: userInfo.companyName
          })
          wx.navigateTo({
            url: `${PAGEPATH}/methods/index?type=createUser&companyId=${modifiedUserInfo.companyId}`
          })
        } else {
          wx.navigateBack({ delta: 1 })     
        }
      })      
    }).catch(err => app.wxToast({title: err.msg}))
  },
  onShareAppMessage: function (options) {
    return app.wxShare({options})
  }
})