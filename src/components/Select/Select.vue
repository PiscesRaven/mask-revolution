<template>
  <div
    class="select_row"
    :tabindex="tabindex"
    @blur="select = false"
    >
    <ul
      class="select"
      :class="select ? ' open' : ''"
      @click="select =!select"
      :selectData="option"
    >
      <div class="select_box" >
        <div class="select_scroll" v-if="propsList.length">
          <li
            v-for="item in liList"
            :key="item.id"
            :value="item"
            @click="selectOption(item)"
          >
            {{ item }}
          </li>
        </div>
        <div class="select_scroll" v-else>
          <li>尚無資料</li>
        </div>
      </div>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    propsList: Array,
    value: String,
    selectText: String,
    tabindex: {
      type: Number,
      required: false,
      default: 0
    }
  },
  model: {
    prop: 'value',
    event: 'update'
  },
  data () {
    return {
      select: false,
      liList: [],
      option: null
    }
  },
  mounted () {
    this.option = this.selectText
  },
  methods: {
    selectOption (item) {
      this.option = item
      this.$emit('update', item)
    }
  },
  watch: {
    propsList: {
      immediate: true,
      deep: true,
      handler (newValue) {
        this.option = this.selectText
        this.liList = newValue
        this.$emit('update', '')
      }
    }
  }
}
</script>
<style lang="scss">
.select_row {
  position: relative;
  .select {
    text-align: left;
    position: relative;
    display: block;
    list-style: none;
    padding: 0;
    height: 48px;
    border: 1px solid #d8d8d8;
    margin-bottom: 8px;
    overflow: hidden;
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
      top: 65%;
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
      top: 40%;
      transform: rotate(-180deg);
    }
    .select_box {
      width: calc(100% + 2px);
      overflow: hidden;
      position: relative;
      left: -1px;
      z-index: 88;
      border: 1px solid #d8d8d8;
      border-top: none;
      .select_scroll {
        background-color: #fff;
        max-height: 300px;
        overflow-y: scroll;
        width: calc(100% + 17px);
        overflow-x: hidden;
      }
    }
    li {
      display: block;
      padding: 10px 10px;
      position: relative;
      z-index: 1;
      transition: 0.5s;
      &:hover {
        background: #52504d;
        transition: 0.3s;
      }
    }
  }
}
</style>
