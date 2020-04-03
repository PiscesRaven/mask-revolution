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

</style>
