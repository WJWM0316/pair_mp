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
    titleHeight: app.globalData.systemInfo.titleHeight,
    statusBarHeight: app.globalData.systemInfo.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight
  },
  ready () {
    
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})