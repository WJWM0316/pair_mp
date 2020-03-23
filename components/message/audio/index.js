const app =  getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    message: Object,
    own: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    playing: false
  },

  attached () {
    const that = this
    if (!app.globalData.InnerAudioContext) app.globalData.InnerAudioContext = wx.createInnerAudioContext()
    let InnerAudioContext = app.globalData.InnerAudioContext
    // 为了填坑，在开发工具上onTimeUpdate回调正常，不要删除
    InnerAudioContext.onCanplay(function (e) {
      if (that.curItem()) {
        console.log('勿删', InnerAudioContext.duration)
      }
    })
    // 播放过程
    InnerAudioContext.onTimeUpdate((e) => {
      if (that.curItem()) {
        console.log('监听当前的音乐————播放中')
        if (!that.playing) that.setData({'playing': true})
      } else {
        if (that.playing) that.setData({'playing': false})
      }
    })
    // 监听暂停
    InnerAudioContext.onStop((e) => {
      if (that.curItem()) {
        console.log('监听当前的音乐————停止了')
        if (that.playing) that.setData({'playing': false})
      }
    })
    // 监听暂停
    InnerAudioContext.onEnded((e) => {
      if (that.curItem()) {
        if (that.playing) that.setData({'playing': false})
        console.log('监听当前的音乐————结束了')
      }
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    curItem () {
      return app.globalData.InnerAudioContext && app.globalData.InnerAudioContext.src === this.data.message.file
    },
    play () {
      let InnerAudioContext = app.globalData.InnerAudioContext
      if (!InnerAudioContext.src) InnerAudioContext.src = this.data.message.file
      if (InnerAudioContext.src === this.data.message.file) {
        InnerAudioContext.paused ? InnerAudioContext.play() : InnerAudioContext.stop()
      } else {
        InnerAudioContext.src = this.data.message.file
        InnerAudioContext.play()
      }
    }
  }
})
