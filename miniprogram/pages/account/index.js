import {
  getSugarWalletApi,
  getSugarInfoApi
} from '../../api/sugar'
import {
  userSignApi,
  getCurrentWeekSignInApi
} from '../../api/user'
const app = getApp()
Page({
  data: {
    CDNPATH: app.globalData.CDNPATH,
    weekSignConfig: {},
    wallet: {
      amount: 0,
      id: 0,
      remain: 0,
      topUpAmount: 0,
      topUpTimes: 0,
      uid: 0,
      vkey: "rypbaeb3",
    }
  },
  onShow() {
    this.getCurrentWeekSignIn()
    getSugarInfoApi().then(({data}) => {
      this.setData({wallet: data.wallet})
      console.log(data)
    })
  },
  getCurrentWeekSignIn() {
    getCurrentWeekSignInApi().then(({ data }) => {
      let signIndex = data.list.map(v => v.weekDateIndex)
      data.configList.map((v, i) => {
        v.hasSign = false
        if(signIndex.includes(i+1)) {
          v.hasSign = true
        }
      })
      this.setData({ weekSignConfig: data})
    })
  },
  viewBill() {
    let { PAGEPATH } = app.globalData
    wx.navigateTo({
      url: `${PAGEPATH}/bill/index`
    })
  },
  sign() {
    userSignApi().then(() => this.getCurrentWeekSignIn())
  }
})