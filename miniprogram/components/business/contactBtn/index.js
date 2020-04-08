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
    sessionFrom: '',
    pagePath: ''
  },
  options: {
    // 在组件定义时的选项中启用多slot支持
    multipleSlots: true
  },
  attached () {
    let sessionFrom = {},
        pagePath    = ''
    switch (this.data.contactType) {
      case 'recharge':
        let token = wx.getStorageSync('token')
        pagePath = getCurrentPagePath()
        sessionFrom = {
          token,
          type: 'recharge',
          title: '充值',
          path: pagePath
        }
        pagePath = pagePath.indexof('?') !== -1 ? `${pagePath}&token=${token}` : `${pagePath}?token=${token}`
        sessionFrom = JSON.stringify(sessionFrom)
        break
    }
    this.setData({sessionFrom, pagePath})
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
