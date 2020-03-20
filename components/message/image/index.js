const app =  getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    message: {
      type: Object,
      value: {
        file: 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/img_adviser_introduction_1%402x.png'
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    CDNPATH: app.globalData.CDNPATH,
    isVertical: false,
    styleString: ''
  },
  attached () {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    loadSuccess (e) {
      let imgInfo = e.detail.detail
      let ratio = imgInfo.width / imgInfo.height // 宽高比
      let styleString = '',
          maxHeight = '',
          maxWidth  = ''
      if (ratio > 1.2) {
        maxWidth = 460
        styleString = `width:${maxWidth}rpx;height:${maxWidth/ratio}rpx;`
      } else if (0.8 < ratio < 1.2) {
        maxHeight = 320
        styleString =  `width:${maxHeight * ratio}rpx;height:${maxHeight}rpx;`
      } else {
        maxHeight = 460
        styleString =  `width:${maxHeight * ratio}rpx;height:${maxHeight}rpx;`
      }
      this.setData({styleString})
    }
  }
})
