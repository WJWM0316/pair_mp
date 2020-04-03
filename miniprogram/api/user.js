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

export const addAlbumApi = (data) => {
  return request({
    method: 'post',
    url: '/album/add',
    data
  })
}

export const getMyLabelApi = (data) => {
  return request({
    method: 'get',
    url: '/label/my/label',
    data
  })
}

export const getUserInfoApi = (data) => {
  return request({
    method: 'get',
    url: `/user/info/${data.vkey}`
  })
}

export const getUserInfoCompleteApi = (data) => {
  return request({
    method: 'get',
    url: '/user/complete'
  })
}

export const userSignApi = (data) => {
  return request({
    method: 'put',
    url: '/sign_in'
  })
}

export const getCurrentWeekSignInApi = (data) => {
  return request({
    method: 'get',
    url: '/sign_in/list/cur_week'
  })
}