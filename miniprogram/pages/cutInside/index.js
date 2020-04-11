import WeCropper from '../../components/functional/we-cropper/we-cropper.js'
// import {unloadApi} from '../../api/common.js'
// import {APPLICANTHOST, RECRUITERHOST, COMMON, VERSION} from '../../config.js'
let device = wx.getSystemInfoSync()
let width = device.windowWidth
let height = device.windowHeight - 92
let app = getApp()
Page({
  data: {
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 375) / 2,
        y: (height - 450) / 2,
        width: 375,
        height: 450
        // width: 300,
        // height: 300
      }
    }
  },
  touchStart (e) {
    this.wecropper.touchStart(e)
  },
  touchMove (e) {
    this.wecropper.touchMove(e)
  },
  touchEnd (e) {
    this.wecropper.touchEnd(e)
  },
  wxupLoad(file) {
    let { APIHOST } = app.globalData
    wx.showLoading({
      title: '上传中...',
      mask: true
    })
    wx.uploadFile({
      url: `${APIHOST}/attaches`,
      filePath: file.path,//此处为图片的path
      methos: 'post',
      name: "avatar",
      header: {
        'Authorization': wx.getStorageSync('token')
        // 'Wechat-Version': VERSION
      }, 
      // 设置请求的 header
      formData: {
        'img1': file.path,
        'attach_type': 'avatar',
        'size': file.size
      }, 
      complete: (res) => {
        if (res.statusCode === 200) {
          let data = typeof res.data === "string" ? JSON.parse(res.data) : res.data
          wx.setStorageSync('avatar', data.data.attachListItem[0])
          wx.navigateBack({ delta: 1 })
        }
        wx.hideLoading()
      }
    })
  },
  getCropperImage () {
    this.wecropper.getCropperImage((avatar) => {
      if (avatar) {
        this.wxupLoad({path: avatar, size: 0})
      } else {
        console.log('获取图片失败，请稍后重试')
      }
    })
  },
  uploadTap () {
    let self = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success (res) {
        let src = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值
        self.wecropper.pushOrign(src)
      }
    })
  },
  onLoad (option) {
    let { cropperOpt } = this.data
    if (option.src) {
      cropperOpt.src = option.src
      new WeCropper(cropperOpt)
        .on('ready', (ctx) => {
          console.log(`wecropper is ready for work!`)
        })
        .on('beforeImageLoad', (ctx) => {
          // console.log(`before picture loaded, i can do something`)
          console.log(`current canvas context 1:`, ctx)
          wx.showToast({
            title: '上传中',
            icon: 'loading',
            duration: 20000
          })
        })
        .on('imageLoad', (ctx) => {
          // console.log(`picture loaded`)
          console.log(`current canvas context 2:`, ctx)
          // wx.hideToast()
        })
        .on('beforeDraw', (ctx, instance) => {
          console.log(`current canvas context 3:`, ctx)
        })
        .updateCanvas()
    }
  }
})
