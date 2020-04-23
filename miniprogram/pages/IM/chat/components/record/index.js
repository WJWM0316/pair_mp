const app =  getApp();
let position = {
  startY: 0,
  move  : 0,
  endY  : 0
}
let recorderManager = null,
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
    tips: ['按住说话', '手指上滑，取消发送', '松开手指，取消发送', '按住说话', '按住说话，继续录音'],
    status: 0, // 0 开始阶段 1 录音中 2 暂停待取消录音 3 录音结束发送录音 4 暂停录音重新录音
    seconds: 0,
    recording: false
  },
  attached () {
    if (!app.globalData.recorderManager) app.globalData.recorderManager = wx.getRecorderManager()
    recorderManager = app.globalData.recorderManager
    recorderManager.onStop((e) => {
      if (this.data.status === 3) {
        if (e.duration >= 1000) {
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
          clearInterval(timer)
          break
        case 1:
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
          recorderManager.pause()
          break
        case 3:
          // 停止录音 发送录音
          recorderManager.stop()
          break
        case 4:
          // 暂停之后重新录音
          recorderManager.resume()
          break
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    limitedDur () {
      clearInterval(timer)
      let seconds = !this.data.seconds ? 1 : this.data.seconds
      this.setData({seconds})
      timer = setInterval(() => {
        seconds++
        if (seconds > 60) {
          clearInterval(timer)
          this.setData({"status": 3})
          seconds = 0
        }
        this.setData({seconds})
      }, 1000);
    },
    hanlderTouchstart (e) {
      this.setData({"status": 0})
      position.startY = e.changedTouches[0].pageY
      this.setData({"status": 1}, () => {
        this.limitedDur()
      }) 
    },
    hanlderTouchmove (e) {
      let moveY = e.changedTouches[0].pageY
      position.move = position.startY - moveY
      if (position.move >= 50) {
        if (this.data.status !== 2) {
          this.setData({"status": 2})
          clearInterval(timer)
        }
      } else {
        if (this.data.status === 2) {
          this.setData({"status": 4})
          this.limitedDur()
        }
      }
    },
    hanlderTouchend (e) {
      if (position.move <= 50) {
        this.setData({"status": 3})
        clearInterval(timer)
        this.setData({'seconds': 0})
      } else {
        if (this.data.status === 2) {
          this.setData({"status": 0, 'seconds': 0})
        }
      }
      clearTimeout(timer)
    }
  }
})
