const app =  getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    message: Object
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  attached () {
    if (!app.globalData.InnerAudioContext) app.globalData.InnerAudioContext = wx.createInnerAudioContext()
    let InnerAudioContext = app.globalData.InnerAudioContext,
        curItem           = InnerAudioContext.src === this.data.message.file
    // 为了填坑，在开发工具上onTimeUpdate回调正常，不要删除
    InnerAudioContext.onCanplay(function (e) {
      if (curItem) {
        console.log('勿删', InnerAudioContext.duration)
      }
    })
    // 播放过程
    InnerAudioContext.onTimeUpdate((e) => {
      if (curItem) {
        console.log('监听当前的音乐————播放中')
      }
    })
    // 监听暂停
    InnerAudioContext.onStop((e) => {
      if (curItem) {
        console.log('监听当前的音乐————停止了')
      }
    })
    // 监听暂停
    InnerAudioContext.onEnded((e) => {
      if (curItem) {
        console.log('监听当前的音乐————结束了')
      }
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    play () {
      console.log(this.data.message.file, 11111111111)
      let InnerAudioContext = app.globalData.InnerAudioContext
      if (!InnerAudioContext.src) InnerAudioContext.src = this.data.message.file
      if (InnerAudioContext.src === this.data.message.file) {
        console.log(InnerAudioContext.paused, 111111111111)
        InnerAudioContext.paused ? InnerAudioContext.play() : InnerAudioContext.stop()
      } else {
        InnerAudioContext.src = this.data.message.file
        InnerAudioContext.play()
      }
    }
  }
})
