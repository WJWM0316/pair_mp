import {
  addAlbumApi
} from '../../api/user.js'
const app = getApp()
Page({
  data: {
    show: false,
    itemList: [],
    result: {},
    type: '',
    navBarHeight: app.globalData.navBarHeight,
    cover: {},
    userInfo: {}
  },
  onShow() {
    let avatar = wx.getStorageSync('avatar')
    let userInfo = wx.getStorageSync('userInfo')
    if(avatar) {
      this.setData({cover: avatar}, () => wx.removeStorageSync('avatar'))
    }
    if(userInfo) {
      this.setData({userInfo}, () => wx.removeStorageSync('userInfo'))
    }
  },
  open(e) {
    let itemList = [
      {text: '设置为封面', action: 'set'},
      {text: '删除图片', action: 'delete'},
      {text: '取消', action: 'cancle'}
    ]
    let params = e
    this.setData({ show: true, itemList, type: ''})
  },
  upload(e) {
    let itemList = [
      {text: '从相册选择相片', action: 'photo'},
      {text: '拍摄', action: 'camera'},
      {text: '取消', action: 'cancle'}
    ]
    let params = e
    this.setData({ show: true, itemList, type: 'photo'})
  },
  addAlbum(id) {
    let { cover, userInfo } = this.data
    let photo = userInfo.userAlbumTempList.join(',')
    addAlbumApi({cover: cover.id, photo}).then(res => {

    })
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
        app.chooseImageUpload(1, true).then(res => {
          let { PAGEPATH } = app.globalData
          wx.navigateTo({
            url: `${PAGEPATH}/cutInside/cutInside?src=${res.path}`
          })
        })
        break
      case 'camera':
        that.setData({ show: false})
        app.photoUpload(true).then(({ data }) => {
          let { PAGEPATH } = app.globalData
          wx.navigateTo({
            url: `${PAGEPATH}/cutInside/cutInside?src=${res.path}`
          })
        })
        break
      default:
        break
    }
  }
})