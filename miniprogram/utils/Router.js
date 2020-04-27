
// https://www.cnblogs.com/zhuanzhuanfe/p/9702656.html
class Router {

  constructor(options) {
    this.routes = getCurrentPages()
  }

  switchTab({
    before = function() {},
    url = '',
    success = function() {},
    fail = function() {},
    complete = function() {}
  } = options) {
    this.checkParams(arguments[0])
    before()
    wx.switchTab({
      url,
      success,
      fail,
      complete
    })
  }

  reLaunch({
    before = function() {},
    url = '',
    success = function() {},
    fail = function() {},
    complete = function() {}
  } = options) {
    this.checkParams(arguments[0])
    before()
    wx.navigateBack({
      url,
      success,
      fail,
      complete
    })
  }

  redirectTo({
    before = function() {},
    url = '',
    success = function() {},
    fail = function() {},
    complete = function() {}
  } = options) {
    this.checkParams(arguments[0])
    before()
    wx.redirectTo({
      url,
      success,
      fail,
      complete
    })
  }

  navigateTo({
    before = function() {},
    events = {},
    url = '',
    success = function() {},
    fail = function() {},
    complete = function() {}
  } = options) {
    this.checkParams(arguments[0])
    before()
    wx.navigateTo({
      url,
      events,
      success,
      fail,
      complete
    })
  }

  navigateBack({
    delta = 1,
    before = function() {},
    success = function() {},
    fail = function() {},
    complete = function() {}
  } = options) {
    this.checkParams(arguments[0])
    before()
    wx.navigateBack({
      delta,
      success,
      fail,
      complete
    })
  }

  checkParams(options) {
    let params = ['before', 'success', 'fail', 'complete']
    Object.keys(options).map(key => {
      if(params.includes(key) && Object.prototype.toString.call(options[key]) !== '[object Function]') {
        throw new Error(`${key}必须是function类型`) 
      }
    })
  }
  route() {}
}

export default new Router()