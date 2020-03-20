import {
  createUserStep2Api
} from '../../../../api/user'
import {
  wxToast
} from '../../../../utils/func.js'
let list = []
for(let i = 100; i <= 300; i++) {
  list.push(i)
}
Component({
  data: {
    list,
    height: '170'
  },
  methods: {
    scroll(e) {
      console.log(e)
    },
    save() {
      createUserStep2Api({height: this.data.height}).then(() => {
        this.triggerEvent('next', true)
      }, err => {
        wxToast({title: err.msg})
      })
    }
  }
})
