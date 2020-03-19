import {request}  from "./index"
// 行业列表
export const getIndustryApi = (data) => {
  return request({
    method: 'get',
    url: '/industry',
    data
  })
}

// 获取地区列表
export const getAreaApi = (data) => {
  return request({
    method: 'get',
    url: '/area',
    data
  })
}
