import { getSquareListApi } from "../../api/square.js"

const app = getApp()
Page({
  data: {
    userInfo: {},
    CDNPATH: app.globalData.CDNPATH,
    userData: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    }
  },
  onLoad(options) {

  },
  onReady() {

  },
  onShow() {
    let userData = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    }
    let callback = () => {
      this.getUserList()
      this.setData({'userInfo': app.globalData.userInfo, userData})
    }
    if (app.globalData.userInfo) {
      callback()
    } else {
      app.getUserInfo = () => {
        callback()
      }
    }
  },
  getUserList() {
    return new Promise((resolve, reject) => {
      let { userData } = this.data
      let params = { count: 3, page: userData.pageNum }
      getSquareListApi(params).then(res => {
        let list = res.data
        list.map(v => {
          v.birthDesc = `${v.birth.slice(2,4)}年`
          v.heightDesc = `${v.height}CM`
        })
        userData.list = userData.list.concat(list)
        userData.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        userData.pageNum++
        userData.isRequire = true
        this.setData({ userData }, () => resolve(res))
      })
    })
  },
  onReachBottom() {
    const userData = this.data.userData
    if (!userData.isLastPage) {
      this.getUserList()
    }
  }
})