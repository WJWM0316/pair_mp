import {
  getBackListApi,
  removeBackApi
} from '../../api/black.js'
const app = getApp()

Page({
  data: {
    pageCount: 20,
    CDNPATH: app.globalData.CDNPATH,
    backList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    }
  },
  onShow() {
    let backList = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    }
    this.setData({backList}, () => this.getLists())
  },
  getLists() {
    return new Promise((resolve, reject) => {
      let { backList, pageCount } = this.data
      let params = { count: pageCount, page: backList.pageNum }
      getBackListApi(params).then(res => {
        backList.onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        backList.list = backList.list.concat(res.data)
        backList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        backList.pageNum = backList.pageNum + 1
        backList.isRequire = true
        this.setData({ backList }, () => resolve(res))
      })
    })
  },
  removeBack(e) {
    let  { dataset } = e.currentTarget
    let that = this
    removeBackApi({vkey: dataset.vkey}).then(() => {
      app.wxToast({
        title: '删除成功',
        callback() {
          let { backList } = that.data
          backList.list.splice(dataset.index, 1)
          that.setData({backList})
        }
      })
    })
  },
  onReachBottom() {
    if (!this.data.backList.isLastPage) {
      this.getLists()
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    return app.wxShare({options})
  }
})