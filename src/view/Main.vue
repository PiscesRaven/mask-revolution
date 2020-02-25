<template>
  <div class="main">
    <MenuContainer :Tw_Stores="Tw_Stores" />
    <vue-leaflet />
  </div>
</template>
<script>

import VueLeaflet from '@c/Leaflet/Leaflet'
import MenuContainer from '@c/menu/menu'

export default {
  name: 'Main',
  data () {
    return {
      Tw_Stores: []
    }
  },
  components: {
    MenuContainer,
    VueLeaflet
  },
  methods: {
    init () {
      fetch('https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json?fbclid=IwAR2faivZHghmapjOcGiuSocqD09wboudZpWjQIfxwG9xCutufqr7Bw06yVk')
        .then(res => res.json())
        .then(jsonData => {
          this.Tw_Stores = jsonData.features
        })
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
</style>
