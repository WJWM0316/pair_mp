import {request}  from "./index"
// pick
export const pickApi = (data) => {
  return request({
    method: 'get',
    url: '/pick/user',
    data
  })
}

// 首页 头像列表
export const pickIndexAvaApi = (data) => {
  return request({
    method: 'get',
    url: '/pick/config/aggr',
    data
  })
}

// 首页 pick逻辑聚合接口
export const pickAggrApi = (data) => {
  return request({
    method: 'get',
    url: '/pick/aggr',
    data
  })
}

// 设置pick意向：性别
export const setPickerIntentionApi = (data) => {
  return request({
    method: 'put',
    url: '/pick/intention/gender',
    data
  })
}

// 获取 皮糖换pick次数的相关信息
export const getPickChanceApi = (data) => {
  return request({
    method: 'get',
    url: '/pick_chance/exchange_info',
    data
  })
}

// 皮糖换pick次数
export const pickChanceApi = (data) => {
  return request({
    method: 'post',
    url: '/pick_chance/exchange',
    data
  })
}