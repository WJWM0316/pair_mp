

import {request}  from "./index"

export const getQuestionListApi = (data) => {
    return request({
        method: 'get',
        url: '/question/list',
        data
    })
}

export const getMyQuestionListApi = (data) => {
    return request({
        method: 'get',
        url: '/question/answer/list',
        data
    })
}

export const postQuestionApi = (data) => {
    return request({
        method: 'post',
        url: '/question/add',
        data
    })
}

export const removeQuestionApi = (data) => {
    return request({
        method: 'delete',
        url: `/question/answer/${data.id}`
    })
}