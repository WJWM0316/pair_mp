import {request}  from "./index"

export const reportApi = (data) => {
  return request({
    method: 'post',
    url: '/report/add',
    data
  })
}

export const getReportListApi = (data) => {
    return request({
      method: 'get',
      url: '/report/list',
      data
    })
  }
  