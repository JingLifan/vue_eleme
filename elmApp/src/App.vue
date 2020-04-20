<template>
  <div id="app">
    <v-header :seller="this.seller"></v-header>
    <div class="tab border-1px">
      <router-link to="/goods" tag="div">
          商品
      </router-link>
      <router-link to="/ratings" tag="div">
          评价
      </router-link>
      <router-link to="/seller" tag="div">
          商家
      </router-link>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import header from './components/header/header.vue';
const ERR_OK = 0;
export default {
  data () {
    return {
      seller: {}
    };
  },
  components: {
    'v-header': header
  },
  created () {
    // 请求seller数据
    this.$ajax({
      method: 'GET',
      url: '/api/seller'
    }).then(res => {
      if (res.data.errno === ERR_OK) {
        this.seller = res.data.data;
      }
    });
  }
};
</script>
<style lang="stylus">
// 引入mixin.styl,需要使用stylus的语法@import引入
@import './common/style/mixin.styl';
  .tab
    display flex
    width 100%
    height 40px
    border-1px(rgba(7,17,27,0.1)) //使用mixin.styl中的函数
    div
      flex 1
      line-height 40px
      text-align center
      color rgb(77,85,93)
      font-size 14px
    .active
      color rgb(240,20,20)
</style>
