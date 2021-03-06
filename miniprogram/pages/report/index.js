import {
  reportApi,
  getReportListApi
} from '../../api/report'
const app =  getApp();
Page({
  data: {
    list: [],
    body: '',
    reason: [],
    title: '',
    options: {}
  },
  onLoad(options) {
    this.setData({ options })
    getReportListApi().then(({data}) => {
      data.map(v => v.active = false)
      this.setData({reason: data})
    })
  },
  // onShow() {
  //   getReportListApi().then(({data}) => {
  //     data.map(v => v.active = false)
  //     this.setData({reason: data})
  //   })
  // },
  upload() {
    app.chooseImageUpload().then(({ data }) => {
      let { list } = this.data
      list.push(data.attachListItem[0])
      this.setData({ list })
    })
  },
  remove(e) {
    let { dataset } = e.currentTarget
    let { list } = this.data
    list.splice(dataset.index, 1)
    this.setData({ list })
  },
  check(e) {
    let { reason } = this.data
    let { item } = e.currentTarget.dataset
    reason.map(v => {
      v.active = false
      if(v.id === item.id) {
        v.active = true
      }
    })
    this.setData({ title:  item.name, reason})
  },
  bindInput(e) {
    this.setData({body: e.detail.value})
  },
  submit() {
    let { options } = this.data
    let imgIds = this.data.list.map(v => v.id)
    let params = {
      body: this.data.body,
      title: this.data.title,
      img_id: imgIds.join(','),
      vkey: options.vkey
    }
    if(!params.title) {
      app.wxToast({title: '请选择举报类型'})
      return
    }
    if(!params.img_id) {
      app.wxToast({title: '请上传图片'})
      return
    }
    reportApi(params).then(() => {
      app.wxToast({
        title: '成功提交，审核人员将核实并处理该举报内容',
        callback() {
          wx.navigateBack({delta: 1 })
        }
      })
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    return app.wxShare({options})
  }
})