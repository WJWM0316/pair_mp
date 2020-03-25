Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer (newVal, oldVal) {
        this.setData({show: newVal}, () => {
          this.setData({showPop: this.data.show})
        })
      }
    },
    itemList: {
      type: Array,
      default: []
    }
  },
  methods: {
    stopPageScroll () {
      return false
    },
    close () {
      this.setData({show: false}, () => this.triggerEvent('close'))
    },
    todoAction(e) {
      let { itemList } = this.data
      let { index } = e.currentTarget.dataset
      let result = itemList.find((v, i) => i === index)
      this.setData({show: false}, () => this.triggerEvent('close'))
      this.triggerEvent('drawerAction', result)
    }
  }
})
