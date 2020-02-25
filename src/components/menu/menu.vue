<template>
    <div class="map-note">
    <div class="select_container">
      <div class="select_row">
        <ul
          class="select"
          :class="select.select_a ? ' open' : ''"
          @click.stop.prevent="selector(this)"
          :selectData="city">
          <li
            v-for="item in cityList"
            :key="item.id"
            :value="item"
            @click.prevent="city = item">
            {{ item }}
          </li>
        </ul>
      </div>
      <!-- <select
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
      </select> -->
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
</template>
<script>
import TwCity from '@/json/city_list'
export default {
  props: {
    Tw_Stores: Array
  },
  data () {
    return {
      city: '請選擇都市', // 城市
      area: '請選擇地區', // 地區
      select: {
        select_a: false,
        select_c: false
      }
    }
  },
  methods: {
    selector (i) {
      console.log(i)
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
  }
}
</script>
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
  padding: 32px 20px 0 20px;
  // .select{
  //   width: 100%;
  //   height: 48px;
  //   border: 1px solid #D8D8D8;
  //   margin-bottom: 8px;
  //   padding: 0 16px;
  //   &:last-of-type{
  //     margin-bottom: 12px;
  //   }
  //   @media (max-width: 1024px) {
  //   height: 24px;
  //   }
  // }
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
  background-color: #F2F2F2;
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
        line-height: 44px;
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
.select_row {
  position: relative;
  .select {
    text-align: left;
    position: relative;
    display: block;
    list-style: none;
    padding: 0;
    height: 48px;
    border: 1px solid #D8D8D8;
    margin-bottom: 8px;
    overflow: hidden;
    // background: $submain-Bg-Color;
    // color: $main-T-Color;
    cursor: pointer;
    &.open {
      overflow: visible;
    }
    &:before {
      content: attr(selectData);
      display: block;
      padding: 15px 10px;
    }
    &:after {
      content: "";
      display: block;
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      transform-origin: 50% 25%;
      transition: 0.2s;
      border: 12px dashed #666;
      border-radius: 2px;
      border-top-color: #000;
      border-left-color: transparent;
      border-bottom-color: transparent;
      border-right-color: transparent;
    }
    &.open:after {
      transform: rotate(-180deg);
    }
    li {
      display: block;
      padding: 10px 10px;
      position: relative;
      z-index: 1;
      transition: 0.5s;
      // background: $submain-Bg-Color;
      &:hover {
        background: #52504d;
        // color: $submain-T-Color;
        transition: 0.3s;
      }
    }
  }
}

</style>
