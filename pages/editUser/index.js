import {
  updateUserBaseApi,
  updateUserSalaryApi,
  updateUserDescribeApi
} from '../../api/user.js'
import {
  getCompanyNameListApi
} from '../../api/common.js'
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
    let { userInfo } = this.data
    wx.setStorageSync('searchCompany', {
      company_name: userInfo.companyName
    })
    wx.navigateTo({
      url: `${PAGEPATH}/methods/index?companyId=${userInfo.companyId ? userInfo.companyId : ''}`
    })
  },
  onShow() {
    let { options } = this.data
    let title = ''
    let { userInfo, careerVerifyInfo, pickIntention } = wx.getStorageSync('user')
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
      default:
        break
    }
    wx.setNavigationBarTitle({title})
    if(!Object.keys(careerVerifyInfo).length) {
      careerVerifyInfo = Object.assign(careerVerifyInfo, { status: -1})
    }
    this.setData({ userInfo, careerVerifyInfo, pickIntention }, () => wx.removeStorageSync('user'))
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
    this.setData({userInfo, nameList: []})
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
        params = Object.assign(params, {company_name: userInfo.companyName})
        break
      case 'positionName':
        params = Object.assign(params, {position_name: userInfo.positionName})
        break
      case 'salary':
        params = Object.assign(params, {salary: userInfo.salary})
        funcApi = updateUserSalaryApi
        break
      case 'school':
        params = Object.assign(params, {school: userInfo.school})
        break
      case 'degree':
        params = Object.assign(params, {degree: userInfo.degree})
        break
      case 'ownDescribe':
        params = Object.assign(params, {own_describe: userInfo.ownDescribe})
        funcApi = updateUserDescribeApi
        break
      case 'idealDescribe':
        params = Object.assign(params, {ideal_describe: userInfo.idealDescribe})
        funcApi = updateUserDescribeApi
        break
      default:
        break
    }
    funcApi(params).then(() => {
      wx.navigateBack({ delta: 1 })
    }).catch(err => app.wxToast({title: err.msg}))
  }
})