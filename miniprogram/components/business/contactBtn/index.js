import {getCurrentPagePath} from '../../../utils/index.js'
const app =  getApp();
Component({
  externalClasses: ['my-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    contactType: String,
    title: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    cardData: {},
    cdnPath: app.globalData.CDNPATH
  },
  options: {
    // 在组件定义时的选项中启用多slot支持
    multipleSlots: true
  },
  attached () {
    let cardData = {}
    switch (this.data.contactType) {
      case 'recharge':
        cardData.title = '获取皮糖'
        cardData.img = `${this.data.cdnPath}chongzhi.png`
        break
      case 'follow':
        cardData.title = '关注公众号'
        cardData.img = `${this.data.cdnPath}img_QR.png`
        break
      case 'invitation':
        cardData.title = '获取邀请码'
        cardData.img = `${this.data.cdnPath}img_invitation code@3x.png.png`
        break
    }
    this.setData({cardData})
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
