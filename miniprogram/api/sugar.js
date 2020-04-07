import { request }  from "./index"

export const getSugarWalletApi = (data) => {
  return request({
    method: 'get',
    url: '/sugar_wallet/bill/simplepage',
    data
  })
}

export const getSugarInfoApi = (data) => {
  return request({
    method: 'get',
    url: '/sugar_wallet',
    data
  })
}