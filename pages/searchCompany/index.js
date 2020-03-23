import {
  getCompanyNameListApi
} from '../../api/common.js'

let app = getApp()
let lock = false
Page({
  data: {
    formData: {
      company_name: '',
      is_need_email_verify: false
    },
    canClick: false,
    nameList: [],
    info: {}
  },
  debounce(fn, context, delay, text) {
    clearTimeout(fn.timeoutId)
    fn.timeoutId = setTimeout(() => fn.call(context, text), delay)
  },
  onLoad() {
    let searchCompany = wx.getStorageSync('searchCompany')
    let formData = this.data.formData
    let canClick = this.data.canClick
    canClick = searchCompany.company_name ? true : false
    formData.company_name = searchCompany.company_name
    this.setData({formData, canClick})
    setTimeout(() => wx.removeStorageSync('searchCompany'), 16.7)
  },
  bindInput(e) {
    let name = e.detail.value
    this.debounce(this.getCompanyNameList, null, 300, name)
  },
  getCompanyNameList(name) {
    let formData = this.data.formData
    formData.company_name = name
    this.setData({formData, canClick: true}, () => {
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
    let { formData } = this.data
    let { info } = e.currentTarget.dataset
    formData.company_name = info.companyName
    this.setData({canClick: true, formData, nameList: [], info})
  },
  submit() {
    if(!this.data.canClick) return;
    let { formData } = this.data
    let company_name = formData.company_name.trim()
    if(company_name.length < 2) {
      app.wxToast({title: '公司名称需为2-50个字'})
    } else {
      if(formData.company_name === company_name) {
        formData.is_need_email_verify = 1
      }
      formData.company_name = company_name
      console.log(formData)
      wx.setStorageSync('searchCompany', formData)
      wx.navigateBack({delta: 1})
    }    
  }
})