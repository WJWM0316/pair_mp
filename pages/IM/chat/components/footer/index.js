const app =  getApp();
let word = ''
import {getSelectorQuery} from '../../../../../utils/util.js'

Component({
  externalClasses: ['my-class'],
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    selectIndex: null
  },

  /**
   * 组件的初始数据
   */
  data: {
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
    word: '', // 编辑框的文本
    textHeight: 0, // 编辑框高度
    canSend: false, // 激活发送按钮, 因为编辑过程不更新data.word， 防止抖动。
  },

  /**
   * 组件的方法列表
   */
  methods: {
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
    bindfocus () {
      this.pageScrollToDom('bottom')
    },
    // 选择编辑类型
    selectType (e) {
      let index = e.currentTarget.dataset.index
      this.setData({'selectIndex': index}, () => {
        this.triggerEvent('selectType', index)
        this.pageScrollToDom('bottom')
      })
    },
    // 滚动到节点
    pageScrollToDom (type = 'bottom') {
      wx.pageScrollTo({
        duration: 100,
        selector: type === 'top' ? `#msg0` : `#bottom`
      })
    },
  }
})
