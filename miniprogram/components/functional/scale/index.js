let app = getApp()
import {
    getSelectorQuery
} from '../../../utils/util.js'
Component({
  properties: {
    initValue: {
      type: String,
      value: '170'
    }
  },
  data: {
      showNavDrap: false,
      activeIndex: 0,
      navScrollLeft: 0,
      timer: null
  },
  ready() {
  let tabs = []
    for(let i = 100; i <= 300; i++) {
      tabs.push({
        key: i,
        value: String(i),
        active: false,
        startX: 0,
        endX: 0
      })
    }
    this.setData({ tabs }, () => {
      getSelectorQuery('.myscale', this).then(res => {
        console.log(res.width)
        let itemLength = parseInt(res.width / 3)
        tabs.map((v, i) => {
          v.startX = itemLength * i
        })
        this.setData({ tabs }, () => {
          let { navScrollLeft, initValue } = this.data
          if(initValue) {
            tabs.map(v => {
              v.active = false
              if(v.value == initValue) {
                v.active = true
                navScrollLeft = v.startX
                this.setData({ navScrollLeft, tabs })
              }
            })
          } else {
            tabs[0].active = true
            navScrollLeft = tabs[0].startX
            this.setData({ navScrollLeft, tabs })
          }
        })
      })
    })
  },
  methods: {
    closest(arr, num) {
      var left = 0;
      var right = arr.length - 1;

      while(left <= right){
        var middle = Math.floor((right + left) / 2);
        if(right - left <= 1){
          break;
        }
        var val = arr[middle];
        if(val === num){
          return middle;
        }
        else if(val > num){
          right = middle;
        }
        else{
          left = middle;
        }
      }

      var leftValue = arr[left];
      var rightValue = arr[right];
      return rightValue - num > num - leftValue ? leftValue : rightValue;
    },
    scroll(e) {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      let { scrollLeft } = e.detail
      let { tabs } = this.data
      let array = tabs.map(v => v.startX)
      this.timer = setTimeout(() => {
        let moveTo = this.closest(array, scrollLeft)
        let navScrollLeft = moveTo
        if(array.includes(moveTo) && scrollLeft !== moveTo) {
          let item = null
          tabs.map(v => {
            v.active = false
            if(v.startX == moveTo) {
              item = v
              v.active = true
            }
          })
          this.setData({ navScrollLeft, tabs }, () => this.triggerEvent('resultEvent', item))
        }
      }, 50)
    }
  }
})