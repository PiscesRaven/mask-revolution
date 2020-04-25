<template>
  <div class="main">
    <div class="map-note">
      <div class="select_mode"></div>
      <div class="select_container">
        <Select v-model="city" selectText="請選擇都市" :propsList="cityList" />
        <Select v-model="area" selectText="請選擇地區" :propsList="areaList" />
      </div>
      <div class="list_container">
        <div class="pharmacy_list">
          <div v-if="statePharmacyList.length === 0">{{ text || searchText }}</div>
          <Pharmacy
            v-else
            v-for="(pharmacy, index) in statePharmacyList"
            :key="pharmacy.properties.id"
            :class="pharmacy.properties.id === selectdId ? 'select' : ''"
            @click.native="selected(pharmacy, index)"
            :pharmacyData="pharmacy"/>
        </div>
      </div>
    </div>
    <div class="vue-leaflet">
      <div class="mask_panel">
        <img src="@img/inventory.png" alt="">
      </div>
      <vue-leaflet />
    </div>
    <div class="last_time">{{selectdPharmacy}}</div>
  </div>
</template>
<script>
import TwCity from '@/json/city_list'
import Select from '@c/Select/Select'
import Pharmacy from '@c/Pharmacy/Pharmacy'
import { mapGetters, mapActions } from 'vuex'
import VueLeaflet from '@c/Leaflet/Leaflet'

export default {
  name: 'Main',
  data () {
    return {
      city: '', // 城市
      area: '', // 地區
      text: ''
    }
  },
  components: {
    Select,
    Pharmacy,
    VueLeaflet
  },
  methods: {
    ...mapActions(['getstroeList', 'getPharmacyList', 'getselectData']),
    init () {
      fetch('https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json?fbclid=IwAR2faivZHghmapjOcGiuSocqD09wboudZpWjQIfxwG9xCutufqr7Bw06yVk')
        .then(res => res.json())
        .then(jsonData => {
          if (jsonData.features.length > 0) {
            this.getstroeList(jsonData.features)
          } else {
            this.text = '無法取得商家資料'
          }
        })
    },
    selected (data, index) {
      this.getselectData({ ...data, id: index })
    }
  },
  computed: {
    ...mapGetters(['statePharmacyList', 'setselectData']),
    cityList () {
      let res = TwCity.taiwan.map((tw) => tw.city)
      return res
    },
    areaList () {
      let res = []
      let city = !!this.city
      if (city) {
        res = TwCity.taiwan.filter((tw) => tw.city === this.city)[0].area.map(areas => areas.text)
      }
      return res
    },
    filterPharmacy () {
      let res = []
      let city = this.city
      let area = this.area
      res = city + area
      return res
    },
    selectdPharmacy () {
      let res
      if (this.setselectData) {
        return
      }
      res = this.setselectData.properties.updated
      return res ? `口罩庫存最後更新時間： ${res}` : ''
    },
    selectdId () {
      return this.setselectData.properties.id
    },
    searchText () {
      let res = ''
      let city = this.city
      let area = this.area
      if (city === '' && area === '') {
        res = '請選擇城市與地區'
      }

      if (city !== '' && area === '') {
        res = '請選擇地區'
      }

      if ((city !== '' && area !== '') && this.statePharmacyList.length === 0) {
        res = '該地區無店家'
      }
      return res
    }
  },
  watch: {
    area (newVal) {
      newVal ? this.getPharmacyList(this.filterPharmacy) : this.getPharmacyList('')
      newVal && this.statePharmacyList.length > 0 ? this.getselectData({ ...this.statePharmacyList[0], id: 0 }) : this.getselectData({})
    }
  },
  created () {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
.main {
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
}
.vue-leaflet {
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  .mask_panel {
    display: block;
    position: absolute;
    width: 75%;
    height: 100px;
    left: 25%;
    z-index: 7;
    background-color: #fff;
    display: flex;
    align-items: center;
    @media (max-width: 1024px) {
      left: 0%;
      width: 100%;
      justify-content: center;
    }
  }
}
.map-note{
  display: block;
  position: absolute;
  width: 25%;
  height: 100%;
  left: 0%;
  z-index: 1;
  max-width: 480px;
   @media (max-width: 1024px) {
    width: 100%;
    height: 50%;
    top: 50%;
    left: 0;
    max-width: unset;
  }
  @media (max-width: 769px) {
    top: 100px;
    height: calc(100% - 100px);
    z-index: 6;
    background-color: #fff;
  }
}
.select_container{
  position: relative;
  padding: 16px;
  box-shadow: 0px 2px 6px 1px rgba(0,0,0,.25);
}
.list_container{
  background-color: #fff;
  padding: 20px;
  /* margin-right: -17px; */
  height: calc(100% - 203px);
  overflow-y: auto;
  @media (max-width: 1024px) {
    height: calc(100% - 205px);
  }
}
.last_time {
  background-color: #0BA29C;
  width: 100%;
  height: 60px;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 6;
  color: #fff;
  line-height: 60px;
  padding-left: 20px;
}
</style>
