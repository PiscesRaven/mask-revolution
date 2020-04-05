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
          <Pharmacy />
        </div>
      </div>
    </div>
    <div class="vue-leaflet">
      <!-- <div class="mask_panel">
        <img src="@img/inventory.png" alt="">
      </div> -->
      <vue-leaflet />
    </div>
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
      area: '' // 地區
    }
  },
  components: {
    Select,
    Pharmacy,
    VueLeaflet
  },
  methods: {
    ...mapActions(['getstroeList', 'getPharmacyList']),
    init () {
      fetch('https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json?fbclid=IwAR2faivZHghmapjOcGiuSocqD09wboudZpWjQIfxwG9xCutufqr7Bw06yVk')
        .then(res => res.json())
        .then(jsonData => {
          this.getstroeList(jsonData.features)
        })
    }
  },
  computed: {
    ...mapGetters(['statePharmacyList']),
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
    }
  },
  watch: {
    area (newVal) {
      newVal ? this.getPharmacyList(this.filterPharmacy) : this.getPharmacyList('')
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
  height: calc(100% - 188px);
  overflow-y: auto;
  @media (max-width: 1024px) {
    height: calc(100% - 136px);
  }
}
</style>
