import {
  wxToast
} from '../../../../utils/func.js'

import {
  getSelectorQuery
} from '../../../../utils/util.js'

import {list} from './data'
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
    list,
    navTabIndex: 0,
    moveParams: {
      scrollLeft: 0
    },
    scrollLeft: 0,
    scrollTop: 0
  },
  methods: {
    scroll(e) {
      let { scrollTop } = e.detail
      console.log(scrollTop)
    },
    scrollViewMove() {},
    tabClick(e) {
      let { dom } = e.currentTarget.dataset
      getSelectorQuery(dom, this).then(res => {
        let { top } = res
        this.setData({scrollTop: top - (296/2)})
        console.log(res, dom)
      })
    }
  }
})
