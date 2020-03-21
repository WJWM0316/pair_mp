// pages/IM/chat/components/record/index.js
let position = {
  startY: 0,
  moveY : 0,
  endY  : 0
}

Component({
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
    status: 0, // 0 开始阶段 1 录音中 2 待取消录音 3 取消录音
    seconds: 0,
    recording: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hanlderTouchstart (e) {
      position.startY = e.changedTouches[0].pageY
      this.setData({"status": 1})
    },
    hanlderTouchmove (e) {
      position.moveY = e.changedTouches[0].pageY
      console.log(position.moveY)
      if (position.startY - position.moveY >= 40) {
        this.setData({"status": 2})
      }
    },
    hanlderTouchend (e) {
      if (position.startY - position.moveY >= 40) {
        this.setData({"status": 3})
      } else {
        this.setData({"status": 0})
      }
    }
  }
})
