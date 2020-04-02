export const setConfig = (appId, envVersion) => {
  let config = {
      APIHOST: "",
      NODEHOST: '',
      WEBVIEW: '',
      CDNPATH: '',
      SOCKETHOST: '',
      PAGEPATH: '/pages',
      
  } 
  switch (envVersion) {
    case 'develop':
      console.log('开发环境')
      config.APIHOST = 'https://mini-api.pickme.ziwork.com'
      config.CDNPATH = 'https://attach.pickme.ziwork.com/miniProject/images/'
      config.SOCKETHOST = 'wss://wss-api.pickme.ziwork.com'
      break
    case 'trial':
      console.log('测试环境(体验版)')
      config.APIHOST = 'https://mini-api.pickme.ziwork.com'
      config.CDNPATH = 'https://attach.pickme.ziwork.com/miniProject/images/'
      config.SOCKETHOST = 'wss://wss-api.pickme.ziwork.com'
      break
    case 'release':
      console.log('正式环境')
      break
  }
  return config
}
