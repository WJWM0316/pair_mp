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
    userInfo: {},
    editIndex: 0
  },
  onShow() {
    let avatar = wx.getStorageSync('avatar')
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      let cover = userInfo.userAlbumTempList.find(v => v.isCover)
      this.setData({userInfo, cover}, () => wx.removeStorageSync('userInfo'))
    }
    if(avatar) {
      let { userInfo } = this.data
      userInfo.userAlbumTempList.push(avatar)
      avatar = Object.assign(avatar, {isCover: 0})
      this.setData({result: avatar, userInfo}, () => wx.removeStorageSync('avatar'))
    }
  },
  open(e) {
    let itemList = [
      {text: '设置为封面', action: 'set'},
      {text: '删除图片', action: 'delete'},
      {text: '取消', action: 'cancle'}
    ]
    let { index } = e.currentTarget.dataset
    this.setData({ show: true, itemList, type: '', editIndex: index})
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
    let { userInfo, cover } = this.data
    let userAlbumTempList = userInfo.userAlbumTempList
    userAlbumTempList = userAlbumTempList.filter(v => !v.isCover)
    let photoIds = userAlbumTempList.map(v => v.id)
    let photo = photoIds.join(',')
    addAlbumApi({cover: cover.id, photo}).then(res => {
      wx.navigateBack({ delta: 1 })
    }).catch(err => app.wxToast({title: err.msg}))
  },
  setCover() {
    let { userInfo, editIndex } = this.data
    let userAlbumTempList = userInfo.userAlbumTempList
    let cover = userAlbumTempList[editIndex]
    userAlbumTempList.splice(editIndex, 1)
    let photoIds = userAlbumTempList.map(v => v.id)
    let photo = photoIds.join(',')
    addAlbumApi({cover: cover.id, photo}).then(res => {
      wx.navigateBack({ delta: 1 })
    }).catch(err => app.wxToast({title: err.msg}))
  },
  delete() {
    let { userInfo, editIndex, cover } = this.data
    let userAlbumTempList = userInfo.userAlbumTempList
    userAlbumTempList.splice(editIndex, 1)
    userAlbumTempList = userAlbumTempList.filter(v => v.id !== cover.id)
    let photoIds = userAlbumTempList.map(v => v.id)
    let photo = photoIds.join(',')
    addAlbumApi({cover: cover.id, photo}).then(res => {
      wx.navigateBack({ delta: 1 })
    }).catch(err => app.wxToast({title: err.msg}))
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
            that.delete()
          },
          cancelBack() {
            // console.log(2)
          }
        })
        break
      case 'set':
        that.setCover()
        break
      case 'photo':
        that.setData({ show: false})
        app.chooseImageUpload(1, true).then(res => {
          let { PAGEPATH } = app.globalData
          wx.navigateTo({
            url: `${PAGEPATH}/cutInside/index?src=${res.path}`
          })
        })
        break
      case 'camera':
        that.setData({ show: false})
        app.photoUpload(true).then(({ data }) => {
          let { PAGEPATH } = app.globalData
          wx.navigateTo({
            url: `${PAGEPATH}/cutInside/index?src=${res.path}`
          })
        })
        break
      default:
        break
    }
  }
})