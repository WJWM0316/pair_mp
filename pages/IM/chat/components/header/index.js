// pages/IM/chat/components/header/index.js
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    detail: {
      type: Object,
      value: {
        messageId: "messageId0",
        timestamp: '1585033928',
        path: 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/d03e7897d4ee5c55ad392292ffd88bf.jpg',
        data: {
          type: 'text',
          text: '测'
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    putUp: true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    catchtap () {
      return
    },
    toggle () {
      let putUp = this.data.putUp
      this.setData({'putUp': !putUp})
    }
  }
})
