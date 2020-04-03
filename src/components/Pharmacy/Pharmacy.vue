<template>
  <transition-group name="fade">
    <div class="pharmacy"
      v-for="pharmacy in statePharmacyList"
      :key="pharmacy.properties.id"
      @click="moveTo(pharmacy.geometry)">
      <div class="pharmacy_content">
        <h2 class="name">{{ pharmacy.properties.name }}</h2>
        <p class="tel">
          {{ pharmacy.properties.phone }}</p>
        <p class="address">
          {{ pharmacy.properties.address }}</p>
      </div>
      <div class="status_container">
        <span class="mask_status"
        :class="maskAmount(pharmacy.properties.mask_adult)">
          成人 : {{ pharmacy.properties.mask_adult }} 個
        </span>
        <span class="mask_status"
        :class="maskAmount(pharmacy.properties.mask_child)">
          兒童 : {{ pharmacy.properties.mask_child }} 個
        </span>
      </div>
    </div>
  </transition-group>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  methods: {
    maskAmount (item) {
      let classList = []
      if (item >= 250) {
        classList.push('ample')
      } else if (item >= 100) {
        classList.push('common')
      } else if (item >= 1) {
        classList.push('less')
      } else {
        classList.push('selled')
      }
      return classList
    }
  },
  computed: {
    ...mapGetters(['statePharmacyList'])
  }
}
</script>
<style lang="scss" scoped>
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";
.fade-enter-active, .fade-leave-active {
  transition: opacity .25s;
}
.fade-enter, .fade-leave-to  {
  opacity: 0;
}
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
  @media (max-width: 1024px) {
    width: 100%;
    height: 50%;
    top: 0;
    left: 0;
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
  > p {
    height: 36px;
    letter-spacing: 0;
    color: #333333;
    font-size: 16px;
    &.transparent {
      color: transparent;
    }
  }
  .hi_light{
    color: #668AFE;
    font-size: 24px;
  }
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
  .pharmacy{
    cursor: pointer;
    background-color: #fff;
    margin-bottom: 16px;
    border-radius: 10px;
    box-shadow: 0px 2px 6px 1px rgba(0,0,0,.25);
    overflow: hidden;
    .pharmacy_content {
      padding: 20px;
    }
    &:last-of-type{
      margin-bottom: 0;
    }
    .name{
      line-height: 26px;
      font-size: 24px;
      color: #0BA29C;
      margin-bottom: 8px;
    }
    .address,.tel{
      line-height: 24px;
      color: #666666;
    }
    .tel {
    }
    .status_container{
      .mask_status {
        width: 50%;
        height: 44px;
        text-align: center;
        display: inline-block;
        font-weight: 200;
        letter-spacing: 0;
        color: #FFFFFF;
        font-size: 20px;
        line-height: 44px;
        font-size: 16px;
        &.ample {
          background-color: #0BA29C;
        }
        &.common {
          background-color: #FBB03B;
        }
        &.less {
          background-color: #D4145A;
        }
        &.selled {
          background-color: #00000080;
        }
      }
    }
  }
}
</style>
