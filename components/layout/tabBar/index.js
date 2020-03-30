const app =  getApp();
import {getSelectorQuery} from '../../../utils/util.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabBgColor: {
      type: String,
      value: '#fff'
    },
    mask: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [
      {
        text: '广场',
        selected: false,
        icon: '',
        selectedIcon: '',
        routerPath: ''
      },
      {
        text: 'pick',
        selected: false,
        icon: '',
        selectedIcon: '',
        routerPath: '/pages/index/index'
      },
      {
        text: '消息',
        selected: false,
        icon: '',
        selectedIcon: '',
        routerPath: '/pages/IM/list/index'
      }
    ]
  },
  ready () {
    if (!app.globalData.tabBarHeight) {
      getSelectorQuery(".block", this).then(res => {
        app.globalData.tabBarHeight = res.height
        app.globalData.viewAreaHeight = app.globalData.systemInfo.windowHeight - res.height - app.globalData.navBarHeight
        if (app.getTabHInit) {
          app.getTabHInit()
          app.getTabHInit = null
        }
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    jump (e) {
      console.log(e, 11)
      let route = e.currentTarget.dataset.route
      wx.reLaunch({url: route})
    }
  }
})
