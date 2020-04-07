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
    othersUserInfo: Object,
    mineUserInfo: Object
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
    jump (e) {
      let vkey = e.currentTarget.dataset.vkey
      wx.navigateTo({url: `/pages/homepage/index?vkey=${vkey}`})
    },
    getHeight () {
      wx.nextTick(()=>{
        getSelectorQuery('.header', this).then(res => {
          this.setData({'headerH': res.height})
        })
      });
    }
  }
})
