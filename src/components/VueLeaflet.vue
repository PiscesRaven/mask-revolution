<template>
  <div class="vue-leaflet">
    <div class="map">
      <l-map
        :zoom="zoom"
        :center="center"
        ref="myMap">
        <l-tile-layer
          :url="url"
          :attribution="attribution">
        </l-tile-layer>
        <l-marker
          :lat-lng="marker"
          :icon="icon"
          ref='marker'>
        </l-marker>
        <v-marker-cluster ref="clusterRef">
          <l-marker
            v-for="stores in filterPharmacy"
            :key="stores.id"
            :lat-lng="getCoods(stores.geometry.coordinates[0], stores.geometry.coordinates[1])">
            <l-popup :content="getPopup(stores.properties)"></l-popup>
          </l-marker>
        </v-marker-cluster>
      </l-map>
    </div>
    <div class="map-note">
      <div class="select_container">
        <select
          class="select"
          v-model="city"
          @change="area = null">
          <option :value="null">請選擇</option>
          <option
            v-for="item in cityList"
            :value="item"
            :key="item.id">
            {{ item }}
          </option>
        </select>
        <select
          class="select"
          v-model="area">
          <option :value="null">請選擇</option>
          <template v-if="!!city">
            <option v-for="item in areaList"
              :value="item"
              :key="item.id">
              {{item}}
            </option>
          </template>
        </select>
        <p>有取得口罩數量的藥局有 <span class="hi_light"> {{ areaMaskNum }} </span> 家</p>
      </div>
      <div class="list_container">
        <div class="pharmacy_list"
          v-if="filterPharmacy.length">
          <div class="pharmacy"
            v-for="pharmacy in filterPharmacy"
            :key="pharmacy.properties.id"
            @click="moveTo(pharmacy.geometry)">
            <h2 class="name">{{ pharmacy.properties.name }}</h2>
            <p class="address">
              <span class="img">
                <img src="@img/map-marker.png">
              </span>
               {{ pharmacy.properties.address }}</p>
            <p class="tel">
              <span class="img">
                <img src="@img/phone.png">
              </span>
              {{ pharmacy.properties.phone }}</p>
            <div class="status_container">
              <span class="mask_status"
              :class="pharmacy.properties.mask_adult === 0 ? 'selled':''">
                成人 : {{ pharmacy.properties.mask_adult }} 個
              </span>
              <span class="mask_status"
              :class="pharmacy.properties.mask_child === 0 ? 'selled':''">
                兒童 : {{ pharmacy.properties.mask_child }} 個
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'

import TwCity from '@/json/city_list'

import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup
} from 'vue2-leaflet'

var L = window.L

