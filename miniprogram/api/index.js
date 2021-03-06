

import {getCurrentPagePath, socket, loginCallback, localstorage, hasLogin} from '../utils/index.js'
let APIHOST         = '',
    loadNum         = 0,
    app             = getApp(),
    token           = wx.getStorageSync('token'),
    sessionToken    = wx.getStorageSync('sessionToken'),
    addHttpHead     = {},
    noAuthRequests  = [], // 需要静默拦截的接口
    noConnectedReqs = [], // 没有网络是的接口
    isNoConnected   = false // 是否断网
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
const setHeader = (url) => {
  // 设置请求域名
  !APIHOST ? APIHOST = app.globalData.APIHOST : null

  // 设置授权信息
  token = localstorage.get('token')

  // 设置授权头部参数
  sessionToken = localstorage.get('sessionToken')
  sessionToken ? addHttpHead['Authorization-Wechat'] = sessionToken : delete addHttpHead['Authorization-Wechat']
  if (token) {
    if (url !== '/bind/register' 
        && url !== '/bind/quick_login' 
        && url !== '/wechat/login/mini' 
        && url !== '/wechat/oauth/mini'
      ) {
      addHttpHead['Authorization'] = token
    } else {
      delete addHttpHead['Authorization']
    }
    if (sessionToken) delete addHttpHead['Authorization-Wechat']
  } else {
    delete addHttpHead['Authorization']
  }

  if(wx.getStorageSync('inviteCode')) {
    addHttpHead['Invite-Code'] = wx.getStorageSync('inviteCode')
  }
}

// 清楚授权相关凭证
const removeAuth = () => {
  token = null
  sessionToken = null
  wx.removeStorageSync('token')
  wx.removeStorageSync('sessionToken')
  wx.removeStorageSync('inviteCode')
  delete addHttpHead['Authorization']
  delete addHttpHead['Authorization-Wechat']
  delete addHttpHead['Invite-Code']
}

// 网络检测
wx.onNetworkStatusChange(function (res) {
  if (!res.isConnected) {
    isNoConnected = true
  } else {
    if (isNoConnected) {
      isNoConnected = false
      wx.hideLoading()
      noConnectedReqs.forEach((item) => {
        item()
      })
      noConnectedReqs = []
    }
  }
})

export const request = ({method = 'post', url, host, data = {}, instance, loadingContent = '加载中...'}) => {
  // onLaunch 的时候获取不到getApp() 需要传递this过来
  app = !getApp() ? instance : getApp()

  return new Promise((resolve, reject) => {
    
    // 请求中间件
    const promise = () => {
      setHeader(url)

      // 开启菊花图
      if (!data.hasOwnProperty('hideLoading')) {
        openLoading(loadingContent)
      }
      delete data.hideLoading
      wx.request({
        url: APIHOST+url,
        header: addHttpHead,
        data: data,
        method: method,
        success(res) {
          // app.wxConfirm({
          //   title: '无法访问主页',
          //   content: '你已被对方拉黑，无法访问TA的主页。',
          //   confirmText: '好的',
          //   showCancel: false,
          //   confirmBack() {
          //     if(getCurrentPages().length > 1) {
          //       wx.navigateBack({ delta: 1 })
          //     } else {
          //       wx.reLaunch({url: '/pages/index/index'})
          //     }
          //   }
          // })
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
                  if (msg.code === 0 || msg.code === 200 || msg.code === 2101) {
                    resolve(msg)
                  } else {
                    switch(msg.code) {
                      case 2301:
                        reject(msg)
                        wx.reLaunch({url: `/pages/createUser/index?step=${msg.data.userInfo.step}&redirectTo=${encodeURIComponent(getCurrentPagePath())}`})
                        break
                      case 2102:                        
                        app.wxConfirm({
                          title: '无法访问主页',
                          content: '你已被对方拉黑，无法访问TA的主页。',
                          confirmText: '好的',
                          showCancel: false,
                          confirmBack() {
                            if(getCurrentPages().length > 1) {
                              wx.navigateBack({ delta: 1 })
                            } else {
                              wx.reLaunch({url: '/pages/index/index'})
                            }
                          }
                        })
                        reject(msg)
                        break
                      case 4010:
                        app.wxToast({title: msg.msg, callback: () => {
                          wx.redirectTo({url: `/pages/login/index?redirectTo=${encodeURIComponent(getCurrentPagePath())}`})
                        }})
                        break
                      case 2302:
                        wx.reLaunch({url: `/pages/invitation/index`})
                        break
                      case 401:
                        reject(msg)
                        removeAuth()
                        app.wxToast({title: msg.msg, callback: () => {
                          wx.redirectTo({url: `/pages/login/index?redirectTo=${encodeURIComponent(getCurrentPagePath())}`})
                        }})
                        break
                      case 4010:
                        reject(msg)
                        wx.removeStorageSync('token')
                        app.wxToast({title: msg.msg, callback: () => {
                          wx.redirectTo({url: `/pages/login/index?redirectTo=${encodeURIComponent(getCurrentPagePath())}`})
                        }})
                        break
                      default:
                        app.wxToast({title: msg.msg})
                        reject(msg)  
                        break
                    }       
                  }
                  break
                case 403:
                  reject(msg)
                  app.wxToast({title: msg.msg})
                  break
                case 500:
                  reject(msg)
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
          noConnectedReqs.push(promise)
          getApp().wxToast({title: '系统异常，请稍后访问'})
        }
      })
    }
    // 拦截器
    const controlFun = () => {
      // 没有静默登录的必须走一遍静默登录
      if (url === '/wechat/login/mini') {
        promise()
      } else {
        if (!app.globalData.hasOwnProperty('hasLogin')) {
          app.silentLoginOver = () => {
            if (noAuthRequests.length) {
              noAuthRequests.forEach((item) => {
                item()
              })
            }
          }
          noAuthRequests.push(promise)
        } else {
          promise()
        }
      }
    }

    controlFun()
  })
}

