import {getTopicApi} from '../../../../../api/im.js'
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value: 'console'
    },
    list: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    allList: [],
    topList: []
  },
  attached () {
    getTopicApi().then(res => {
      this.setData({'allList': res.data.allList, 'topList': res.data.topList})
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    selectWord (e) {
      let word = e.currentTarget.dataset.word
      this.triggerEvent('selectResult', word)
    },
    tapMpre () {
      this.triggerEvent('tapMpre')
    }
  }
})
