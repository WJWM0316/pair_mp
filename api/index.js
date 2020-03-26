
import {silentLogin} from './auth.js'
let APIHOST         = '',
    loadNum         = 0,
    token           = wx.getStorageSync('token'),
    sessionToken    = wx.getStorageSync('sessionToken'),
    addHttpHead     = {},
    noAuthRequests  = [] // 没有静默授权就请求的其他接口，需要静默之后再请求
// 开启loading
let openLoading = () => {
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
export const request = ({method = 'post', url, host, data = {}, loadingContent = '加载中...'}) => {
  // 设置请求域名
  !APIHOST ? APIHOST = getApp().globalData.APIHOST : null

  // 设置授权信息
  !token ? token = wx.getStorageSync('token') : null
  !sessionToken ? sessionToken = wx.getStorageSync('sessionToken') : null
  token && !addHttpHead['Authorization'] ? addHttpHead['Authorization'] = token : null
  sessionToken && !addHttpHead['Authorization-Wechat'] ? addHttpHead['Authorization-Wechat'] = sessionToken : null

  // 请求中间件
  const promise = () => {
    return new Promise((resolve, reject) => {
      // 开启菊花图
      if (data.hasOwnProperty('hasLoading')) {
        openLoading()
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
                    getApp().wxToast({title: msg.msg})
                    reject(msg)
                  }
                  break
                case 401:
                  reject(msg)
                  token = null
                  sessionToken = null
                  wx.removeStorageSync('token')
                  wx.removeStorageSync('sessionToken')
                  delete addHttpHead['Authorization']
                  delete addHttpHead['Authorization-Wechat']
                  break
                case 500:
                this.wxToast({title: '系统异常，请稍后访问'})
                break
              }
            }
          } catch (e) {
            this.wxToast({title: '系统异常，请稍后访问'})
          }
        },
        fail(e) {
          closeLoading()
          this.wxToast({title: '系统异常，请稍后访问'})
        }
      })
    })
  }

  wx.checkSession({
    success () {
      //session_key 未过期，并且在本生命周期一直有效
    },
    fail () {
      // session_key 已经失效，需要重新执行登录流程
      wx.login() //重新登录
    }
  })

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
              if (res.data.data.sessionToken) wx.setStorageSync('sessionToken', res.data.data.sessionToken)
              if (res.data.data.token) wx.setStorageSync('token', res.data.data.token)
              noAuthRequests.forEach((item, index) => {
                return item()
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
    return promise()
  }
}

