const app = getApp()
Page({
  data: {
    show: false,
    itemList: []
  },
  open1(e) {
    let itemList = [
      {
        text: '设置为封面',
        action: 'set'
      },
      {
        text: '删除图片',
        action: 'delete'
      },
      {
        text: '取消',
        action: 'cancle'
      }
    ]
    let params = e
    this.setData({ show: true, itemList})
  },
  open2(e) {
    let itemList = [
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
    let params = e
    this.setData({ show: true, itemList})
  },
  drawerAction(e) {
    let detail = e.detail
    let that = this
    switch(detail.action) {
      case 'delete':
        that.setData({ show: false})
        app.wxConfirm({
          title: '删除图片',
          content: '确定删除该图片吗？删除后将无法恢复图片。',
          cancelText: '取消',
          confirmText: '确认',
          confirmBack() {
            console.log(1)
          },
          cancelBack() {
            console.log(2)
          }
        })
        break
      case 'set':
        app.wxConfirm({
          title: '设置封面',
          content: '部分接口包括',
          cancelText: '取消',
          confirmText: '确认',
          confirmBack() {
            console.log(1)
          },
          cancelBack() {
            console.log(2)
          }
        })
        break
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