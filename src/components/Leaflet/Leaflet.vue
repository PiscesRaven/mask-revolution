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
          ref="marker"
          :class="selectData"
          v-for="stores in statePharmacyList"
          :key="stores.id"
          :icon="maskMarker(stores)"
          :lat-lng="getCoods(stores.geometry.coordinates[0], stores.geometry.coordinates[1])">
          <l-popup ref="popup" width="320">
            <Pharmacy
              :key="stores.properties.id"
              :class="stores.properties.id === selectdId ? 'select' : ''"
              @click="selected(stores)"
              :pharmacyData="stores"/>
          </l-popup>
        </l-marker>
      </v-marker-cluster>
    </l-map>
  </div>
</template>

<script>
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'
import { mapGetters } from 'vuex'
import Pharmacy from '../Pharmacy/Pharmacy'

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
    LPopup,
    Pharmacy
  },
  data () {
    return {
      zoom: 20,
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
    selectdId () {
      return this.setselectData[0].properties.id
    },
    maskMarker (store) {
      let assetsUrl = ''
      let adult = store.properties.mask_adult
      let child = store.properties.mask_child
      let total = adult + child
      if (total >= 250) {
        assetsUrl = 'mask_ample'
      } else if (total >= 100) {
        assetsUrl = 'mask_common'
      } else if (total >= 1) {
        assetsUrl = 'mask_less'
      } else {
        assetsUrl = 'mask_selled'
      }
      return L.icon({
        iconUrl: require(`@img/${assetsUrl}.png`),
        iconSize: [37, 52]
      })
    },
    getCoods (x, y) {
      x = x.toString()
      y = y.toString()
      let lng = x.includes('\n') ? x.split('\n')[0] : x
      let lat = y.includes('\n') ? y.split('\n')[0] : y

      return [lat, lng]
    },
    initLoccl () {
      if (navigator.geolocation) {
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
    ...mapGetters(['statePharmacyList', 'setselectData']),
    selectData () {
      return this.setselectData
    }
  },
  watch: {
    selectData (newVal) {
      if (newVal && newVal.length) {
        let [ x, y ] = [...newVal[0].geometry.coordinates]
        this.$refs.myMap.mapObject.setView(L.latLng(y, x), 20)
        this.$refs.marker.forEach(mark => {
          const [ markerLat, markerLong ] = mark.latLng
          if (markerLat === y.toString() && markerLong === x.toString()) {
            L.markerClusterGroup().zoomToShowLayer(mark, () => mark.mapObject.openPopup())
          }
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
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
  .pharmacy {
    box-shadow: none;
    overflow: unset;
    .pharmacy_content {
      padding: 20px 0;
    }
    &.select {
      box-shadow: none;
    }
    .mask_status {
      min-width: 125px;
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
