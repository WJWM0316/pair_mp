import localstorage from './localstorage.js'
class Socket {
  constructor () {
    this.apartTime = 60000 // 极限时间，超过极限时间视为异常处理
    this.heartTime = 30000 // 心跳检测时间间隔
    this.receiveMessageTimer = null // 检测接受信息时间的定时器，超过极限时间说明发生异常
    this.keepAliveTimer = null // 检测心跳包的定时器
    this.reConnectTimer = null // 重连定时器
    this.hasCreated = false
    this.cb         = null // 监听类型回调事件
  }
  create (url, token) {
    this.url = url
    this.SocketTask = wx.connectSocket({
      url: url,
      header:{
        'content-type': 'application/json'
      },
      success: (res) => {
        // 握手环节
        wx.onSocketOpen((res0) => {
          console.log(`======websocket已连接======`)
          this.login(localstorage.get('token'))
          this.resetTimes = 0 // 重置重连机会
          if (this.SocketTask.readyState === 1) { // 为1表示连接处于open状态
            this.hasCreated = true
            this.onMessage(this.cb)
            this.checkConnect() // 开启心跳包检测
          }
          // 一分钟没收到信息，代表服务器出问题了，关闭连接。如果收到消息了，重置该定时器。
          this.checkResolve()
        })
        wx.onSocketError((err) => {
          this.reConnect()
          console.log(`======websocket出现异常======`, err)
        })
        wx.onSocketClose((err) => {
          this.reConnect()
          console.log(`======websocket已关闭======`, err)
        })
      },
      fail: (err) => {
        console.log(err)
      }
    })
  }
  send (data) {
    return new Promise((resolve, reject) => {
      wx.sendSocketMessage({
        data: JSON.stringify(data),
        fail: (err) => {
          console.log(`======websocket消息发送失败======`, err)
          this.reConnect()
        },
        success: (res) => {
          resolve(res)
        }
      })
    })
  }
  readyState () {
    return this.SocketTask.readyState
  }
  login (token) {
    let data = {
      cmd: 'login.token',
      token,
      data: {}
    }
    this.send(data)
  }
  onMessage (callback) {
    this.cb = callback
    wx.onSocketMessage((res) => {
      // 收到消息，重置接收消息定时器, 因为已开启心跳检查，保证间隔发送消息出去
      this.checkResolve()
      let data = res.data
      if (res.data === 'a') return // 心跳包的不需要监听
      data = JSON.parse(data)
      if (data.cmd === 'login.token' || data.msgType === 'RC:ReadNtf' || data.msgType === 'PSYS:ReadNtf') return
      if (!data.cmd && data.imData) {
        if (typeof data.imData.content === 'string') data.imData.content = JSON.parse(data.imData.content)
      }
      if (this.cb) this.cb(data)
    })
  }
  close () {
    this.SocketTask.close()
  }
  // 用于心跳包检测websocket
  checkConnect () {
    clearInterval(this.keepAliveTimer)
    this.keepAliveTimer = setInterval(() => { // 开启心跳检查
      this.send('q')
      this.lastTealthTime = new Date().getTime()
    }, this.heartTime)
  }
  // 超过极限时间还没有收到信息，尝试重连
  checkResolve = () => {
    clearTimeout(this.receiveMessageTimer)
    this.receiveMessageTimer = setTimeout(() => {
      console.log('======websocket服务端异常，准备重连！======')
      this.reConnect()
    }, this.apartTime)
  }
  // 断线重连
  reConnect () {
    clearTimeout(this.reConnectTimer)
    this.reConnectTimer = setTimeout(() => {
      console.log(`======websocket正在重连======`)
      clearInterval(this.keepAliveTimer)
      clearTimeout(this.receiveMessageTimer)
      this.create(this.url)
    }, 500)
  }
  // 检测socket是否正常，不正常就重连
  testSocket () {
    if (this.readyState() !== 1) {
      this.reConnect()
    }
  }
}

export default new Socket()