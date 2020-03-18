// import { getAreaListApi } from '../../../../../../api/pages/label.js'
// import { getDegreeApi } from '../../../../../../api/pages/picker.js'
let rangeArray = []
let rtnResult = {}
Component({
  properties: {
    openPicker: {
      type: Boolean,
      value: false
    },
    pickerType: {
      type: String,
      value: ''
    },
    initValue: {
      type: String,
      value: ''
    }
  },
  data: {
    rangeArray: [],
    value: [0,0,0],
    active: []
  },
  attached () {
    this.init()
  },
  methods: {
    init() {
      let value = []
      switch(this.data.pickerType) {
        case 'birthday':
          let days = []
          let years = []
          let curYear = new Date().getFullYear()
          let curMounth = new Date().getMonth() + 1
          let months = [
            {key: '1月', value: '01'},
            {key: '2月', value: '02'},
            {key: '3月', value: '03'},
            {key: '4月', value: '04'},
            {key: '5月', value: '05'},
            {key: '6月', value: '06'},
            {key: '7月', value: '07'},
            {key: '8月', value: '08'},
            {key: '9月', value: '09'},
            {key: '10月', value: '10'},
            {key: '11月', value: '11'},
            {key: '12月', value: '12'},
          ]
          let length = this.getDaysInMonth(curYear, curMounth)
          let add0 = (m) => {return m < 10 ? '0' + m : m }
          for(let i = curYear; i > curYear - 65; i--) {
            years.push({
              key: `${i}年`,
              value: i
            })
          }
          for (let i = 1; i <= length; i++) {
            days.push({
              key: `${i}日`,
              value: add0(i)
            })
          }
          rangeArray[0] = years
          rangeArray[1] = months
          rangeArray[2] = days
          if(this.data.initValue) {
            let tem = this.data.initValue.split('-')
            let yearIndex = years.findIndex((v, i, a) => v.value == tem[0]) || 0
            let monthIndex = months.findIndex((v, i, a) => v.value == tem[1]) || 0
            let dayIndex = days.findIndex((v, i, a) => v.value == tem[2]) || 0
            value = [yearIndex, monthIndex, dayIndex]
            this.setData({active: value})
          }
          this.setData({ rangeArray, value })
          break
        case 'height':
          let heights = []
          for(let i = 100; i <= 300; i++) {
            heights.push({
              key: i,
              value: i
            })
          }
          rangeArray[0] = heights
          if(this.data.initValue) {
            let heightIndex = heights.findIndex((v,i,a) => v.value == this.data.initValue) || 0
            value = [ heightIndex ]
            this.setData({active: value})
          }
          this.setData({ rangeArray, value })
          break
        case 'region':
          getAreaListApi().then(({ data }) => {
            let provinces = data
            let citys = []
            if(this.data.initValue) {
              let tem = this.data.initValue.split('-')
              let provinceIndex = data.findIndex((v,i,a) => v.areaId == tem[0]) || 0
              citys = data[provinceIndex].children
              let cityIndex = citys.findIndex((v,i,a) => v.areaId == tem[1]) || 0
              value = [provinceIndex, cityIndex]
            } else {
              value = [0,0]
              citys = provinces[0].children || []
            }
            rangeArray[0] = provinces
            rangeArray[1] = citys
            this.setData({ rangeArray, value, active: value })
          })
          break
        case 'education':
          getDegreeApi().then(({ data }) => {
            if(this.data.initValue) {
              let educationIndex = data.findIndex((v,i,a) => v.value == this.data.initValue) || 0
              value = [educationIndex]
              this.setData({active: value})
            }
            rangeArray[0] = data
            this.setData({ rangeArray, value })
          })
          break
      }
      this.setData({active: value})
    },
    getDaysInMonth(year, month) {
      month = parseInt(month, 10)
      let temp = new Date(year, month, 0)
      return temp.getDate()
    },
    bindChange(e) {
      let { value } = e.detail
      let rangeArray = this.data.rangeArray
      switch(this.data.pickerType) {
        case 'birthday':
          let days = []
          let length = this.getDaysInMonth(rtnResult.year, rtnResult.month)
          let add0 = (m) => {return m < 10 ? '0' + m : m }
          for (let i = 1; i <= length; i++) {
            days.push({
              key: `${i}日`,
              value: add0(i)
            })
          }
          rangeArray[2] = days
          this.setData({ rangeArray })
          break
        case 'region':
          let citys = rangeArray[0][value[0]].children
          rangeArray[1] = citys
          this.setData({ rangeArray })
          break
        case 'education':
          rtnResult = {
            ...rangeArray[0][value[0]]
          }
          break
      }
      this.setData({active: value})
    },
    confirm() {
      let rangeArray = this.data.rangeArray
      switch(this.data.pickerType) {
        case 'education':
          rtnResult = {
            ...rangeArray[0][this.data.active[0]]
          }
          break
        case 'region':
          rtnResult = {
            ...rangeArray[0][this.data.active[0]].children[this.data.active[1]]
          }
          break
        case 'height':
          rtnResult = {
            ...rangeArray[0][this.data.active[0]]
          }
          console.log(this.data.active, rtnResult)
          break
        case 'birthday':
          let year = rangeArray[0][this.data.active[0]].value
          let month = rangeArray[1][this.data.active[1]].value
          let day = rangeArray[2][this.data.active[2]].value
          rtnResult = {
            year,
            month,
            day,
            date: `${year}-${month}-${day}`,
            timestamp: Date.parse(new Date(`${year}-${month}-${day}`))
          }
          break
      }
      this.triggerEvent('pickerResult', rtnResult)
    },
    closePicker() {
      this.setData({openPicker: false})
    }
  }
})
