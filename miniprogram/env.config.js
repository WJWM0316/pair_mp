export const setConfig = (appId, envVersion) => {
  let config = {
      APIHOST: "",
      NODEHOST: '',
      WEBVIEW: '',
      CDNPATH: '',
      SOCKETHOST: '',
      PAGEPATH: '/pages',
  } 
  let pro = () => {
    config.APIHOST    = 'https://mini-api.pickme.xin'
    config.CDNPATH    = 'https://attach.pickme.xin/miniProject/images/'
    config.SOCKETHOST = 'wss://wss-api.pickme.xin'
    config.WEBVIEW    = 'https://h5.pickme.xin'
  }
  let dev = () => {
    config.APIHOST    = 'https://mini-api.pickme.ziwork.com'
    config.CDNPATH    = 'https://attach.pickme.ziwork.com/miniProject/images/'
    config.SOCKETHOST = 'wss://wss-api.pickme.ziwork.com'
    config.WEBVIEW    = 'https://h5.pickme.ziwork.com'
  }

  // appId=wx1d4bb0e66fe05efd 正式号
  // appid=wx9279d02eb84e4fa7 测试号
  if (appId === 'wx1d4bb0e66fe05efd') {
    pro()
  } else {
    dev()
  }
  return config
}
