const app =  getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    cdnPath: app.globalData.CDNPATH
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close () {
      this.setData({'show': false})
    },
    show () {
      this.setData({'show': true})
    },
  }
})
