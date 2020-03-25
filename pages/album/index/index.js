const app = getApp()
Page({
  data: {
    show: false,
    itemList: [
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
  },
  open(e) {
    let params = e
    this.setData({ show: true})
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
      default:
        break
    }
  }
})