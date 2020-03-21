Page({
  data: {
    step: 2
  },
  next() {
    let { step } = this.data
    step++
    this.setData({ step })
  }
})