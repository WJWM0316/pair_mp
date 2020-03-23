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
    messageId: "messageId3",
    path: 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/d03e7897d4ee5c55ad392292ffd88bf.jpg',
    data: {
      type: 'audio',
      file: 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/1.m4a'
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
let word = ''
let firstMessageId = ''
import emoj from "../../../utils/emoji.js"
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
    pageY: 0,
    word: '', // 编辑框的文本
    canSend: false // 激活发送按钮, 因为编辑过程不更新data.word， 防止抖动。
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
  // 滚动至页面最底部
  pageScrollToBot () {
    wx.pageScrollTo({scrollTop: 3000})
  },
  // 监听文本域高度变化，随时滚动页面
  linechange () {
    this.pageScrollToBot()
  },
  // 选择emoji 或者 出场白
  selectResult (e) {
    word = word + e.detail
    this.setData({word, canSend: true}) 
  },
  // 文本域编辑
  bindinput (e) {
    word = e.detail.value
    if (word) {
      if (!this.data.canSend) this.setData({canSend: true})
    } else {
      this.setData({canSend: false})
    }
  },
  // 编辑完毕 更新一下data.word 状态
  bindblur (e) {
    this.setData({word})
  },
  resetView () {
    wx.pageScrollTo({
      scrollTop: 0,
      success: () => {
        this.setData({'selectIndex': null})
      }
    })
  },
  // 选择编辑类型
  selectType (e) {
    let index = e.currentTarget.dataset.index
    if ([0, 3, 4].includes(index)) {
      this.setData({'selectIndex': index}, () => {
        this.pageScrollToBot()
     })
    } else {
      wx.pageScrollTo({
        scrollTop: 0,
        success: () => {
          this.setData({'selectIndex': index})
        }
      })
    }
    
  },
  // 自定义下拉刷新
  fresherrefresh (e) {
    firstMessageId = this.data.messageList[0][0].messageId
    let messageList = [data1, ...this.data.messageList]
    this.setData({messageList, 'refresher': false})
  },
  // 自定义下拉刷新复位
  refresherrestore (e) {
    wx.nextTick(()=>{
      this.setData({firstMessageId})
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