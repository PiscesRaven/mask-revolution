<template>
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
          v-for="stores in statePharmacyList"
          :key="stores.id"
          :lat-lng="getCoods(stores.geometry.coordinates[0], stores.geometry.coordinates[1])">
          <l-popup :content="getPopup(stores.properties)"></l-popup>
        </l-marker>
      </v-marker-cluster>
    </l-map>
  </div>
</template>

<script>
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'
import { mapGetters } from 'vuex'

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
      zoom: 5,
      center: L.latLng(24.163721, 120.63542),
      marker: L.latLng(24.163721, 120.63542),
      icon: L.icon({
        iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
        iconSize: [50, 50]
      }),
      text: 'this is a marker',
      token: '',
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
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
        <div class="pharmacy">
          <div class="pharmacy_content">
            <h2 class="name">${item.name}</h2>
            <p class="tel">
              ${item.phone}</p>
            <a class="address" target="_blank" href="https://www.google.com.tw/maps/place/${addr}">
              ${addr}</a>
          </div>
          <div class="status_container">
            <span class="mask_status">
              成人 : ${item.mask_adult} 個
            </span>
            <span class="mask_status">
              兒童 : ${item.mask_child} 個
            </span>
          </div>
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
  computed: {
    ...mapGetters(['statePharmacyList', 'setselectData'])
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
.map{
  display: block;
  position: absolute;
  width: 75%;
  height: 100%;
  left: 25%;
  z-index: 5;
  @media (max-width: 1024px) {
    width: 100%;
    height: 50%;
    top: 0;
    left: 0;
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
