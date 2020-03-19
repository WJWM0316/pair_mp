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
    paused: true
  },
  attached () {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    play (e) {
      this.setData({'paused': false}, () => {
        app.globalData.VideoContext = wx.createVideoContext(String(this.data.message.id), this)
        let VideoContext = app.globalData.VideoContext
        VideoContext.play()
        VideoContext.requestFullScreen({direction: 0})
      })
    },
    changeFullScreen (e) {
      
      if (!e.detail.fullScreen) {
        console.log('退出全屏，关闭视频')
        app.globalData.VideoContext.pause()
        app.globalData.VideoContext.stop()
        this.setData({'paused': true})
      }
    }
  }
})
