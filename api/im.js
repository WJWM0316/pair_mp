import {request}  from "./index"
// 获取聊天记录
export const getChatDetailApi = (data) => {
  return request({
    method: 'get',
    url: '/im/msg',
    data
  })
}

// 获取消息列表
export const getRelationlistApi = (data) => {
  return request({
    method: 'get',
    url: '/relation/list',
    data
  })
}
