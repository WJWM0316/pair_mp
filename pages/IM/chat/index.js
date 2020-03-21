const app =  getApp();
let data = [
  {
    messageId: "messageId0",
    path: 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/d03e7897d4ee5c55ad392292ffd88bf.jpg',
    data: {
      type: 'text',
      text: '测'
    }
  },
  {
    messageId: "messageId0",
    path: 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/d03e7897d4ee5c55ad392292ffd88bf.jpg',
    data: {
      type: 'text',
      text: '1'
    }
  },
  {
    messageId: "messageId1",
    path: 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/d03e7897d4ee5c55ad392292ffd88bf.jpg',
    data: {
      type: 'text',
      own: true,
      text: '1'
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
    refresher: false,
    selectIndex: null,
    consoleBtnType: [
      {
        name: '录音',
        type: 'record',
        icon: 'icon_im_yuyin',
        color: '#0CCDDA'
      },
      {
        name: '相册',
        type: 'album',
        icon: 'icon_im_tupian',
      },
      {
        name: '拍摄',
        type: 'shot',
        icon: 'icon_im_paizhao',
      },
      {
        name: '表情',
        type: 'emoj',
        icon: 'icon_im_biaoqing',
        color: '#FFD853'
      },
      {
        name: '出场语',
        type: 'debutWord',
        icon: 'icon_im_kaichangbai',
        color: '#F46BA1'
      }
    ],
    pageY: 0
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
    console.log(app, 11)
    console.log()
    app.wxToast({title: '测试一下'})
  },
  resetView () {
    wx.pageScrollTo({
      scrollTop: 0,
      success: () => {
        this.setData({'selectIndex': null})
      }
    })
  },
  // 自定义下拉刷新
  fresherrefresh (e) {
    let firstMessageId = this.data.messageList[0][0].messageId
    let messageList = [data1, ...this.data.messageList]
    this.setData({messageList, 'refresher': false})
  },
  // 自定义下拉刷新复位
  refresherrestore (e) {
    wx.nextTick(()=>{
      this.setData({firstMessageId})
    })
  },
  selectType (e) {
    let index = e.currentTarget.dataset.index,
        pageY = [0, 3, 4].includes(index) ? 1000 : 0
    this.setData({'selectIndex': index}, () => {
      wx.pageScrollTo({scrollTop: pageY})
    })
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