Page({
	data: {
		value: '170'
	},
  resultEvent(e) {
  	if(e.detail.value !== this.data.value) {
  		this.setData({value: e.detail.value}, () => wx.vibrateShort())
  		console.log(e)
  	}
  }
})