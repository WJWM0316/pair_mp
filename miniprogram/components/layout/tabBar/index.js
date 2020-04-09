const app =  getApp();
import {getSelectorQuery, } from '../../../utils/util.js'
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
        icon: 'tab_square@3x.png',
        selectedIcon: 'tab_square_pre@3x.png',
        routerPath: 'pages/square/index'
      },
      {
        text: 'Pick',
        selected: false,
        icon: 'tab_pick@3x.png',
        selectedIcon: 'tab_pick_pre@3x.png',
        routerPath: 'pages/index/index'
      },
      {
        text: '消息',
        selected: false,
        icon: 'tab_message@3x.png',
        selectedIcon: 'tab_message_pre@3x.png',
        routerPath: 'pages/IM/list/index'
      }
    ],
    cdnPath: app.globalData.CDNPATH
  },
  attached () {
    let route = getCurrentPages()
    route = route[route.length - 1].route
    let list  = this.data.list
    list.map(field => field.selected = field.routerPath === route ? true : false)
    this.setData({list})
  },
  /**
   * 组件的方法列表
   */
  methods: {
    jump (e) {
      if (e.currentTarget.dataset.selected) return
      let route = e.currentTarget.dataset.route
      wx.reLaunch({url: '/' + route})
    }
  }
})
