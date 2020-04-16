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
    url: `/topic/${data.vkey}`,
    data
  })
}

// 删除消息会话
export const deleteMsgApi = (data) => {
  return request({
    method: 'delete',
    url: `/relation/del/${data.vkey}`,
    data
  })
}

// 收起会话头部
export const putHeaderApi = (data) => {
  return request({
    method: 'put',
    url: `/im/chat/user_card/hide/${data.vkey}`,
    data
  })
}

// 展开会话头部
export const delHeaderApi = (data) => {
  return request({
    method: 'delete',
    url: `/im/chat/user_card/hide/${data.vkey}`,
    data
  })
}

// 未读数
export const unreadNumApi = (data) => {
  return request({
    method: 'get',
    url: `/im/msg/unread`,
    data
  })
}
