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
    },
    vkey: {
      type: String,
      value: '',
      observer(val)  {
        if (val) {
          this.getDataList()
        }
      }
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
    
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    getDataList () {
      getTopicApi({vkey: this.data.vkey, hideLoading: true}).then(res => {
        this.setData({'allList': res.data.allList, 'topList': res.data.topList})
      })
    },
    selectWord (e) {
      let word = e.currentTarget.dataset.word
      this.triggerEvent('selectResult', word)
    },
    tapMpre () {
      this.triggerEvent('tapMpre')
    }
  }
})
