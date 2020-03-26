Component({
  properties: {

  },
  data: {
    list: [],
    labels: []
  },
  pageLifetimes: {
    show() {
      getLabelListApi().then(({ data }) => {
        data.map((v,i) => v.active = !i ? true : false)
        this.setData({list: data})
      })
    }
  },
  methods: {
    tabClick(e) {
      let { index } = e.currentTarget.dataset
      let { dom } = e.currentTarget.dataset
      let { list } = this.data
      let callback = () => {
        getSelectorQuery(dom).then(res => {
          this.scrollTop = res.top - 60 + this.scrollTop
          wx.pageScrollTo({
            scrollTop,
            duration: 300
          })
        })
      }
      list.map((v, i, a) => {
        v.active = false
        if(i === index) {
          v.active = true
          callback()
        }
      })
      this.setData({ list })
    },
    next() {
      let { labels } = this.data
      let params = {
        label_id: labels.join(',')
      }
      addLabelApi(params).then(res => {
        this.triggerEvent('next', true)
      }).catch(err => app.wxToast({title: err.msg}))
    },
  }
})
