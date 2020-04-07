import { request }  from "./index"

export const getBackListApi = (data) => {
  return request({
    method: 'get',
    url: '/black',
    // data
  })
}

export const removeBackApi = (data) => {
  return request({
    method: 'delete',
    url: `/black/${data.vkey}`,
    // data
  })
}


export const setBackApi = (data) => {
  return request({
    method: 'put',
    url: `/black/${data.vkey}`,
    // data
  })
}