Component({
  properties: {
    canClick: {
      type: Boolean,
      value: false
    },
    btnTxt: {
      type: String,
      value: '下一步'
    }
  },
  data: {

  },
  methods: {
    next() {
      this.triggerEvent('click');
    }
  }
})
