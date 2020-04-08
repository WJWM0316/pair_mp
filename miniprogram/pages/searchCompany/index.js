import {
  getCompanyNameListApi
} from '../../api/common.js'

let app = getApp()
let lock = false
Page({
  data: {
    formData: {
      company_name: '',
      is_need_email_verify: 0
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
        let info = nameList.find(v => v.companyName === name.trim())
        nameList.map(field => {
          field.html = field.companyName.replace(new RegExp(name,'g'),`<span style="color: #00C4CD;">${name}</span>`)
          field.html = `<div>${field.html}</div>`
        })
        this.setData({ nameList, info })
      })
    })
  },
  selectCompany(e) {
    let { formData } = this.data
    let { info } = e.currentTarget.dataset
    formData.company_name = info.companyName
    formData.company_id = info.id
    this.setData({canClick: true, formData, nameList: [], info})
  },
  next() {
    let { formData, info } = this.data
    let company_name = formData.company_name.trim()
    if(company_name.length < 2) {
      app.wxToast({title: '公司名称需为2-50个字'})
    } else {
      if(info) {
        formData.is_need_email_verify = 1
        formData.company_id = info.id
      }
      formData.company_name = company_name
      wx.setStorageSync('searchCompany', formData)
      wx.navigateBack({ delta: 1 })
    }    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    return app.wxShare({options})
  }
})