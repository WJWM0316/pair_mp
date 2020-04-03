const app = getApp()
Component({
  externalClasses: ['my-class', 'my-item-class'],
  properties: {
    status: {
      type: Number,
      value: 0 // 0 不存在 1 正在加载  2 没有更多数据
    },
    hasImg: {
      type: Boolean,
      value: true
    },
    hasMoreSlot: {
      type: Boolean,
      value: false
    },
    listData: {
      type: Array,
      value: []
    },
    desc: {
      type: String,
      value: '暂无数据'
    },
    moreDesc: {
      type: String,
      value: '没有更多数据'
    },
    marginTop: {
      type: Number,
      value: 120
    }
  },
  data: {
    CDNPATH: app.globalData.CDNPATH,
  },
  attached() {
  },
  methods: {

  }
})
