const app = getApp()
Component({
  properties: {

  },
  data: {
    formData: {
      company_name: '',
      position_name: ''
    },
    status: 1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    legalize() {
      let { PAGEPATH } = app.globalData
      wx.navigateTo({
        url: `${PAGEPATH}/perfect/index`
      })
    }
  }
})
