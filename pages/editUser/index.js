import {
  updateUserBaseApi,
  updateUserSalaryApi,
  updateUserDescribeApi
} from '../../api/user.js'
let app = getApp()
Page({
  data: {
    options: {},
    userInfo: {},
    careerVerifyInfo: {},
    pickIntention: {}
  },
  onLoad(options) {
    this.setData({ options })
    console.log(options)
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
    console.log({ userInfo, careerVerifyInfo, pickIntention })
  },
  bindInput(e) {
    let { userInfo } = this.data
    let { key } = e.currentTarget.dataset
    let { value } = e.detail
    if(userInfo[key] !== value) {
      userInfo[key] = value
      this.setData({ userInfo })
    }
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