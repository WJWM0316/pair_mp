// pages/IM/chat/index.js
let data = [
  {
    messageId: "messageId0",
    path: 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/d03e7897d4ee5c55ad392292ffd88bf.jpg',
    data: {
      type: 'text',
      text: '测试数据测试数据测试'
    }
  },
  {
    messageId: "messageId1",
    path: 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/d03e7897d4ee5c55ad392292ffd88bf.jpg',
    data: {
      type: 'text',
      own: true,
      text: '测试数据测试数据测试测试数据测试数据测试测试数据测试数据测试'
    }
  },
  {
    messageId: "messageId2",
    path: 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/d03e7897d4ee5c55ad392292ffd88bf.jpg',
    data: {
      type: 'img',
      own: true,
      file: 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/1577673683.png'
    }
  },
  {
    messageId: "messageId3",
    path: 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/d03e7897d4ee5c55ad392292ffd88bf.jpg',
    data: {
      type: 'audio',
      own: true,
      file: 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/1.m4a'
    }
  },
  {
    messageId: "messageId4",
    path: 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/d03e7897d4ee5c55ad392292ffd88bf.jpg',
    data: {
      id: 1,
      type: 'video',
      own: true,
      path: 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/d5c58db5ae81230cd0b8253fabe472cf.mp4',
      file: 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/d5c58db5ae81230cd0b8253fabe472cf.mp4?x-oss-process=video/snapshot,t_7000,f_jpg,w_800,h_600,m_fast'
    }
  },
  {
    messageId: "messageId5",
    path: 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/d03e7897d4ee5c55ad392292ffd88bf.jpg',
    data: {
      type: 'img',
      own: true,
      file: 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/1577673683.png'
    }
  },
  {
    messageId: "messageId6",
    path: 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/d03e7897d4ee5c55ad392292ffd88bf.jpg',
    data: {
      type: 'img',
      own: true,
      file: 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/1577673683.png'
    }
  }
]
let data1 = [
  {
    messageId: "messageId00",
    path: 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/d03e7897d4ee5c55ad392292ffd88bf.jpg',
    data: {
      type: 'text',
      text: '测试数据测试数据测试'
    }
  },
  {
    messageId: "messageId11",
    path: 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/d03e7897d4ee5c55ad392292ffd88bf.jpg',
    data: {
      type: 'text',
      own: true,
      text: '测试数据测试数据测试测试数据测试数据测试测试数据测试数据测试'
    }
  },
  {
    messageId: "messageId22",
    path: 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/d03e7897d4ee5c55ad392292ffd88bf.jpg',
    data: {
      type: 'img',
      own: true,
      file: 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/1577673683.png'
    }
  },
  {
    messageId: "messageId33",
    path: 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/d03e7897d4ee5c55ad392292ffd88bf.jpg',
    data: {
      type: 'audio',
      own: true,
      file: 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/1.m4a'
    }
  },
  {
    messageId: "messageId44",
    path: 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/d03e7897d4ee5c55ad392292ffd88bf.jpg',
    data: {
      id: 1,
      type: 'video',
      own: true,
      path: 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/d5c58db5ae81230cd0b8253fabe472cf.mp4',
      file: 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/d5c58db5ae81230cd0b8253fabe472cf.mp4?x-oss-process=video/snapshot,t_7000,f_jpg,w_800,h_600,m_fast'
    }
  }
]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList: [
      data
    ],
    firstMessageId: '',
    refresher: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // 自定义下拉刷新
  fresherrefresh (e) {
    let firstMessageId = this.data.messageList[0][0].messageId
    let messageList = [data1, ...this.data.messageList]
    this.setData({messageList, 'refresher': false}, () => {
      wx.nextTick(()=>{
        this.setData({firstMessageId})
      });
    })
  },
  // 自定义下拉刷新复位
  refresherrestore (e) {
    
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})