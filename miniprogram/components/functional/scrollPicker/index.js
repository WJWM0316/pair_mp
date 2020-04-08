import { getAggrApi, getAreaListApi } from '../../../api/common.js'
let rangeArray = []
let rtnResult = {}
Component({
  properties: {
    pickerType: {
      type: String,
      value: ''
    },
    initValue: {
      type: String,
      value: ''
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
    rangeKey: '',
    mode: ''
  },
  ready () {
    this.init()
  },
  methods: {
    init() {
      let value = []
      rangeArray = []
      rtnResult = {}
      let callback = () => {}
      switch(this.data.pickerType) {
        case 'birthday':
          callback = () => {
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
              let tem = this.data.initValue.split('-')
              let yearIndex = years.findIndex((v, i, a) => v.value == tem[0]) || 0
              let monthIndex = months.findIndex((v, i, a) => v.value == tem[1]) || 0
              let dayIndex = days.findIndex((v, i, a) => v.value == tem[2]) || 0
              value = [yearIndex, monthIndex, dayIndex]
              this.setData({active: value})
            } else {
              value = [2,0,0]
            }

            let year = rangeArray[0][value[0]].value
            let month = rangeArray[1][value[1]].value
            let day = rangeArray[2][value[2]].value
            rtnResult = {
              year,
              month,
              day,
              desc: `${year}-${month}-${day}`
            }
            this.triggerEvent('pickerResult', rtnResult)
            this.setData({ rangeArray, value, mode: 'multiSelector', rangeKey: 'value' })
          }
          callback()
          break
        case 'height':
          callback = () => {
            let heights = []
            for(let i = 100; i <= 300; i++) {
              heights.push({
                key: i,
                value: i
              })
            }
            rangeArray = heights
            console.log(this.data.initValue, 'kkkk')
            if(this.data.initValue) {
              let heightIndex = heights.findIndex((v,i,a) => v.value == this.data.initValue) || 0
              value = [ heightIndex ]
              this.setData({active: value})
            } else {
              value = [0]
            }
            rtnResult = {
              ...rangeArray[value[0]]
            }
            this.triggerEvent('pickerResult', rtnResult)
            this.setData({ rangeArray, value, mode: 'selector', rangeKey: 'value' })
          }
          callback()
          break
        case 'resident':
          callback = () => {
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
              let province = rangeArray[0][value[0]].title
              let city = rangeArray[1][value[1]].title
              let area = rangeArray[2][value[2]].title
              rtnResult = {
                province,
                city,
                area,
                desc: `${province},${city},${area}`
              }
              this.triggerEvent('pickerResult', rtnResult)
              this.setData({ rangeArray, value, active: value, mode: 'multiSelector', rangeKey: 'title', placeHolder: '选择家乡' })
            })
          }
          callback()
          break
        case 'hometown':
          callback = () => {
            getAreaListApi({level: 3}).then(({ data }) => {
              let provinces = data
              let citys = []
              console.log(this.data.initValue)
              if(this.data.initValue) {
                console.log(1)
                let tem = this.data.initValue.split('-')
                let provinceIndex = provinces.findIndex((v,i,a) => v.areaId == tem[0]) || 0
                citys = provinces[provinceIndex].children
                let cityIndex = citys.findIndex((v,i,a) => v.areaId == tem[1]) || 0
                value = [provinceIndex, cityIndex]
              } else {
                console.log(2)
                value = [0, 0]
                citys = provinces[0].children || []
              }
              rangeArray[0] = provinces
              rangeArray[1] = citys
              rtnResult = {
                ...rangeArray[1][value[1]]
              }
              this.setData({ rangeArray, value, active: value })
              this.triggerEvent('pickerResult', rtnResult)
            })
          }
          callback()
          break
        case 'degree':
          callback = () => {
            getAggrApi({type: 'degree'}).then(({ data }) => {
              let degreeArr = data.degreeArr
              if(this.data.initValue) {
                let degreeIndex = degreeArr.findIndex((v,i,a) => v.id == this.data.initValue) || 0
                value = [degreeIndex]
                this.setData({active: value})
              } else {
                value = [0]
              }
              rangeArray = degreeArr
              rtnResult = {
                ...rangeArray[value[0]]
              }
              this.triggerEvent('pickerResult', rtnResult)
              this.setData({ rangeArray, value, mode: 'selector', rangeKey: 'name'})
            })
          }
          callback()
          break
        case 'salary':
          callback = () => {
            getAggrApi({type: 'salary'}).then(({ data }) => {
              let salaryArr = data.salaryArr
              if(this.data.initValue) {
                let salaryIndex = salaryArr.findIndex((v,i,a) => v.id == this.data.initValue) || 0
                value = [salaryIndex]
                this.setData({ active: value })
              } else {
                value = [0]
              }
              rangeArray = salaryArr
              rtnResult = {
                ...rangeArray[value[0]]
              }
              this.triggerEvent('pickerResult', rtnResult)
              this.setData({ rangeArray, value, mode: 'selector', rangeKey: 'name' })
            })
          }
          callback()
          break
        case 'occupation':
          callback = () => {
            getAggrApi({type: 'industry'}).then(({ data }) => {
              let industry = data.industryArr
              let children = []
              
              if(this.data.initValue) {
                let tem = this.data.initValue.split('-')
                let industryIndex = industry.findIndex(v => v.labelId == tem[0]) || 0
                children = industry.find(v => v.labelId == tem[0]).children
                let childrenIndex = children.findIndex(v => v.labelId == tem[1]) || 0
                value = [industryIndex, childrenIndex]
                this.setData({ active: value })
              } else {
                children = industry[0].children
                value = [0,0]
              }
              rangeArray[0] = industry
              rangeArray[1] = children
              rtnResult = {
                ...rangeArray[1][value[1]]
              }
              this.triggerEvent('pickerResult', rtnResult)
              this.setData({ rangeArray, value, mode: 'multiSelector', rangeKey: 'name' })
            })
          }
          callback()
          break
      }
      this.setData({active: value}, () => callback = null)
    },
    getDaysInMonth(year, month) {
      month = parseInt(month, 10)
      let temp = new Date(year, month, 0)
      return temp.getDate()
    },
    bindChange(e) {
      let { value } = e.detail
      let { rangeArray } = this.data
      let callback = () => {}
      switch(this.data.pickerType) {
        case 'birthday':
          callback = () => {
            let days = []
            let months = rangeArray[1]
            let length = this.getDaysInMonth(rangeArray[0][value[0]].value, months[value[1]].value)
            let add0 = (m) => {return m < 10 ? '0' + m : m }
            for (let i = 1; i <= length; i++) {
              days.push({
                key: `${i}日`,
                value: add0(i)
              })
            }
            rangeArray[1] = months
            rangeArray[2] = days
            let year = rangeArray[0][value[0]].value
            let month = rangeArray[1][value[1]].value
            let day = rangeArray[2][value[2]] ? rangeArray[2][value[2]].value : '1'
            rtnResult = {
              year,
              month,
              day,
              desc: `${year}-${month}-${day}`
            }
            this.setData({ rangeArray})
          }
          callback()
          break
        case 'resident':
          callback = () => {
            let provinces = rangeArray[0]
            let citys = provinces[value[0]].children
            let areas = citys[value[1]].children
            rangeArray[1] = citys
            rangeArray[2] = areas
            let province = rangeArray[0][value[0]].title
            let city = rangeArray[1][value[1]].title
            let area = rangeArray[2][value[2]].title
            rtnResult = {
              province,
              city,
              area,
              desc: `${province},${city},${area}`
            }
            this.setData({ rangeArray })
          }
          callback()
          break
        case 'hometown':
          callback = () => {
            let citys1 = rangeArray[0][value[0]].children
            rangeArray[1] = citys1
            rtnResult = {
              ...rangeArray[1][value[1]]
            }
            this.setData({ rangeArray })
          }
          callback()
          break
        case 'degree':
          callback = () => {
            rtnResult = {
              ...rangeArray[value[0]]
            }
          }
          callback()
          break
        case 'salary':
          callback = () => {
            rtnResult = {
              ...rangeArray[value[0]]
            }
          }
          callback()
          break
        case 'height':
          callback = () => {
            rtnResult = {
              ...rangeArray[value[0]]
            }
          }
          callback()
          break
        case 'occupation':
          callback = () => {
            let industry = rangeArray[0][value[0]].children
            rangeArray[1] = industry
            rtnResult = {
              ...rangeArray[1][value[1]]
            }
            this.setData({ rangeArray })
          }
          callback()
          break
      }
      this.triggerEvent('pickerResult', rtnResult)
      this.setData({active: value}, () => {
        callback = null
      })
    }
  }
})
