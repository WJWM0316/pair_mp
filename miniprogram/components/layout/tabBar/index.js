const app =  getApp();
import {getSelectorQuery, socket} from '../../../utils/index.js'
import {unreadNumApi} from '../../../api/im.js'
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
    },
    page: {
      type: String,
      value: ''
    },
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
    cdnPath: app.globalData.CDNPATH,
    unreadNum: 0
  },
  attached () {
    let route = getCurrentPages()
    route = route[route.length - 1].route
    let list  = this.data.list
    list.map(field => field.selected = field.routerPath === route ? true : false)
    this.setData({list})
    if (!app.globalData.hasLogin) return
    if (!this.hasAttached) {
      this.hasAttached = true
      this.getUnreadNum()
    }
    if (!this.data.page) {
      socket.onMessage((res) => {
        if ((res.msgType === "RC:VcMsg" || res.msgType === "RC:ImgMsg" || res.msgType === "RC:TxtMsg")) {
          if (this.data.unreadNum < 99) {
            let unreadNum = this.data.unreadNum
            unreadNum++
            this.setData({unreadNum})
          }
        }
      })
    }
  },
  pageLifetimes: {
    show: function() {
      if (!app.globalData.lockonShow) {
        app.globalData.lockonShow = false
        if (this.hasAttached && app.globalData.hasLogin) {
          this.getUnreadNum()
        }
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    add () {
      if (this.data.unreadNum < 99) {
        let unreadNum = this.data.unreadNum
        unreadNum++
        this.setData({unreadNum})
      }
    },
    async getUnreadNum () {
      let {data} = await unreadNumApi({hideLoading: true})
      this.setData({unreadNum: data.count})
    },
    jump (e) {
      if (e.currentTarget.dataset.selected) return
      let route = e.currentTarget.dataset.route
      wx.reLaunch({url: '/' + route})
      switch (route) {
        case 'pages/square/index':
          app.wxReportAnalytics('button_click_event', {
            button_id: 'square_tab',
            button_name: '广场_tab点击次数'
          })
          break
        case 'pages/index/index':
          app.wxReportAnalytics('button_click_event', {
            button_id: 'Pick_tab',
            button_name: 'Pick_tab点击次数'
          })
          break
        case 'pages/IM/list/index':
          app.wxReportAnalytics('button_click_event', {
            button_id: 'information_tab',
            button_name: '消息_tab点击次数'
          })
          break
      }
    }
  }
})
