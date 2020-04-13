import {
  createUserStep1Api
} from '../../../../api/user'
import {getUserInfo, getUserInfoAuth} from '../../../../utils/auth.js'
const app =  getApp();
Component({
  data: {
    formData: {
      nickname: '',
      gender: 1,
      birth: '',
      address: {
        areaId: 0,
        children: [],
        isHot: 0,
        pid: 0,
        title: '',
        topPid: 0,
        default: ''
      },
      avatar: {
        attachType: "",
        attachTypeDesc: "",
        height: 0,
        id: 0,
        middleUrl: '',
        smallUrl: '',
        url: '',
        vkey: '',
        width: 600
      }
    },
    canClick: false,
    isFirst: true
  },
  pageLifetimes: {
    show() {
      let avatar = wx.getStorageSync('avatar')
      let { formData } = this.data
      if (avatar) {
        formData.avatar = avatar
        this.setData({ formData}, () => this.bindButtonStatus())
        setTimeout(() => wx.removeStorageSync('avatar'), 16.7)
      }
    }
  },
  methods: {
    ask(){
      let that = this
      let changeAddress = (res) => {
        app.reverseGeocoder(res).then(({ result }) => {
          let res = result.address_component
          let address = {
            areaId: 0,
            children: [],
            isHot: 0,
            pid: 0,
            title: res.district,
            topPid: 0,
            desc: `${res.province},${res.city},${res.district}`
          }
          let { formData } = that.data
          formData['address'] = address
          that.setData({ formData }, () => that.bindButtonStatus())
        })
      }
      let callback = () => {
        wx.getSetting({
          success(res) {
            let statu = res.authSetting;
            if(!statu['scope.userLocation']) {
              app.wxConfirm({
                  title: '是否授权当前位置',
                  content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                  confirmBack(tip) {
                    wx.openSetting({
                      success(data) {
                        if (data.authSetting["scope.userLocation"] === true) {
                          app.wxToast({
                            title: '授权成功',
                            icon: 'success',
                            duration: 1000,
                            callback() {
                              //授权成功之后，再调用chooseLocation选择地方
                              wx.chooseLocation({
                                success(res) {
                                  changeAddress(res)
                                }
                              })
                            }
                          })
                        } else {
                          app.wxToast({
                            title: '授权失败',
                            icon: 'success',
                            duration: 1000
                          })
                        }
                      },
                      fail() {}
                    })
                  },
                  cancelBack() {
                    that.setData({ isFirst: false })
                  }
                })
            }
          },
          fail(res) {
            that.setData({ isFirst: false })
          }
        })
      }
      wx.chooseLocation({
        success(res) {
          changeAddress(res)       
        },
        fail() {
          callback()
        }
      })
    },
    bindButtonStatus() {
      let { formData } = this.data
      let canClick = formData.nickname && formData.birth && formData.address.title && formData.avatar.url ? true : false
      this.setData({ canClick })
    },
    getUserInfo(e) {
      getUserInfoAuth(e)
      if (e.detail.errMsg === 'getUserInfo:ok') {
        let { userInfo } = e.detail
        let { formData } = this.data
        formData.nickname = userInfo.nickName
        this.setData({ formData }, () => this.bindButtonStatus())
      }
    },
    getPickerData(e) {
      let { formData } = this.data
      let { key } = e.currentTarget.dataset
      let value = ''
      switch(key) {
        case 'birth':
          value = e.detail.date
          break
        case 'address':
          value = Object.assign(e.detail, {default: `${e.detail.topPid}-${e.detail.pid}-${e.detail.areaId}`})
          break
      }
      formData[key] = value
      this.setData({ formData }, () => this.bindButtonStatus())
    },
    setGender(e) {
      let { gender } = e.currentTarget.dataset
      let { formData } = this.data
      if(gender === formData.gender) return
      formData.gender = gender
      this.setData({ formData })
    },
    bindInput(e) {
      let { value } = e.detail
      let { formData } = this.data
      if(value !== formData.nickname) {
        formData.nickname = value
        this.setData({ formData }, () => this.bindButtonStatus())
      }
    },
    next() {
      let { formData } = this.data
      let params = {
        avatar_id: formData.avatar.id,
        nickname: formData.nickname,
        gender: formData.gender,
        birth: formData.birth,
        resident_str: formData.address.desc
      }
      if(!params.nickname.trim()) {
        app.wxToast({title: '没有输入用户名称，请重新填写'})
        return
      }
      if(!params.avatar_id) {
        app.wxToast({title: '请添加封面'})
        return
      }
      if(!params.birth) {
        app.wxToast({title: '请选择生日'})
        return
      }
      if(!params.resident_str) {
        app.wxToast({title: '请选择常驻地'})
        return
      }
      createUserStep1Api(params).then(res => {
        getUserInfo().then(() => {         
          this.triggerEvent('next', true)
        })
      }).catch(err => app.wxToast({title: err.msg}))
    }
  }
})
