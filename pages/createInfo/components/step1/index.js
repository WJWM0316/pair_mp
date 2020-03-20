Component({
  properties: {

  },
  data: {
    formData: {
      avatar_id: '',
      nickname: '',
      gender: 1,
      height: '',
      birth: '',
      resident_str: '',
      address: {}
    },
    canClick: false
  },
  methods: {
    getUserInfo(e) {
      if (e.detail.errMsg === 'getUserInfo:ok') {
        let { userInfo } = e.detail
        let { formData } = this.data
        formData.nickname = userInfo.nickName
        this.setData({ formData })
      }
    },
    getPickerData(e) {
      let { formData } = this.data
      let { key } = e.currentTarget.dataset
      let value = ''
      console.log(key, e.detail)
      switch(key) {
        case 'birth':
          value = e.detail.date
          break
        case 'resident_str':
          value = e.detail.title
          break
      }
      formData[key] = value
      this.setData({ formData })
    },
    setGender(e) {
      let { gender } = e.currentTarget.dataset
      let { formData } = this.data
      if(gender === formData.gender) return
      formData.gender = gender
      this.setData({ formData })
    },
    bindButtonStatus() {
      let { formData } = this.data
      let canClick = formData.avatar_id && formData.gender && formData.nickname && formData.height && formData.birth && formData.resident_str ? true : false
      if(this.data.canClick !== canClick) {
        this.setData({ canClick })
      }
    },
    bindInput(e) {
      let { value } = e.detail
      let { formData } = this.data
      formData.nickname = value
      this.setData({ formData })
    }
  }
})
