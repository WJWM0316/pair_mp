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
    awardPopData: [
      {
        sugarNum: 1,
        text: '签到成功'
      }
    ],
    wallet: {
      amount: 0,
      id: 0,
      remain: 0,
      topUpAmount: 0,
      topUpTimes: 0,
      uid: 0,
      vkey: "rypbaeb3",
      todaySigned: true
    }
  },
  onShow() {
    this.getCurrentWeekSignIn()
    getSugarInfoApi().then(({data}) => this.setData({wallet: data.wallet}))
  },
  getRurrentDate() {
    let date = new Date();
    let month = date.getMonth() + 1 < 10 ? "0"+(date.getMonth() + 1):date.getMonth() + 1;
    let strDate = date.getDate() <10 ? "0" + date.getDate():date.getDate();
    return date.getFullYear() + '-'  + month  + '-'  + strDate;
  },
  getCurrentWeekSignIn() {
    getCurrentWeekSignInApi().then(({ data }) => {
      let signIndex = data.list.map(v => v.weekDateIndex)
      let dateArr = data.list.map(v => v.date) || []
      let currentDate = this.getRurrentDate()
      data.configList.map((v, i) => {
        v.hasSign = false
        if(signIndex.includes(i+1)) {
          v.hasSign = true
        }
      })
      this.setData({ weekSignConfig: data, todaySigned: dateArr.includes(currentDate)})
    })
  },
  viewBill() {
    let { PAGEPATH } = app.globalData
    wx.navigateTo({
      url: `${PAGEPATH}/bill/index`
    })
  },
  sign() {
    userSignApi().then(() => {
      this.selectComponent('#awardPopUp').show()
      this.getCurrentWeekSignIn()
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    return app.wxShare({options})
  }
})