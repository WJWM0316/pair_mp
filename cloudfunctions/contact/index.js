const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  let callBack = {}
  if (event.SessionFrom) {
    SessionFrom = JSON.parse(event.SessionFrom)
    let {token, path, type, title} = SessionFrom
    switch (type) {
      case 'recharge':
        callBack = {
          msgtype: 'link',
          link: {
            title: '充值',
            description: '这个问题充钱就可以解决！',
            url: `https://h5.pickme.ziwork.com/art/wxpay/index.html?token=${token}`,
            thumb_url: 'https://attach.pickme.ziwork.com/avatar/2020/0330/15/5e819c718f3cc.jpg'
          }
        }
        break
    }
  }

  const { OPENID } = cloud.getWXContext()

  const result = await cloud.openapi.customerServiceMessage.send({
    touser: OPENID,
    msgtype: callBack.msgtype,
    link: callBack.link
  })

  console.log(result)

  return result
}
