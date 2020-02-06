<template>
  <div class="vue-leaflet">
    <div class="map">
      <l-map :zoom="zoom" :center="center" ref="myMap">
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
        <l-marker :lat-lng="center" :icon="icon" ref='marker'></l-marker>
        <v-marker-cluster>
          <l-marker v-for="stores in Tw_Stores" :key="stores.id" :lat-lng="getCoods(stores.x, stores.y)" >
            <l-popup :content="getPopup(stores)"></l-popup>
          </l-marker>
        </v-marker-cluster>
      </l-map>
    </div>
    <div class="map-note">
      <div class="select_container">
        <div class="select">

        </div>
        <div class="select">
        </div>
        <p>有取得口罩數量的藥局有 <span class="hi_light">24</span> 家</p>
      </div>
      <div class="list_container">
        <div class="pharmacy_list">
          <div class="pharmacy" v-for="i in 10" :key="i">
            <h2 class="name">禾豐藥局</h2>
            <p class="address">
              <span class="img">
                <img src="@img/map-marker.png">
              </span>
               台中市太平區樹孝路31號</p>
            <p class="tel">
              <span class="img">
                <img src="@img/phone.png">
              </span>
              04 -23915599</p>
            <div class="status_container">
              <span class="mask_status">成人 :</span>
              <span class="mask_status selled">兒童 : </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'

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
          電話: ${item.tel}
        </div>
      `
    },
    renderMap () {
      this.zoom = 17
      fetch('./med-stores.json')
        .then(res => res.json())
        .then(jsonData => {
          this.Tw_Stores = jsonData
        })

      fetch('https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json?fbclid=IwAR2faivZHghmapjOcGiuSocqD09wboudZpWjQIfxwG9xCutufqr7Bw06yVk')
        .then(res => res.json())
        .then(jsonData => {
          console.log('jsonData', jsonData)
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
    }
  },
  mounted () {
    this.renderMap()
    this.initLoccl()
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
        padding: 12px 26px;
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
