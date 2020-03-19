export const setConfig = (appId, envVersion) => {
  let config = {
      APIHOST: "",
      NODEHOST: '',
      WEBVIEW: '',
      CDNPATH: '',
      SOCKETPATH: ''
  } 
  switch (envVersion) {
    case 'develop':
      console.log('开发环境')
      config.CDNPATH = 'https://pickme-uploads-test.oss-cn-shenzhen.aliyuncs.com/miniProject/images/'
      config.SOCKETPATH = 'wss://wss-api.pickme.ziwork.com'
      break
    case 'trial':
      console.log('测试环境(体验版)')
      break
    case 'release':
      console.log('正式环境')
      break
  }
  return config
}
