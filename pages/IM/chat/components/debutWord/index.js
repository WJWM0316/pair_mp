// pages/IM/chat/components/debutWord/index.js
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value: 'console'
    },
    list: {
      type: Array,
      value: [
        '叮咚，一个有趣的灵魂来造访了叮咚，一个有趣的灵魂来造访了叮咚，一个有趣的灵魂来造访了',
        '叮咚，一个有趣的灵魂来造访了叮咚',
        '叮咚，一个有趣的灵魂来造访了叮咚，一个有趣的灵魂来造访了叮咚，一个有趣的灵魂来造访了',
        '叮咚，一个有趣的灵魂来造访了叮咚，一个有趣的灵魂来造访了叮咚，一个有趣的灵魂来造访了',
        '叮咚，一个有趣的灵魂来造访了叮咚',
        '叮咚，一个有趣的灵魂来造访了叮咚，一个有趣的灵魂来造访了叮咚，一个有趣的灵魂来造访了'
      ]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    selectWord (e) {
      let index = e.currentTarget.dataset.index,
          word  = this.data.list[index]
      this.triggerEvent('selectResult', word)
    },
    tapMpre () {
      this.triggerEvent('tapMpre')
    }
  }
})
