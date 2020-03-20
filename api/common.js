import { request }  from "./index"
export const getAreaListApi = (data) => {
  return request({
    method: 'get',
    url: '/area',
    data
  })
}

export const upLoadApi = (data) => {
  return request({
    method: 'post',
    url: '/attaches',
    data
  })
}