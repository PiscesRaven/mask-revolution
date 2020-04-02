<template>
  <div class="main">
    <MenuContainer />
    <vue-leaflet />
  </div>
</template>
<script>

import VueLeaflet from '@c/Leaflet/Leaflet'
import MenuContainer from '@c/menu/menu'
import { mapActions } from 'vuex'

export default {
  name: 'Main',
  components: {
    MenuContainer,
    VueLeaflet
  },
  methods: {
    ...mapActions(['getstroeList']),
    init () {
      fetch('https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json?fbclid=IwAR2faivZHghmapjOcGiuSocqD09wboudZpWjQIfxwG9xCutufqr7Bw06yVk')
        .then(res => res.json())
        .then(jsonData => {
          this.getstroeList(jsonData.features)
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
