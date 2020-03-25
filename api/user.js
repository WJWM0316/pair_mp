import { request }  from "./index"
export const createUserStep1Api = (data) => {
  return request({
    method: 'post',
    url: '/user/base',
    data
  })
}

export const createUserStep2Api = (data) => {
  return request({
    method: 'post',
    url: '/user/height',
    data
  })
}

export const createUserStep3Api = (data) => {
  return request({
    method: 'post',
    url: '/user/industry',
    data
  })
}

export const updateUserSalaryApi = (data) => {
  return request({
    method: 'post',
    url: '/user/salary/update',
    data
  })
}

export const updateUserDescribeApi = (data) => {
  return request({
    method: 'post',
    url: '/user/describe/update',
    data
  })
}

export const getMyInfoApi = (data) => {
  return request({
    method: 'get',
    url: '/user/info',
    data
  })
}

export const updateUserBaseApi = (data) => {
  return request({
    method: 'put',
    url: '/user/base',
    data
  })
}