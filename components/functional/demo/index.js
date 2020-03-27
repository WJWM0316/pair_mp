let app = getApp()
import {
    getSelectorQuery
} from '../../../utils/util.js'
Component({
  externalClasses: ['sol-class'],
  data: {
      showNavDrap: false,
      activeIndex: 0,
      navScrollLeft: 0,
      systemInfo: app.globalData.systemInfo,
      itemLength: 125,
      timer: null
  },
  pageLifetimes: {
    show() {
      let tabs = []
      for(let i = 100; i <= 200; i++) {
          tabs.push({
              key: i,
              value: i,
              ative: false,
              startX: 0,
              endX: 0
          })
      }
      this.setData({tabs}, () => {
        getSelectorQuery('.label-scoll', this).then(res => {
            let { screenWidth } = this.data.systemInfo
            let itemLength = parseInt(screenWidth / 3)
            tabs.map((v, i) => {
                v.startX = itemLength * (i + 1)
            })
            this.setData({ tabs, itemLength })
        })
      })
    }
  },
  methods: {
      scroll(e) {
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(function() {
            let { scrollLeft } = e.detail
            let { tabs } = this.data
            tabs = tabs.filter(v => v.startX > scrollLeft)
            let navScrollLeft = tabs[0].startX
            this.setData({ navScrollLeft }, () => clearTimeout(this.timer))
        }.bind(this), 500)
      }
  }
})