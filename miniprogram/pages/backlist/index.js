import {
  getBackListApi
} from '../../api/black.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        avatar: 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/1577673683.png',
        name: '老打'
      },
      {
        avatar: 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/1577673683.png',
        name: '老打'
      }
    ]
  },
  onShow() {
    getBackListApi().then(res => {
      console.log(res)
    })
  }
})