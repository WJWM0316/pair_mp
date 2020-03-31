const app =  getApp();
import {getSelectorQuery, socket, util} from '../../../utils/index.js'
import {getChatDetailApi, getImTopDeatilApi} from '../../../api/im.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    myUid: 22,
    messageList: [],
    selectIndex: null, // 选择发送类型
    longpressData: {},
    othersUserInfo: {},
    mineUserInfo: {},
    imagePath: app.globalData.systemInfo.brand === "devtools" ? '../../../images/emoji/' : './images/emoji/'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.options = options
  },
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    socket.onMessage((res) => {
      let index = this.data.messageList.length - 1
      
    })
  },
  // 发送数据， 先显示再界面上
  sendMsg (e) {
    const that = this
    let index = this.data.messageList.length
    this.setData({[`messageList[${index}]`]: e.detail}, () => {
      wx.nextTick(()=>{
        that.resetView()
        that.selectComponent('#footer').pageScrollToDom('bottom')
      });
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getChatMsg()
    this.getImDetail()
  },
  getChatMsg () {
    getChatDetailApi({vkey: this.options.vkey, count: 11}).then(res => {
      this.setData({messageList: res.data}, () => {
        wx.nextTick(()=>{
          this.selectComponent('#footer').pageScrollToDom('bottom')
        });
      })
    })
  },
  getImDetail () {
    getImTopDeatilApi({vkey: this.options.vkey}).then(res => {
      this.setData({'othersUserInfo': res.data.userInfo, 'mineUserInfo': app.globalData.userInfo.userInfo})
    })
  },
  // 长按功能
  longpress (e) {
    let dataset  = e.currentTarget.dataset,
        own      = dataset.object.imFromUser.uid === this.data.myUid
    getSelectorQuery(`.${dataset.class}`, this).then(res => {
      let longpressData = {
        index: dataset.index
      },
      position = {}
      if (res.top >= 80) {
        if (own) {
          longpressData.style = `right:0;top:-100rpx;`
          longpressData.iconStyle = 'right:45rpx;bottom:-31rpx;'
        } else {
          longpressData.style = `left:0;top:-100rpx;`
          longpressData.iconStyle = 'left:14rpx;bottom:-31rpx;'
        }
      } else {
        if (own) {
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
  // 复位
  resetView (e) {
    let setData = {'longpressData': null}
    if ([0, 3, 4].includes(this.data.selectIndex)) {
      setData.selectIndex = null
    }
    this.setData(setData)
  },
  selectType (e) {
    this.setData({'selectIndex': e.detail})
  },
  // 获取header展开状态
  headerPutUp (e) {
    this.putUp = e.detail
  },
  // 打开开场白
  bindtapMpre (e) {
    this.setData({'selectIndex': 4})
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

  // 页面滚动时执行
  onPageScroll: function(e) {

  },
  
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  
  onPullDownRefresh: function (e) {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})