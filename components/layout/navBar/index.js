const app =  getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  attached () {
    let systemInfo = app.globalData.systemInfo
    let rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null; //胶囊按钮位置信息
      wx.getMenuButtonBoundingClientRect();
      let navBarHeight = (function() { //导航栏高度
              let gap = rect.top - systemInfo.statusBarHeight; //动态计算每台手机状态栏到胶囊按钮间距
              return 2 * gap + rect.height;
            })();
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
