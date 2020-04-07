const app = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    awardList: Array,
    type: {
      type: String,
      value: 'list'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    curIndex: 0,
    cdnPath: app.globalData.CDNPATH
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show () {
      this.setData({'show': true})
    },
    close () {
      if (this.data.type === 'list') {
        let curIndex = this.data.curIndex
        if (curIndex < this.data.awardList.length - 1) {
          curIndex++
          this.setData({curIndex})
        } else {
          this.setData({'show': false, 'curIndex': 0})
        }
      } else {
        this.setData({'show': false})
      }
    }
  }
})
