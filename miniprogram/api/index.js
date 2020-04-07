

import {getCurrentPagePath, socket, loginCallback} from '../utils/index.js'
let APIHOST         = '',
    loadNum         = 0,
    app             = getApp(),
    token           = wx.getStorageSync('token'),
    sessionToken    = wx.getStorageSync('sessionToken'),
    addHttpHead     = {},
    noAuthRequests  = [] // 需要静默拦截的接口
// 开启loading
let openLoading = (loadingContent) => {
  if (loadNum === 0) {
    wx.showLoading({
      title: loadingContent,
      mask: true
    })
  }
  loadNum++
}
// 关闭loading
let closeLoading = () => {
  loadNum--
  if (loadNum <= 0) {
    wx.hideLoading()
    loadNum = 0
  }
}

// 设置头部信息
const setHeader = () => {
  addHttpHead = {}
  token = ''
  // 设置请求域名
  !APIHOST ? APIHOST = app.globalData.APIHOST : null

  // 设置授权信息
  !token ? token = wx.getStorageSync('token') : null
  !sessionToken ? sessionToken = wx.getStorageSync('sessionToken') : null
  token ? addHttpHead['Authorization'] = token : null
  sessionToken ? addHttpHead['Authorization-Wechat'] = sessionToken : null
}

// 清楚授权相关凭证
const removeAuth = () => {
  token = null
  sessionToken = null
  wx.removeStorageSync('token')
  wx.removeStorageSync('sessionToken')
  delete addHttpHead['Authorization']
  delete addHttpHead['Authorization-Wechat']
}

export const request = ({method = 'post', url, host, data = {}, instance, loadingContent = '加载中...'}) => {
  // onLaunch 的时候获取不到getApp() 需要传递this过来
  app = !getApp() ? instance : getApp()

  return new Promise((resolve, reject) => {
    setHeader()

    // 请求中间件
    const promise = () => {
      // 开启菊花图
      if (!data.hasOwnProperty('hideLoading')) {
        openLoading(loadingContent)
      }
      wx.request({
        url: APIHOST+url,
        header: addHttpHead,
        data: data,
        method: method,
        success(res) {
          closeLoading()
          console.log(url, res.data)
          try {
            if (typeof res.data === 'string') { // 转换返回json
              res.data = JSON.parse(res.data)
            }
            if (res) {
              let msg = res.data
              //有字符串的情况下 转数字
              msg.httpStatus = parseInt(msg.httpStatus)
              switch (msg.httpStatus) {
                case 200:
                  if (msg.code === 0 || msg.code === 200) {
                    resolve(msg)
                  } else {
                    app.wxToast({title: msg.msg})
                    reject(msg)
                  }
                  break
                case 401:
                  reject(msg)
                  if (msg.code === 4010) {
                    wx.removeStorageSync('token')
                  } else if (msg.code === 401) {
                    wx.removeStorageSync('sessionToken')
                  } else {
                    removeAuth()
                  }
                  app.wxToast({title: msg.msg}, () => {
                    wx.redirectTo({url: `/pages/login/index?redirectTo=${encodeURIComponent(getCurrentPagePath())}`})
                  })
                  break
                case 403:
                  app.wxToast({title: msg.msg})
                  break
                case 500:
                  app.wxToast({title: '系统异常，请稍后访问'})
                break
              }
            }
          } catch (e) {
            reject(e)
            closeLoading()
            console.log(e)
            getApp().wxToast({title: '系统异常，请稍后访问'})
          }
        },
        fail(e) {
          reject(e)
          closeLoading()
          console.log(e)
          getApp().wxToast({title: '系统异常，请稍后访问'})
        }
      })
    }

    // 拦截器
    const controlFun = () => {
      // 静默登录拦截
      if (!sessionToken && !token) {
        if (!noAuthRequests.length) {
          wx.login({
            success: function (res0) {
              let code = res0.code
              wx.request({
                url: `${getApp().globalData.APIHOST}/wechat/login/mini`,
                data: {code},
                header: addHttpHead,
                method: 'post',
                success(res) {
                  loginCallback(res.data)
                  setHeader() // 重新设置头部
                  noAuthRequests.forEach((item, index) => {
                    item()
                  })
                  noAuthRequests = []
                },
                fail(e) {
                  console.log('服务器异常，请稍后访问', e)
                }
              })
            },
            fail: function (e) {
              console.log('登录失败', e)
            }
          })
        }
        noAuthRequests.push(promise)
      } else {
        promise()
      }
    }

    
    // 判断微信登录状态
    wx.checkSession({
      success () {
        controlFun()
      },
      fail () {
        removeAuth()
        controlFun()
      }
    })
  })
}
