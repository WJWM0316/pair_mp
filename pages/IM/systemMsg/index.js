// pages/IM/systemMsg/index.js
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
          text: '欢迎来到PICKME！使用过程中有任何问题可以点击意见反馈与我们联系。'
        }
      },
      {
        messageId: "messageId0",
        timestamp: '1585033928',
        path: 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/d03e7897d4ee5c55ad392292ffd88bf.jpg',
        data: {
          type: 'text',
          text: '测'
        }
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(11111111111111111111)
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