const app =  getApp();
let position = {
  startY: 0,
  move  : 0,
  endY  : 0
}
let hasAuth         = false,
    recorderManager = null,
    isDeny          = false,  
    startTime       = 0,
    endTime         = 0,
    seconds         = 0,
    timer           = null // 录音的定时器
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
    status: 0, // 0 开始阶段 1 录音中 2 暂停待取消录音 3 录音结束发送录音
    seconds: 0,
    recording: false
  },
  attached () {
    if (!app.globalData.recorderManager) app.globalData.recorderManager = wx.getRecorderManager()
    recorderManager = app.globalData.recorderManager
    recorderManager.onStop((e) => {
      if (this.data.status === 3) {
        if (endTime - startTime > 1000) {
          this.triggerEvent('getRecord', e)
        } else {
          app.wxToast({title: '语音时长不可低于1秒'})
        }
      }
    })
  },
  observers: {
    'status': (status) => {
      switch (status) {
        case 0:
          recorderManager.stop()
          startTime = 0
          endTime   = 0
          break
        case 1:
          startTime = new Date().getTime()
          recorderManager.start({
            duration: 60000,
            numberOfChannels: 1,
            sampleRate: 44100, // 采样率
            encodeBitRate: 192000, // 编码码率
            format: 'wav'
          })
          break
        case 2:
          // 暂停待取消录音
          recorderManager.stop()
          break
        case 3:
          // 停止录音 发送录音
          endTime = new Date().getTime() 
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
            hasAuth = true
          } else {
            hasAuth = false
          }
        }
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    limitedDur () {
      clearInterval(timer)
      seconds = 0
      timer = setInterval(() => {
        seconds++
        if (seconds >= 5) {
          clearInterval(timer)
          this.setData({"status": 3})
          seconds = 0
        }
        this.setData({seconds})
      }, 1000);
    },
    wxApiAuthorize (e) {
      let that = this
      if (!hasAuth) {
        if (isDeny) {
          app.globalData.lockonShow = true
          wx.openSetting()
        } else {
          wx.getSetting({
            success(res) {
              if (!res.authSetting['scope.record']) {
                wx.authorize({
                  scope: 'scope.record',
                  success () {
                    hasAuth = true
                    isDeny = false
                  },
                  fail (err) {
                    hasAuth = false
                    isDeny = true
                  }
                })
              } else {
                hasAuth = true
              }
            }
          })
        }
      }
    },
    hanlderTouchstart (e) {
      if (!hasAuth) return
      this.setData({"status": 0})
      position.startY = e.changedTouches[0].pageY
      this.setData({"status": 1}, () => {
        this.limitedDur()
      }) 
    },
    hanlderTouchmove (e) {
      if (!hasAuth) return
      let moveY = e.changedTouches[0].pageY
      position.move = position.startY - moveY
      if (position.move >= 40) {
        this.setData({"status": 2})
      }
    },
    hanlderTouchend (e) {
      if (!hasAuth) return
      if (position.move <= 50) {
        this.setData({"status": 3})
        clearInterval(timer)
      } else {
        this.setData({"status": 0})
      }
    }
  }
})
