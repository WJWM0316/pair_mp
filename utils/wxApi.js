const QQMapWX = require('./qqmap-wx-jssdk.min.js');
const qqmapsdk = new QQMapWX({
  key: 'TMZBZ-S72K6-66ISB-ES3XG-CVJC6-HKFZG'
})
const wxApi = {
  wxToast:  ({title, icon = 'none', image, mask = true, duration = 2000, callback = function(){} }) => {
    // icon - success 显示成功图标，此时 title 文本最多显示 7 个汉字长度
    // icon - loading 显示加载图标，此时 title 文本最多显示 7 个汉字长度
    wx.showToast({
      title,
      icon,
      image,
      mask,
      duration,
      success() {
        setTimeout(() => {
          // 自定义一个回调函数
          callback()
        }, duration)
      }
    })
  },
  wxConfirm: ({title = '', content, showCancel = true, cancelText = '取消', confirmText = '确定', cancelColor = '#BCBCBC', confirmColor = '#652791', confirmBack = function() {}, cancelBack = function() {}}) => {
    wx.showModal({
      title,
      content,
      cancelText,
      cancelColor,
      confirmColor,
      showCancel,
      confirmText,
      success(res) {
        if (res.confirm) {
          confirmBack()
        } else if (res.cancel) {
          cancelBack()
        }
      }
    })
  },
  // 选图上传
  chooseImageUpload(number) {
    return new Promise((resolve, reject) => {
      wx.chooseImage({
        count: number && number || 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album'],
        success (res) {
          resolve(res)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  },
  // 拍照上传
  photoUpload() {
    return new Promise((resolve, reject) => {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['camera'],
        success (res) {
          resolve(res)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  },
  reverseGeocoder(res) {
    return new Promise((resolve, reject) => {
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: res.latitude,
          longitude: res.longitude
        },
        success(res) {
          resolve(res)
        },
        fail(res) {
          reject(res)
        }
      })
    })
  },
  uploadFile(file) {
    return new Promise((resolve, reject) => {
      let that = this
      let formData = {
        'img1': file.path,
        'size': file.size || 0,
        attach_type: 'img'
      }
      let { APIHOST } = this.globalData
      wx.uploadFile({
        url: `${APIHOST}/attaches`,
        filePath: file.path,
        methos: 'post',
        name: 'file',
        header: {
          'Authorization': wx.getStorageSync('token')
          // 'Wechat-Version': VERSION
        }, 
        formData,
        success(res) {
          let data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
          resolve(data)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  }
}

export default wxApi

