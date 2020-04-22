const app =  getApp();
import {
  setPickerIntentionApi
} from '../../../api/pick.js'
import {localstorage} from '../../../utils/index.js'
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },
  attached () {
    let sex = wx.getStorageSync('sex')
    if (sex) {
      this.setData({'show': false})
      this.triggerEvent('choiceGender')
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    navBarHeight: app.globalData.navBarHeight
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setPickerIntention (e) {
      let sex = e.currentTarget.dataset.sex
      this.setData({'show': false})
      this.triggerEvent('choiceGender')
      if (localstorage.get('sex') !== sex) {
        localstorage.set('sex', sex)
        this.triggerEvent('hasSexChange')
      }
    }
  }
})
