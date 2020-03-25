const app = getApp()
Page({
  data: {
    show: false,
    itemList: [
      {
        text: '从相册选择相片',
        action: 'photo'
      },
      {
        text: '拍摄',
        action: 'camera'
      },
      {
        text: '取消',
        action: 'cancle'
      }
    ]
  },
  open(e) {
    let params = e
    this.setData({ show: true})
    console.log(1)
  },
  drawerAction(e) {
    let detail = e.detail
    let that = this
    switch(detail.action) {
      case 'photo':
        that.setData({ show: false})
        app.chooseImageUpload(1).then(({ data }) => {
          let result = data.attachListItem[0]
          console.log(result)
        })
        break
      case 'camera':
        that.setData({ show: false})
        app.photoUpload(1).then(({ data }) => {
          let result = data.attachListItem[0]
          console.log(result)
        })
        break
      default:
        break
    }
  }
})