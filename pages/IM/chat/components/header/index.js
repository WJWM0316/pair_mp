const app =  getApp();
import {getSelectorQuery} from '../../../../../utils/util.js'
Component({
  externalClasses: ['my-class'],
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
    headerH: 0,
    tips: true,
    pxTorpxRatio: app.globalData.systemInfo.pxTorpxRatio
  },
  attached () {
    this.getHeight()
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
      this.getHeight()
    },
    getHeight () {
      wx.nextTick(()=>{
        getSelectorQuery('.header', this).then(res => {
          this.setData({'headerH': res.height})
          console.log(res.height, 22)
        })
      });
    }
  }
})
