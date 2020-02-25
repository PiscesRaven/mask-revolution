<template>
  <div id="app">
    <!-- <h1 class="info">口罩供需資訊平台</h1> -->
    <Main />
  </div>
</template>

<script>

import Main from './view/Main'

export default {
  name: 'app',
  components: {
    Main
  }
}
</script>

<style lang="scss">
.info {
  position: fixed;
  display: block;
  z-index: 10;
  width: 100%;
  height: 30px;
  line-height: 30px;
  background-color: #fff;
}
</style>
