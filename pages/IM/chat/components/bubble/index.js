import {localstorage} from '../../../../../utils/index.js'
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    mineUserInfo: {
      type: Object,
      value: {},
      observer(val)  {
        if (val && val.infoCompletePercent < 100 && !localstorage.get('closeChatTips')) {
          this.setData({'tips': true})
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tips: false
  },
  attached () {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    close () {
      localstorage.set('closeChatTips', {type: 'resetTheDay'})
      this.setData({'tips': false})
    },
    toPrfect () {
      wx.navigateTo({url: '/pages/editUser/index'})
    }
  }
})
