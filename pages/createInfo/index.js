Page({
  data: {
    step: 3
  },
  next() {
    let { step } = this.data
    step++
    this.setData({ step })
    console.log(this.data, 'kkk')
  }
})