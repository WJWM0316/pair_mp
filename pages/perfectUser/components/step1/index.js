Component({
  properties: {

  },
  data: {
    salary: 2,
    canClick: false,
  },
  methods: {
    next() {
      let params = {
        salary: this.data.salary
      }
      updateUserSalaryApi(params).then(res => {
        this.triggerEvent('next', true)
      }).catch(err => app.wxToast({title: err.msg}))
    },
  }
})
