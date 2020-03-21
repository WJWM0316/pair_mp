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

export const getDegreeApi = (data) => {
  return request({
    method: 'get',
    url: '/industry',
    data,
  })
}

export const sendEmailApi = (data) => {
  return request({
    method: 'post',
    url: '/verify/send/email',
    data,
  })
}

export const verifyEmailApi = (data) => {
  return request({
    method: 'post',
    url: '/verify/email',
    data,
  })
}

export const getSalaryListApi = (data) => {
  return request({
    method: 'get',
    url: '/user/salary',
    data,
  })
}