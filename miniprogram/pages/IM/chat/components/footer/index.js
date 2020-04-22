const app =  getApp();
import {getSelectorQuery, socket} from '../../../../../utils/index.js'

let word = '',
    hasAuth = false,
    isDeny = false
Component({
  externalClasses: ['my-class'],
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    selectIndex: null,
    vkey: String,
    mineUserInfo: Object,
    chatDetail: Object
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
    textHeight: 20, // 编辑框高度
    canSend: false, // 激活发送按钮, 因为编辑过程不更新data.word， 防止抖动。
    imSendMsg: 0, // 记录订阅状态
  },

  word: '',
  /**
   * 组件的方法列表
   */

  pageLifetimes: {
    async show() {
      app.getSubscribeTime({types: 'imSendMsg'}).then(res => this.setData({imSendMsg: res.times.imSendMsg}))
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.record']) {
            hasAuth = true
          } else {
            hasAuth = false
          }
        }
      })
    }
  },
  methods: {
    subscribe() {
      app.subscribeMessage('imSendMsg').then(() => {
        app.recordSubscribeTime({type: 'imSendMsg', expire: 1000 * 60 * 60 * 24 * 3}).then(() => {
          this.setData({imSendMsg: 1})
          this.sendText()
        })     
      }).catch(() => {})
    },
    // 监听文本域高度变化，随时滚动页面
    linechange (e) {
      console.log(e, 111)
      if (e.detail.lineCount <= 3) {
        let textHeight = e.detail.height
        this.pageScrollToDom('bottom').then(res => {
          this.setData({textHeight})
        })
      }
    },
    // 选择emoji 或者 出场白
    selectResult (e) {
      this.word = this.word ?  `${this.word}${e.detail}` : e.detail
      let canSend = this.data.chatDetail.blackInfo.beBlacked || this.data.chatDetail.blackInfo.blacked ? false : true
      this.setData({'word': this.word, canSend}) 
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
      this.pageScrollToDom()
    },
    // 选择编辑类型
    selectType (e) {
      let index = e.currentTarget.dataset.index
      let nextFun = () => {
        this.pageScrollToDom('bottom').then(() => {
          this.setData({'selectIndex': index}, () => {
            wx.nextTick(()=>{
              this.pageScrollToDom('bottom')
            });
            this.triggerEvent('selectType', index)
            if (index === 1 || index === 2) {
              this.sendMsg('img')
            }
          })
        })
      }
      if (index === 0) {
        let that = this
        if (!hasAuth) {
          if (isDeny) {
            app.globalData.lockonShow = true
            wx.openSetting()
          } else {
            wx.getSetting({
              success(res) {
                if (!res.authSetting['scope.record']) {
                  wx.authorize({
                    scope: 'scope.record',
                    success () {
                      hasAuth = true
                      isDeny = false
                      nextFun()
                    },
                    fail (err) {
                      hasAuth = false
                      isDeny = true
                    }
                  })
                } else {
                  hasAuth = true
                }
              }
            })
          }
        } else {
          nextFun()
        }
      } else {
        nextFun()
      }
    },
    // 滚动到节点
    pageScrollToDom (type = 'bottom') {
      return new Promise((resolve, reject) => {
        wx.pageScrollTo({
          duration: 1,
          selector: type === 'top' ? `#msg0` : `#bottomBlock`,
          success: (res) => {
            resolve(res)
          }
        })
      })
    },
    getRecord (e) {
      this.sendMsg('record', e.detail)
    },
    // 发送文本
    sendText () {
      if (!this.data.canSend) return
      this.sendMsg('text')
      this.word = ''
      this.setData({'word': this.word, 'canSend': false})
    },
    sendMsg (type, content) {
      if (socket.readyState() !== 1) {
        socket.testSocket()
        return
      }
      const that = this
      let timestamp = new Date().getTime()
      let parmas = {
        cmd: "send.im",
        data: {
          toVkey: this.data.vkey
        }
      },
      msgData = {
        "imFromUser": {
          "uid":  this.data.mineUserInfo.id,
          "vkey":  this.data.mineUserInfo.vkey,
          "sendTimestamp": timestamp,
          "avatarUrl": this.data.mineUserInfo.avatarInfo.middleUrl
        },
        "imData": {
          'localSend': true,
          "channelType": "PERSON",
          "msgTimestamp": timestamp,
          "timestamp": timestamp,
          "content": ''
        }
      }
      switch (type) {
        case 'text':
          parmas.data = {
            ...parmas.data,
            msgType: "RC:TxtMsg", 
            content: {
              content: this.word,
              sendTimestamp: timestamp
            }
          }
          msgData.msgType = 'RC:TxtMsg'
          msgData.imData.content = {content: this.word, sendTimestamp: timestamp}
          that.triggerEvent('sendMsg', msgData)
          socket.send(parmas)
          break
        case 'img':
          app.globalData.lockonShow = true
          wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: that.data.selectIndex === 1 ? ['album'] : ['camera'],
            success (res) {
              res.tempFiles.forEach((file) => {
                msgData.msgType = 'RC:ImgMsg'
                msgData.imData.content = {imageUri: file.path, sendTimestamp: timestamp}
                that.triggerEvent('sendMsg', msgData)
                app.uploadFile(file).then(res0 => {
                  parmas.data = {
                    ...parmas.data,
                    msgType: "RC:ImgMsg", 
                    content: {
                      content: res0.data.attachListItem[0].smallUrl,
                      imageUri: res0.data.attachListItem[0].url
                    }
                  }
                  socket.send(parmas)
                })
              })
            },
            fail(err) {
              console.log(err)
            }
          })
          break
        case 'record':
          msgData.msgType = 'RC:VcMsg'
          msgData.imData.content = {fileUrl: content.tempFilePath, duration: content.duration, fileSize: content.fileSize, sendTimestamp: timestamp}
          that.triggerEvent('sendMsg', msgData)
          app.uploadFile(content, 'audio').then(res0 => {
            parmas.data = {
              ...parmas.data,
              msgType: "RC:VcMsg", 
              content: {
                content: '音频',
                duration: content.duration,
                fileUrl: res0.data.attachListItem[0].url
              }
            }
            socket.send(parmas)
          }).catch(e => {
          })
          break
      }
    }
  }
})
