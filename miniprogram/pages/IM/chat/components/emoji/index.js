import emoji from '../../../../../utils/emoji.js'
const app =  getApp();
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
    list: emoji.emojiList,
    cdnPath: app.globalData.CDNPATH
  },

  /**
   * 组件的方法列表
   */
  methods: {
    selected (e) {
      let index = e.currentTarget.dataset.index,
          word  = emoji.emojiName[index]
      this.triggerEvent('selectResult', word)
    }
  }
})
