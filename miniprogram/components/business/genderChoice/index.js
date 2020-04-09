const app =  getApp();
import {
  setPickerIntentionApi
} from '../../../api/pick.js'

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
      wx.setStorageSync('sex', sex)
      this.triggerEvent('choiceGender')
      if (!this.data.hasLogin) return
      setPickerIntentionApi({gender: sex, hideLoading: true})
    }
  }
})
