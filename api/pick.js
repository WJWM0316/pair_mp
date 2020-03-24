

import {request}  from "./index"
// pick
export const pickApi = (data) => {
  return request({
    method: 'get',
    url: '/pick/user',
    data
  })
}

