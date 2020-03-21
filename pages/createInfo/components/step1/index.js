import {
  createUserStep1Api
} from '../../../../api/user'
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
    canClick: false
  },
  ready() {
    console.log(111)
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
    bindButtonStatus() {
      let { formData } = this.data
      let canClick = formData.nickname && formData.birth && formData.address.areaId && formData.avatar.url ? true : false
      if(canClick !== this.data.canClick) {
        this.setData({ canClick })
      }
    },
    getUserInfo(e) {
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
      createUserStep1Api(params).then(res => {
        this.triggerEvent('next', true)
      }, err => {
        app.wxToast({title: err.msg})
      })
    }
  }
})
