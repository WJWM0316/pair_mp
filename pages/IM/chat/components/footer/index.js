const app =  getApp();
import {getSelectorQuery, socket, emoji} from '../../../../../utils/index.js'

let word = ''
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
    toVkey: 'x2njbxhm',
    word: '', // 编辑框的文本
    textHeight: 0, // 编辑框高度
    canSend: false, // 激活发送按钮, 因为编辑过程不更新data.word， 防止抖动。
  },
  attached () {
    console.log(emoji, 11111111)
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
      this.word = word + e.detail
      this.setData({'word': this.word, canSend: true}) 
    },
    // 文本域编辑
    bindinput (e) {
      this.word = e.detail.value
      if (this.word) {
        if (!this.data.canSend) this.setData({canSend: true})
      } else {
        if (this.data.canSend) this.setData({canSend: false})
      }
    },
    // 编辑完毕 更新一下data.word 状态
    bindblur (e) {
      this.setData({'word': this.word})
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
        if (index === 1) {
          app.chooseImageUpload().then(res => {
            let data = res.data.attachListItem[0]
            this.sendMsg('img', data)
          })
        } else if (index === 2) {
          app.photoUpload().then(res => {
            let data = res.data.attachListItem[0]
            this.sendMsg('img', data)
          })
        }

      })
    },
    // 滚动到节点
    pageScrollToDom (type = 'bottom') {
      wx.pageScrollTo({
        duration: 200,
        selector: type === 'top' ? `#msg0` : `#bottomBlock`
      })
    },
    // 发送文本
    sendText () {
      if (!this.data.canSend) return
      this.sendMsg('text')
      this.word = ''
      this.setData({'word': this.word, 'canSend': false})
    },
    sendMsg (type, content) {
      let timestamp = new Date().getTime()
      let parmas = {
        cmd: "send.im"
      },
      msgData = {
        "imFromUser": {
          "uid": "3",
          "name": "wxian_b",
          "avatarUrl": "https:\/\/attach.pickme.ziwork.com\/default\/man.png",
          "uuid": "PickMeTest_dbzpi31r"
        },
        "imData": {
          'sending': true,
          "channelType": "PERSON",
          "msgTimestamp": timestamp,
          "timestamp": timestamp,
          "objectName": "RC:TxtMsg",
          "content": '',
          "msgUID": "BH3B-U1N8-OIM7-EIL5"
        }
      }
      switch (type) {
        case 'text':
          parmas.data = {
            toVkey: this.data.toVkey, 
            msgType: "RC:TxtMsg", 
            content: {
              content: this.word,
              sendTimestamp: timestamp
            }
          }
          msgData.msgType = 'RC:TxtMsg'
          console.log(emoji.init(this.word), 222222222222)
          msgData.imData.content = {content: emoji.init(this.word)}
          break
        case 'img':
          parmas.data = {
            toVkey: this.data.toVkey, 
            msgType: "RC:ImgMsg", 
            content: {
              content: "",
              imageUri: content.url
            }
          }
          msgData.msgType = 'RC:ImgMsg'
          msgData.imData.content = {imageUri: content.url}
          break
      }
      socket.send(parmas)
      this.triggerEvent('sendMsg', msgData)
    }
  }
})
