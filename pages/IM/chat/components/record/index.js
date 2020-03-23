const app =  getApp();
let position = {
  startY: 0,
  move  : 0,
  endY  : 0
}
let recorderManager = null,
    isDeny          = false

Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    tips: ['按住说话', '手指上滑，取消发送', '松开手指，取消发送', '按住说话'],
    status: 0, // 0 开始阶段/录音结束 1 录音中 2 暂停待取消录音 3 取消录音
    seconds: 0,
    recording: false
  },
  attached () {
    if (!app.globalData.recorderManager) app.globalData.recorderManager = wx.getRecorderManager()
    recorderManager = app.globalData.recorderManager
    recorderManager.onStop((e) => {
      if (!this.data.status) {
        console.log(e)
      }
    })
  },
  observers: {
    'status': (status) => {
      switch (status) {
        case 0:
          recorderManager.stop()
          break
        case 1:
          recorderManager.start({
            duration: 60000, 
            sampleRate: 44100, // 采样率
            encodeBitRate: 192000, // 编码码率
            format: 'aac'
          })         
          break
        case 2:
          recorderManager.stop()
          break
      }
    }
  },
  pageLifetimes: {
    show () {
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.record']) {
            isDeny = false
          }
        }
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    wxApiAuthorize (e) {
      let that = this
      if (isDeny) {
        wx.openSetting({})
      } else {
        wx.getSetting({
          success(res) {
            if (!res.authSetting['scope.record']) {
              wx.authorize({
                scope: 'scope.record',
                success () {
                  position.startY = e.changedTouches[0].pageY
                  that.setData({"status": 1})
                  isDeny = false
                },
                fail (err) {
                  isDeny = true
                }
              })
            } else {
              isDeny = false
            }
          }
        })
      }
    },
    hanlderTouchstart (e) {
      position.startY = e.changedTouches[0].pageY
      this.setData({"status": 1})
    },
    hanlderTouchmove (e) {
      let moveY = e.changedTouches[0].pageY
      position.move = position.startY - moveY
      if (position.move >= 40) {
        this.setData({"status": 2})
      }
    },
    hanlderTouchend (e) {
      if (position.move >= 40) {
        this.setData({"status": 3})
      } else {
        this.setData({"status": 0})
      }
    }
  }
})
