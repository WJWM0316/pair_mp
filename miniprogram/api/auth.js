import {request}  from "./index"
// 静默登录
export const silentLogin = (data, instance) => {
  return request({
    method: 'get',
    url: '/wechat/oauth/mini',
    data,
    instance
  })
}
// 微信授权登录
export const wxLogin = (data, instance) => {
  return request({
    method: 'post',
    url: '/wechat/login/mini',
    data,
    instance
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

// 发送验证码
export const sendMsgApi = (data) => {
  return request({
    method: 'post',
    url: '/bind/sendMessage',
    data
  })
}

// 手机号登录
export const registerApi = (data) => {
  return request({
    method: 'post',
    url: '/bind/register',
    data
  })
}
// 退出登录
export const logoutApi = (data) => {
  return request({
    method: 'get',
    url: '/auth/wechat/mini/logout',
    data
  })
}

