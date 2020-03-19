const app =  getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [
      {
        text: '广场',
        selected: false,
        icon: '',
        selectedIcon: '',
        routerPath: ''
      },
      {
        text: 'pick',
        selected: false,
        icon: '',
        selectedIcon: '',
        routerPath: ''
      },
      {
        text: '消息',
        selected: false,
        icon: '',
        selectedIcon: '',
        routerPath: ''
      }
    ]
  },
  attached () {
    
  
    },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
