Page({
  data: {
    canClick: false,
    email: ''
  },
  bindInput(e) {
    let { value } = e.detail
    if(value !== this.data.email) {
      this.setData({email: value.trim()})
    }
  }
})