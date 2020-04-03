import {getCurrentPagePath} from '../../../utils/index.js'
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
    sessionFrom: ''
  },
  options: {
    // 在组件定义时的选项中启用多slot支持
    multipleSlots: true
  },
  attached () {
    let sessionFrom = {}
    switch (this.data.contactType) {
      case 'recharge':
        sessionFrom = {
          token: wx.getStorageSync('token'),
          type: 'recharge',
          title: '充值',
          path: getCurrentPagePath()
        }
        sessionFrom = JSON.stringify(sessionFrom)
        break
    }
    this.setData({sessionFrom})
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