export default {
  name: 'VueLeaflet',
  components: {
    'v-marker-cluster': Vue2LeafletMarkerCluster,
    LMap,
    LTileLayer,
    LMarker,
    LPopup
  },
  data () {
    return {
      Tw_Stores: [],
      city: null, // 城市
      area: null, // 地區
      zoom: 5,
      center: L.latLng(24.163721, 120.63542),
      marker: L.latLng(24.163721, 120.63542),
      icon: L.icon({
        iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
        iconSize: [50, 50]
      }),
      text: 'this is a marker',
      token: '',
      url: 'https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
    }
  },
  methods: {
    getCoods (x, y) {
      x = x.toString()
      y = y.toString()
      let lng = x.includes('\n') ? x.split('\n')[0] : x
      let lat = y.includes('\n') ? y.split('\n')[0] : y

      return [lat, lng]
    },
    getPopup (item) {
      let addr = item.address.includes('\n') ? item.address.split('\n')[0] : item.address

      return `
        <h3 class="store-title">${item.name}</h3>
        <div class="store-info">
          <a target="_blank" href="https://www.google.com.tw/maps/place/${addr}">地址: ${addr}</a><br>
          電話: ${item.phone}<br>
          口罩數量: 成人口罩 : ${item.mask_adult} 個  兒童口罩 : ${item.mask_child} 個
        </div>
      `
    },
    renderMap () {
      this.zoom = 17
      // fetch('./med-stores.json')
      //   .then(res => res.json())
      //   .then(jsonData => {
      //     this.Tw_Stores = jsonData
      //   })

      fetch('https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json?fbclid=IwAR2faivZHghmapjOcGiuSocqD09wboudZpWjQIfxwG9xCutufqr7Bw06yVk')
        .then(res => res.json())
        .then(jsonData => {
          this.Tw_Stores = jsonData.features
        })
    },
    initLoccl () {
      if (navigator.geolocation) {
        console.log('navigator.geolocation')
        navigator.geolocation.getCurrentPosition((position) => {
          const pos = position.coords
          this.center = L.latLng(pos.latitude, pos.longitude)
          this.zoom = 17
        })
        // navigator.geolocation.watchPosition(geo_success, geo_error, geo_options)
        this.$nextTick(() => {
          this.$refs.marker.mapObject.bindTooltip('目前定位', {
            offset: [0, -30],
            permanent: true,
            direction: 'top'
          })
        })
      } else {
        alert('不好意思阿!!!你的瀏覽器不支援!定位功能喔!!')
      }
    },
    geo_success (position) {
    },
    moveTo (geometry) {
      let [ x, y ] = geometry.coordinates
      L.latLng(x, y)
      this.center = L.latLng(y, x)
    }
  },
  computed: {
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
      let tw = /(台|臺)../
      if (!!city && !!area) {
        if (city !== null && city.match(tw)) {
          city = city.split('台').join('')
        }
        let regExp = new RegExp(city + area, 'g')
        res = this.Tw_Stores.filter((features) => {
          return features.properties.address.match(regExp)
        })
      }
      return res
    },
    areaMaskNum () {
      let filterPharmacy = this.filterPharmacy
      let res = 0
      filterPharmacy.map((pharmacy) => {
        if (pharmacy.properties.mask_child || pharmacy.properties.mask_adult) {
          res++
        }
      })
      return res
    }
  },
  mounted () {
    this.renderMap()
    // this.initLoccl()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";

.vue-leaflet {
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
}
.map-info {
  display: block;
  padding: .75em 1.75em;
  background-color: #fff;
  border: 1px solid #000;
  position: absolute;
  z-index: 10;
  top: 0;
  right: 0;
}
.map{
  display: block;
  position: absolute;
  width: 75%;
  height: 100%;
  left: 25%;
  z-index: 5;
}

.map-note{
  display: block;
  position: absolute;
  width: 25%;
  height: 100%;
  left: 0%;
  z-index: 1;
  max-width: 480px;
}
.select_container{
  padding: 32px 20px 0 20px;
  .select{
    width: 100%;
    height: 48px;
    border: 1px solid #D8D8D8;
    margin-bottom: 8px;
    padding: 0 16px;
    &:last-of-type{
      margin-bottom: 12px;
    }
  }
  > p {
    height: 36px;
    letter-spacing: 0;
    color: #333333;
    font-size: 16px;
  }
  .hi_light{
    color: #668AFE;
    font-size: 24px;
  }
}
.list_container{
  background-color: #F2F2F2;
  padding: 20px;
  /* margin-right: -17px; */
  height: calc(100% - 188px);
  overflow-y: auto;
  .pharmacy{
    cursor: pointer;
    background-color: #fff;
    padding: 24px;
    margin-bottom: 12px;
    &:last-of-type{
      margin-bottom: 0;
    }
    .name{
      line-height: 27px;
      font-size: 24px;
      color: #333333;
      margin-bottom: 8px;
    }
    .address,.tel{
      line-height: 24px;
      color: #666666;
      .img {
        width: 14px;
        display: inline-block;
        text-align: center;
      }
    }
    .tel {
      margin-bottom: 12px;
    }
    .status_container{
      .mask_status {
        width: calc(100% / 2 - 2px);
        height: 44px;
        text-align: center;
        display: inline-block;
        background-color: #668AFE;
        font-weight: 200;
        letter-spacing: 0;
        color: #FFFFFF;
        font-size: 20px;
        padding: 12px 15px;
        font-size: 16px;
        &:last-of-type{
          margin-left: 2px;
        }
        &.selled{
          background-color: #E2E2E2;
          color: #9C9C9C;
        }
      }
    }
  }
}

>>> .store-title {
  font-size: 1.3em;
  line-height: 1.7em;
  font-weight: 900;
  margin-bottom: 6px;
}

>>> .store-info {
  font-size: 1.1em;
  line-height: 1.5;
}

</style>
