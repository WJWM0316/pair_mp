const app =  getApp();
let timer = null
let emailReg = /^([a-zA-Z0-9]+[_|\_|\.|\-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,8}$/
Page({
  data: {
    canClick: false,
    email: '',
    time: 60,
    editable: false
  },
  bindInput(e) {
    let { value } = e.detail
    if(value !== this.data.email) {
      this.setData({email: value.trim()})
    }
  },
  isEmail() {
    app.wxToast({title: '请输入正确的邮箱地址'})
    return emailReg.test(this.data.email)
  },
  sendEmail() {
    if(!this.isEmail()) return
    this.killTime()
  },
  editEmail() {
    this.setData({editable: false})
  },
  killTime() {
    let time = this.data.time
    this.setData({editable: true})
    timer = setInterval(() => {
      time--
      if(time < 1) {
        clearInterval(timer)
        this.setData({canResend: true, time: 60})
      } else {
        this.setData({time, canResend: false})
      }
    }, 1000)
  },
})