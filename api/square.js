import {request}  from "./index"

export const getSquareListApi = (data) => {
  return request({
    method: 'get',
    url: '/square/user/simplepage',
    data
  })
}