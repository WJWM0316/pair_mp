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


// 获取IM会话用户详情
export const getImTopDeatilApi = (data) => {
  return request({
    method: 'get',
    url: `/user/im/top/${data.vkey}`,
    data
  })
}

// 获取开场白数据
export const getTopicApi = (data) => {
  return request({
    method: 'get',
    url: `/topic`,
    data
  })
}

