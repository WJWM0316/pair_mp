import {
  wxToast
} from '../../../../utils/wxApi.js'

import {
  getSelectorQuery
} from '../../../../utils/util.js'

import {list} from './data'

Component({
  properties: {

  },
  data: {
    list,
    navTabIndex: 0,
    moveParams: {
      scrollLeft: 0
    },
    scrollLeft: 0,
    scrollTop: 0
  },
  pageLifetimes: {
    onPageScroll(e) {
      console.log(e, 'kkkk')
    }
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
        // console.log(res, dom)
      })
    }
  }
})
