
import {request}  from "./index"

export const getSubscribeApi = (data, instance) => {
  return request({
    method: 'get',
    url: '/area',
    data,
    instance
  })
}