let app = getApp()
Page({
  data: {
    imgUrl: '',
    isOpenSetting: true
  },
  draw() {
    let callback = () => {
      let { userInfo } = app.globalData.userInfo
      let avatarUrl = null
      let loadResult = (res, resolve) => {
        let timer = null
        timer = setTimeout(() => {
          app.wxToast({
            title: '图片加载失败，请重新生成',
            callback() {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }, this.data.timerSecond)
        if (res.statusCode === 200) {
          resolve(res)
          clearTimeout(timer)
          return res.tempFilePath
        }
      }
      let loadAvatar = new Promise((resolve, reject) => {
        // 头像
        wx.downloadFile({
          url: userInfo.avatarInfo.smallUrl,
          success(res) {
            avatarUrl = loadResult(res, resolve)
          },
          fail(e) {
            app.wxToast({title: '图片加载失败，请重新生成', callback() {wx.navigateBack({ delta: 1 })}})
          }
        })
      })
      Promise.all([loadAvatar]).then((result) => {
        let ctx = wx.createCanvasContext('cardCanvas')
        ctx.fillRect(0, 0, 750, 1058)
        ctx.drawImage('../../images/img_shareposter@2x.png', 0, 0, 750, 1058)

        ctx.drawImage('../../images/xcx.png', 575, 850, 107, 107)

        ctx.setFillStyle('#ffffff')
        ctx.setFontSize(32)
        ctx.fillText(userInfo.nickname, 203, 765)

        ctx.beginPath()
        ctx.arc(110, 752, 60, 0, 2 * Math.PI)
        ctx.setFillStyle('#ffffff')
        ctx.fill()
        ctx.clip()
        ctx.drawImage(avatarUrl, 50, 692, 120, 120)

        ctx.draw(true, () => {
          let that = this
          setTimeout(() => {
            wx.canvasToTempFilePath({
              x: 0,
              y: 0,
              quality: 1,
              canvasId: 'cardCanvas',
              success(res) {
                that.setData({imgUrl: res.tempFilePath})
                wx.hideLoading()
              },
              fail(err) {
                console.log(err)
              }
            }, this)
          }, 16.7)
        })
      })
    }
    if (app.globalData.userInfo) {
      callback()
    } else {
      app.getUserInfo = () => callback()
    }
  },
  onLoad(options) {
    this.draw()
  },
  onShow() {
    let that = this
    wx.getSetting({
      success(res) {
        if(res.authSetting['scope.writePhotosAlbum']) {
          that.setData({isOpenSetting: true})
        }
      }
    })
  },
  downLoad() {
    let that = this
    let save = () => {
      wx.saveImageToPhotosAlbum({
        filePath: that.data.imgUrl,
        success: function (e) {
          app.wxToast({title: '已保存至相册', icon: 'success'})
        },
        fail: function (e) {
          app.wxToast({title: '保存失败'})
        }
      })
    }
    wx.getSetting({
      success(res) {
        if(!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.setData({isOpenSetting: true})
              save()
            },
            fail(res) {
              if (res.errMsg.indexOf('fail') !== -1) {
                that.setData({isOpenSetting: false})
              } 
            }
          })
        } else {
          save()
        }
       }
    })
  }
})