import {subscribeWechatMessageApi} from '../api/subscribe.js'

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
  wxConfirm: ({title = '', content, showCancel = true, cancelText = '取消', confirmText = '确定', cancelColor = '#BCBCBC', confirmColor = '#0CCDDA', confirmBack = function() {}, cancelBack = function() {}}) => {
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
  chooseImageUpload(number, needCut = false) {
    return new Promise((resolve, reject) => {
      let that = this
      wx.chooseImage({
        count: number && number || 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album'],
        success (res) {
          let file = res.tempFiles[0]
          let callback = () => {
            let formData = {
              'img1': file.path,
              'size': file.size || 0,
              attach_type: 'img'
            }
            let { APIHOST } = that.globalData
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
          }
          if(needCut) {
            resolve(file)
          } else {
            callback(file)
          }
        },
        fail(err) {
          reject(err)
        }
      })
    })
  },
  // 拍照上传
  photoUpload(needCut = false) {
    return new Promise((resolve, reject) => {
      let that = this
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['camera'],
        success (res) {
          let file = res.tempFiles[0]
          let callback = (file) => {
            let formData = {
              'img1': file.path,
              'size': file.size || 0,
              attach_type: 'img'
            }
            let { APIHOST } = that.globalData
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
          }
          if(needCut) {
            resolve(file)
          } else {
            callback(file)
          }
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
  uploadFile(file, type='img') {
    return new Promise((resolve, reject) => {
      let formData = {
        'img1': file.path || file.tempFilePath,
        'size': file.size || file.fileSize || 0,
        'duration': file.duration || 0,
        attach_type: type || 'img'
      }
      let { APIHOST } = getApp().globalData
      wx.uploadFile({
        url: `${APIHOST}/attaches`,
        filePath: file.path || file.tempFilePath,
        methos: 'post',
        name: 'file',
        header: {
          'Authorization': wx.getStorageSync('token')
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
  },
  // 微信分享
  wxShare ({options, title, path, imageUrl, noImg, btnTitle, btnPath, btnImageUrl}) {
    let shareInfos = app.globalData.shareInfos.shareMiniprogram,
        random     = parseInt(Math.random() * (shareInfos.title.length - 1))
    if (!title) {
      title = shareInfos[random]
    }
    if (!imageUrl) {
      imageUrl = shareInfos.imageUrl
    }
    let shareObj = {
      title: title,
      path: path || '/pages/index/index',
      imageUrl: imageUrl,
      success: function(res){
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok'){
        }
      },
      fail: function(){
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel'){
        // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail'){
        // 转发失败，其中 detail message 为详细失败信息
        }
      }
    }
    // 来自页面内的按钮的转发
    if (options.from == 'button') {
      var eData = options.target.dataset
      shareObj = {
        title: btnTitle || shareObj.title,
        path: btnPath || shareObj.path,
        imageUrl: btnImageUrl || shareObj.imageUrl
      }
    }
    return shareObj
  },
  subscribeMessage(key) {
    return new Promise((resolve, reject) => {
      let that = this
      let subscribeConfig = that.globalData.subscribeConfig[key]
      if (this.globalData.platform == 'devtools' || !wx.requestSubscribeMessage || !subscribeConfig) {
        resolve()
        return
      }
      let tmplIds = subscribeConfig.map(v => v.templateId)
      wx.requestSubscribeMessage({
        tmplIds,
        success (res) {
          if (res[tmplIds[0]] == 'accept') {
            subscribeWechatMessageApi({ tmplIds }).then(() => resolve())
          } else {
            resolve()
          }
        },
        fail(err) {
          reject()
          console.log(err, 'fail')
          if(err.errCode == 20004) {
            that.wxConfirm({
              title: '订阅消息',
              content: `您关闭了“接受订阅消息”，请前往设置打开！`,
              cancelText: '算了',
              confirmText: '去设置',
              confirmBack: () => {
                wx.openSetting({})
              },
              cancelBack: () => {
                resolve()
              }
            })
          }
        }
      })
    })
  }
}

export default wxApi

