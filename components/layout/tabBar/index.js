const app =  getApp();
import {getSelectorQuery} from '../../../utils/util.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {

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
        routerPath: ''
      },
      {
        text: '消息',
        selected: false,
        icon: '',
        selectedIcon: '',
        routerPath: ''
      }
    ]
  },
  attached () {
    getSelectorQuery(".tabBar", this).then(res => {
      app.globalData.tabBarHeight = res.height
      app.globalData.viewAreaHeight = app.globalData.systemInfo.windowHeight - res.height - app.globalData.navBarHeight
      this.triggerEvent('getViewAreaHeight', app.globalData.viewAreaHeight)
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
