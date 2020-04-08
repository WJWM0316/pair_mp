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

// export const getDegreeApi = (data) => {
//   return request({
//     method: 'get',
//     url: '/industry',
//     data,
//   })
// }

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

export const getAggrApi = (data) => {
  return request({
    method: 'get',
    url: `/aggr/${data.type}`
  })
}

export const getCompanyNameListApi = (data) => {
  return request({
    method: 'get',
    url: '/company/match',
    data
  })
}

export const hasCompanyEmailApi = (data) => {
  return request({
    method: 'get',
    url: `/company/email/${data.company_id}`
  })
}

export const getLabelListApi = (data) => {
  return request({
    method: 'get',
    url: '/label/list'
  })
}

export const addLabelApi = (data) => {
  return request({
    method: 'post',
    url: '/label/add',
    data
  })
}

export const verifyCareerApi = (data) => {
  return request({
    method: 'post',
    url: '/verify/career',
    data
  })
}


export const shareInfosApi = (data, instance) => {
  return request({
    method: 'get',
    url: '/share/info',
    data,
    instance
  })
}