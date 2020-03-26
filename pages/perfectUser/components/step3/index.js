Component({
  properties: {

  },
  data: {
    formData: {
      ideal_describe: '',
      own_describe: ''
    }
  },
  methods: {
    bindInput(e) {
      let { formData } = this.data
      let { value } = e.detail
      let { key } = e.currentTarget.dataset
      if(value !== formData[key]) {
        formData[key] = value
        this.setData({ formData, canClick: true })
      }
    }
  }
})
