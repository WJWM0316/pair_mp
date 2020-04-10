import {
  getSugarWalletApi
} from '../../api/sugar'
let app = getApp()
Page({
  data: {
    CDNPATH: app.globalData.CDNPATH,
    pageCount: 20,
    tab: 'obtainData',
    useData: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    },
    obtainData: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    }
  },
  onLoad() {
    let useData = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    }
    let obtainData = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    }
    this.setData({ useData, obtainData}, () => this.getLists())
  },
  getLists() {
    let funcApi = this.data.tab  === 'obtainData' ? 'getObtainData' : 'getUseData'
    return this[funcApi]()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-02-28
   * @detail   获取收藏的职位列表
   * @return   {[type]}   [description]
   */
  getUseData() {
    return new Promise((resolve, reject) => {
      let { useData, pageCount } = this.data
      let params = { count: pageCount, page: useData.pageNum, incrType: 'decr' }
      getSugarWalletApi(params).then(res => {
        let useData = this.data.useData
        useData.onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        useData.list = useData.list.concat(res.data)
        useData.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        useData.pageNum = useData.pageNum + 1
        useData.isRequire = true
        this.setData({ useData }, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-02-28
   * @detail   获取收藏的招聘官列表
   * @return   {[type]}   [description]
   */
  getObtainData() {
    return new Promise((resolve, reject) => {
      let { obtainData, pageCount } = this.data
      let params = { count: pageCount, page: obtainData.pageNum, incrType: 'incr' }
      getSugarWalletApi(params).then(res => {
        obtainData.onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        obtainData.list = obtainData.list.concat(res.data)
        obtainData.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        obtainData.pageNum = obtainData.pageNum + 1
        obtainData.isRequire = true
        this.setData({ obtainData }, () => resolve(res))
      })
    })
  },
  onClickTab(e) {
    let { dataset } = e.currentTarget
    this.setData({tab: dataset.tab }, () => {
      if(!this.data[dataset.tab].isRequire) this.getLists()
    })
  },
  onReachBottom() {
    let data = this.data[this.data.tab]
    if (!data.isLastPage) {
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