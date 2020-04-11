const app =  getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    message: {
      type: Object,
      value: {}
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
      this.setData({styleString}, () => {
        wx.pageScrollTo({
          duration: 200,
          selector: `#bottomBlock`
        })
      })
    },
    previewImage () {
      app.globalData.lockonShow = true
      let that = this
      wx.previewImage({
        current: that.data.message.imageUri,
        urls: [that.data.message.imageUri]
      })
    }
  }
})
