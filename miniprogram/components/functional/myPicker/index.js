import {
  getAreaListApi,
  getAggrApi
} from '../../../api/common.js'

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
    },
    needSlot: {
      type: Boolean,
      value: false
    },
    // initValue: {
    //   type: String,
    //   observer(newVal, oldVal) {
    //     console.log(newVal, oldVal, 'kkk')
    //     this.init()
    //   }
    // }
  },
  data: {
    rangeArray: [],
    value: [0,0,0],
    active: [],
    mode: 'selector',
    rangeKey: '',
    placeHolder: '请选择'
  },
  ready () {
    this.init()
  },
  methods: {
    init() {
      let rangeArray = []
      let value = []
      switch(this.data.pickerType) {
        case 'birthday':
          let days = []
          let years = []
          let curYear = new Date().getFullYear() - 18
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
            let tem = this.data.initValue.split('/')
            let yearIndex = years.findIndex((v, i, a) => v.value == tem[0]) || 0
            let monthIndex = months.findIndex((v, i, a) => v.value == tem[1]) || 0
            let dayIndex = days.findIndex((v, i, a) => v.value == tem[2]) || 0
            value = [yearIndex, monthIndex, dayIndex]
            this.setData({active: value})
          } else {
            value = [2,0,0]
          }
          this.setData({ rangeArray, value, mode: 'multiSelector', rangeKey: 'key', placeHolder: '选择生日' })
          break
        case 'height':
          let heights = []
          for(let i = 100; i <= 300; i++) {
            heights.push({
              key: i,
              value: i
            })
          }
          rangeArray = heights
          if(this.data.initValue) {
            let heightIndex = heights.findIndex((v,i,a) => v.value == this.data.initValue) || 0
            value = [ heightIndex ]
            this.setData({active: value})
          }
          this.setData({ rangeArray, value, mode: 'selector', rangeKey: 'key', placeHolder: '选择身高' })
          break
        case 'region':
          getAreaListApi({level: 4}).then(({ data }) => {
            let provinces = data
            let citys = []
            let areas = []
            if(this.data.initValue) {
              let tem = this.data.initValue.split('-')
              let provinceIndex = data.findIndex((v,i,a) => v.areaId == tem[0]) || 0
              citys = data[provinceIndex].children
              let cityIndex = citys.findIndex((v,i,a) => v.areaId == tem[1]) || 0
              areas = citys[cityIndex].children
              let areaIndex = areas.findIndex((v,i,a) => v.areaId == tem[2]) || 0
              value = [provinceIndex, cityIndex, areaIndex]
            } else {
              value = [0,0,0]
              citys = provinces[0].children || []
              areas = citys.length && citys[0].children
            }
            rangeArray[0] = provinces
            rangeArray[1] = citys
            rangeArray[2] = areas
            this.setData({ rangeArray, value, active: value, mode: 'multiSelector', rangeKey: 'title', placeHolder: '选择家乡' })
          })
          break
        case 'industry_occupation':
          getAggrApi({type: 'industry'}).then(({ data }) => {
            data = data.industryArr
            let industrys = data
            let occupations = []
            if(this.data.initValue) {
              let tem = this.data.initValue.split('-')
              let industryIndex = data.findIndex((v,i,a) => v.labelId == tem[0]) || 0
              occupations = industrys[tem[1]].children
              let occupationIndex = occupations.findIndex((v,i,a) => v.labelId == tem[1]) || 0
              value = [industryIndex, occupationIndex]
              this.setData({active: value})
            } else {
              occupations = industrys[0].children
              value = [0,0]
            }
            rangeArray[0] = industrys
            rangeArray[1] = occupations
            this.setData({ rangeArray, value, mode: 'multiSelector', rangeKey: 'name', placeHolder: '选择学历' })
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
    change(e) {
      let { value } = e.detail
      let rangeArray = this.data.rangeArray
      switch(this.data.pickerType) {
        case 'industry_occupation':
          rtnResult = {
            ...rangeArray[0][value[0]].children[value[1]]
          }
          break
        case 'region':
          let temObj = rangeArray[0][value[0]].children[value[1]].children[value[2]]
          rtnResult = {
            ...temObj,
            topPid: rangeArray[0][value[0]].areaId,
            desc: `${rangeArray[0][value[0]].title},${rangeArray[0][value[0]].children[value[1]].title},${temObj.title}`
          }
          break          
        case 'height':
          rtnResult = {
            ...rangeArray[parseInt(value)]
          }
          break
        case 'birthday':
          let year = rangeArray[0][value[0]].value
          let month = rangeArray[1][value[1]].value
          let day = rangeArray[2][value[2]].value
          rtnResult = {
            year,
            month,
            day,
            date: `${year}/${month}/${day}`,
            timestamp: Date.parse(new Date(`${year}-${month}-${day}`))
          }
          break
      }
      this.triggerEvent('resultevent', rtnResult)
    },
    bindChange(e) {
      let { column } = e.detail
      let { value } = e.detail
      let { rangeArray } = this.data
      let tem = this.data.value
      switch(this.data.pickerType) {
        case 'industry_occupation':
          if(column === rangeArray.length - 1) return
          let occupations = rangeArray[0][value].children
          rangeArray[1] = occupations
          this.setData({ rangeArray})
          break
        case 'region':
          if(column === rangeArray.length - 1) return
          let citys = []
          let areas = []
          if(column === 0) {
            tem = [value, 0, 0]
            citys = rangeArray[0][value].children
            areas = citys[0].children
          } else {
            citys = rangeArray[1]
            areas = citys[value].children
            tem[column] = value
          }
          rangeArray[1] = citys
          rangeArray[2] = areas
          this.setData({ rangeArray, value: tem })
          break
        case 'birthday':
          if(column === rangeArray.length - 1) return
          let months = rangeArray[1]
          let days = []
          tem[column] = value
          let length = this.getDaysInMonth(rangeArray[0][tem[0]].value, months[tem[1]].value)
          let add0 = (m) => {return m < 10 ? '0' + m : m }
          for (let i = 1; i <= length; i++) {
            days.push({
              key: `${i}日`,
              value: add0(i)
            })
          }
          rangeArray[1] = months
          rangeArray[2] = days
          this.setData({ rangeArray })
          break
      }
    }
  }
})
