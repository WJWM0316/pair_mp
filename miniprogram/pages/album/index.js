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
    editIndex: 0,
    albumVerifyInfo: {
      status: 0,
      statusDesc: '相册审核中…'
    },
    showStatus: true
  },
  close() {
    this.setData({ showStatus: false })
  },
  init() {
    let callback = () => {
      let { userInfo, albumVerifyInfo } = app.globalData.userInfo
      let cover = null
      if(albumVerifyInfo.status === 1) {
        cover = userInfo.userAlbumList.find(v => v.isCover)
      } else {
        cover = userInfo.userAlbumTempList.find(v => v.isCover)
      }
      this.setData({
        userInfo,
        albumVerifyInfo,
        cover
      })
    }
    if (app.globalData.userInfo) {
      callback()
    } else {
      app.getUserInfo = () => callback()
    }
  },
  onShow() {    
    this.init()
    let avatar = wx.getStorageSync('avatar')
    if(avatar) {
      let { userInfo, albumVerifyInfo } = this.data
      if(albumVerifyInfo.status === 1) {
        userInfo.userAlbumList.push(avatar)
      } else {
        userInfo.userAlbumTempList.push(avatar)
      }
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
  addAlbum() {
    let { userInfo, cover, albumVerifyInfo } = this.data
    let userAlbumTempList = albumVerifyInfo.status === 1 ? userInfo.userAlbumList : userInfo.userAlbumTempList
    userAlbumTempList = userAlbumTempList.filter(v => !v.isCover)
    let photoIds = userAlbumTempList.map(v => v.id)
    let photo = photoIds.join(',')
    console.log(userInfo, cover, albumVerifyInfo)
    addAlbumApi({cover: cover.id, photo}).then(res => {
      wx.navigateBack({ delta: 1 })
    }).catch(err => app.wxToast({title: err.msg}))
  },
  setCover() {
    let { userInfo, editIndex, albumVerifyInfo } = this.data
    let userAlbumTempList = albumVerifyInfo.status === 1 ? userInfo.userAlbumList : userInfo.userAlbumTempList
    let item = userAlbumTempList[editIndex]
    userAlbumTempList.splice(editIndex, 1)
    let photoIds = userAlbumTempList.map(v => v.id)
    let photo = photoIds.join(',')
    addAlbumApi({cover: item.id, photo}).then(() => {
      let { userInfo } = app.globalData.userInfo
      userInfo.userAlbumTempList.push(item)
      userInfo.userAlbumTempList.map(v => {
        v.isCover = false
        if(v.id == item.id) {
          v = item
          v.isCover = true
          app.globalData.userInfo.albumVerifyInfo.status = 0
          console.log(1)
          this.setData({ cover: item }, () => {            
            this.init()
          })
        }
      })
      // wx.navigateBack({ delta: 1 })
    }).catch(err => app.wxToast({title: err.msg}))
  },
  delete() {
    let { userInfo, editIndex, cover, albumVerifyInfo } = this.data
    let userAlbumTempList = albumVerifyInfo.status === 1 ? userInfo.userAlbumList : userInfo.userAlbumTempList
    let item = userAlbumTempList.splice(editIndex, 1)
    userAlbumTempList = userAlbumTempList.filter(v => v.id !== cover.id)
    let photoIds = userAlbumTempList.map(v => v.id)
    let photo = photoIds.join(',')
    addAlbumApi({cover: cover.id, photo}).then(() => {
      let { userInfo } = app.globalData.userInfo
      userInfo.userAlbumTempList.splice(editIndex, 1)
      app.globalData.userInfo.albumVerifyInfo.status = 0
      this.init()
      // wx.navigateBack({ delta: 1 })
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
        app.photoUpload(true).then(res => {
          let { PAGEPATH } = app.globalData
          wx.navigateTo({
            url: `${PAGEPATH}/cutInside/index?src=${res.path}`
          })
        })
        break
      default:
        break
    }
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh()
  },
})