import {
  createUserStep3Api
} from '../../../../api/user'
const app = getApp()
Component({
  properties: {

  },
  data: {
    formData: {
      company_name: '',
      position_name: '',
      occupation: '',
      occupationDesc: ''
    },
    status: 1,
    canClick: false
  },
  ready() {
    console.log(app)
    console.log(app.globalData)
  },
  methods: {
    getPickerData(e) {
      let { formData } = this.data
      formData.occupationDesc = e.detail.name
      formData.occupation = e.detail.labelId
      this.setData({ formData, canClick: true })
    },
    legalize() {
      let { PAGEPATH } = app.globalData
      wx.navigateTo({
        url: `${PAGEPATH}/methods/index`
      })
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
    next() {
      let { formData } = this.data
      let params = {
        occupation: formData.occupation
      }
      if(formData.company_name) {
        params = Object.assign(params, {company_name: formData.company_name})
      }
      if(formData.position_name) {
        params = Object.assign(params, {position_name: formData.position_name})
      }
      createUserStep3Api(params).then(() => {
        let { PAGEPATH } = app.globalData
        wx.navigateTo({
          url: `${PAGEPATH}/index`
        })
      }).catch(err => app.wxToast({title: err.msg}))
    }
  }
})
