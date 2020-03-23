Page({
  data: {
    step: 1
  },
  next() {
    let { step } = this.data
    step++
    this.setData({ step })
  }
})