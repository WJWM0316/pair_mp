const app =  getApp();
let winWidth = app.globalData.systemInfo.windowWidth
let data = [
  {
    messageId: "messageId0",
    timestamp: '1585033928',
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
let word = ''
import {getSelectorQuery} from '../../../utils/util.js'
import emoj from "../../../utils/emoji.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList: [
      {
        messageId: "messageId0",
        timestamp: '1585033928',
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
    textHeight: 0, // 编辑框高度
    canSend: false, // 激活发送按钮, 因为编辑过程不更新data.word， 防止抖动。
    longpressData: {}
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
  // 长按功能
  longpress (e) {
    let dataset  = e.currentTarget.dataset
    getSelectorQuery(`.${dataset.class}`).then(res => {
      console.log(res, 11)
      let longpressData = {
        index: dataset.index
      },
      position = {}
      if (res.top >= 80) {
        if (dataset.object.data.own) {
          longpressData.style = `right:0;top:-100rpx;`
          longpressData.iconStyle = 'right:45rpx;bottom:-31rpx;'
        } else {
          longpressData.style = `left:0;top:-100rpx;`
          longpressData.iconStyle = 'left:14rpx;bottom:-31rpx;'
        }
      } else {
        if (dataset.object.data.own) {
          longpressData.style = `right:0;bottom:-100rpx;`
          longpressData.iconStyle = 'right:45rpx;top:-31rpx;transform: rotate(180deg);'
        } else {
          longpressData.style = `left:0;bottom:-100rpx;`
          longpressData.iconStyle = 'left:14rpx;top:-31rpx;transform: rotate(180deg);'
        }
      }
      this.setData({longpressData})
    })
  },
  // 滚动到节点
  pageScrollToDom (type = 'bottom') {
    wx.pageScrollTo({
      selector: type === 'top' ? `#msg0` : `#bottom`
    })
  },
  // 复位
  resetView (e) {
    if ([0, 3, 4].includes(this.data.selectIndex)) {
      this.pageScrollToDom('bottom')
      this.setData({'selectIndex': null})
    }
  },
  // 监听文本域高度变化，随时滚动页面
  linechange (e) {
    let textHeight = e.detail.height
    if (0 < e.detail.lineCount && e.detail.lineCount <= 3) {
      this.pageScrollToDom('bottom')
      this.setData({textHeight})
    }
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
      if (this.data.canSend) this.setData({canSend: false})
    }
  },
  // 编辑完毕 更新一下data.word 状态
  bindblur (e) {
    this.setData({word})
  },
  // 选择编辑类型
  selectType (e) {
    let index = e.currentTarget.dataset.index
    this.setData({'selectIndex': index}, () => {
      this.pageScrollToDom('bottom')
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