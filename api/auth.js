import {request}  from "./index"
// 静默登录
export const silentLogin = (data) => {
  return request({
    method: 'get',
    url: '/wechat/oauth/mini',
    data
  })
}
// 微信授权登录
export const wxLogin = (data) => {
  return request({
    method: 'post',
    url: '/wechat/login/mini',
    data
  })
}
// 快捷登录登录
export const quickLogin = (data) => {
  return request({
    method: 'post',
    url: '/bind/quick_login',
    data
  })
}
