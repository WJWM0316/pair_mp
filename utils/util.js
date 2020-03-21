const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getSelectorQuery = (selector, that) => {
  return new Promise((resolve, reject) => {
    if (!that) {
      wx.createSelectorQuery().select(selector).fields({
        rect: true,
        dataset: true,
        size: true,
        scrollOffset: true
      }, function(res){
        // res.dataset    // 节点的dataset
        // res.width      // 节点的宽度
        // res.height     // 节点的高度
        // res.scrollLeft // 节点的水平滚动位置
        // res.scrollTop  // 节点的竖直滚动位置
        // res.scrollX    // 节点 scroll-x 属性的当前值
        // res.scrollY    // 节点 scroll-x 属性的当前值
        resolve(res)
      }).exec()
    } else {
      wx.createSelectorQuery().in(that).select(selector).fields({
        rect: true,
        dataset: true,
        size: true,
        scrollOffset: true
      }, function(res){
        // res.dataset    // 节点的dataset
        // res.width      // 节点的宽度
        // res.height     // 节点的高度
        // res.scrollLeft // 节点的水平滚动位置
        // res.scrollTop  // 节点的竖直滚动位置
        // res.scrollX    // 节点 scroll-x 属性的当前值
        // res.scrollY    // 节点 scroll-x 属性的当前值
        resolve(res)
      }).exec()
    }
  })
}

// 计算标签栏高度
const getTitleHeight = (that) => {
  let rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null; //胶囊按钮位置信息
  let gap = rect.top - that.globalData.systemInfo.statusBarHeight; //动态计算每台手机状态栏到胶囊按钮间距
  return 2 * gap + rect.height;
}

module.exports = {
  formatTime: formatTime,
  getSelectorQuery,
  getTitleHeight
}
