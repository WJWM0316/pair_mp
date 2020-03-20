let height = []
for(let i = 100; i <= 300; i++) {
  height.push(i)
}
Component({
  properties: {

  },
  data: {
    height
  },
  methods: {
    scroll(e) {
      console.log(e)
    }
  }
})
