// components/layout/image/index.js
Component({
  externalClasses: ['my-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    src: {
      type: String,
      value: ''
    },
    hasLodingImg: {
      type: Boolean,
      value: true
    },
    hasErrorImg: {
      type: Boolean,
      value: true
    },
    borderRadius: String,
    placeholder: {
      type: String,
      value: '../../../styles/bg_24hinfro_banner@2x.png'
    },
    errorPath: {
      type: String,
      value: '../../../styles/bg_24hinfro_banner@2x_new.jpg'
    },
    styleString: {
      type: String,
      value: ''
    },
    mode: {
      type: String,
      value: 'scaleToFill'
    },
    lazyLoad: {
      type: Boolean,
      value: true
    },
    showMenu: {
      type: Boolean,
      value: false
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    loading: true,
    reRender: true,
    error: false
  },
  attached () {
    
  },
  /**
   * 组件的方法列表
   */
  methods: {
    loadCallback (e) {
      this.triggerEvent('loadSuccess', e)
      this.setData({'loading': false})
    },
    errCallback(e) {
      this.triggerEvent('loadFail', e)
      this.setData({'error': true})
    }
  }
})
