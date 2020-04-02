import {request}  from "./index"

export const getSquareListApi = (data) => {
  return request({
    method: 'get',
    url: '/square/user/simplepage',
    data
  })
}

export const getChargeInfoApi = (data) => {
  return request({
    method: 'get',
    url: '/square/user/charge',
    data
  })
}