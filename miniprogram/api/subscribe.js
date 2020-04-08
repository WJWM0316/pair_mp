
import {request}  from "./index"

export const getSubscribeApi = (data, instance) => {
  return request({
    method: 'get',
    url: '/area',
    data,
    instance
  })
}

export const getConfigMiniProgramApi = (data, instance) => {
  return request({
    method: 'get',
    url: '/config/mini_program',
    instance
  })
}

// 订阅小程序消息
export const subscribeWechatMessageApi  = (data, hasLoading) => {
  return request({
    method: 'post',
    url: `/wechat/message/subscribe`,
    data
  })
}