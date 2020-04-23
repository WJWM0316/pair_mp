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

// 拼接参数成字符串
const splicingParams = (params) => {
  let string = ''
  for (let i in params) {
    string = `${string}${i}=${params[i]}&`
  }
  string = string.slice(0, string.length-1)
  return string
}
// 获取当前页面完整链接
const getCurrentPagePath = (index = 0) => {
  var pages = getCurrentPages() //获取加载的页面
  index = !index ? pages.length - 1 : pages.length - index
  let pageUrl = pages[index].route
  if (pages[index] && pages[index].options && splicingParams(pages[index].options)) {
    return `/${pageUrl}?${splicingParams(pages[index].options)}`
  } else {
    return `/${pageUrl}`
  }
}

const setIconType = (data) => {
  switch(data.labelId) {
    case 110000:
      data.iconName = 'icon_renshe'
      break
    case 120000:
      data.iconName = 'icon_meishi'
      break
    case 130000:
      data.iconName = 'icon_yundong'
      break
    case 140000:
      data.iconName = 'icon_yinle'
      break
    case 150000:
      data.iconName = 'icon_yingshi'
      break
    case 160000:
      data.iconName = 'icon_shuji'
      break
    case 170000:
      data.iconName = 'icon_erciyuan'
      break
    case 180000:
      data.iconName = 'icon_youxi'
      break
    case 190000:
      data.iconName = 'icon_lvhang'
      break
    default:
      data.iconName = 'icon_lvhang'
      break
  }
}

module.exports = {
  formatTime: formatTime,
  getCurrentPagePath: getCurrentPagePath,
  getSelectorQuery,
  getTitleHeight,
  setIconType
}
