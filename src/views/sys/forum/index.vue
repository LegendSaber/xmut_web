<template>
  <div id="main">
    <carousel/>
    <div class="infinite-list-wrapper" style="overflow:auto">
      <ul
        class="list"
        v-infinite-scroll="load"
        infinite-scroll-disabled="disabled"
        infinite-scroll-distance="10">
        <li v-for="(item, index) in count" class="list-item" :key="index">{{ item }}</li>
      </ul>
      <p v-if="loading">加载中...</p>
      <p v-if="noMore">没有更多了</p>
    </div>
     <el-backtop target=".page-component__scroll .el-scrollbar__wrap"></el-backtop>
  </div>
</template>

<script>
  import carousel from "../../carousel/index"
  export default {
    data () {
      return {
        count: 10,
        loading: false
      }
    },
    components:{
      carousel
    },
    computed: {
      noMore () {
        return this.count >= 200
      },
      disabled () {
        return this.loading || this.noMore
      }
    },
    methods: {
      load () {
        this.loading = true
        setTimeout(() => {
          this.count += 2
          this.loading = false
        }, 200)
      }
    }
  }
</script>

<style>
#main {
  width: 1000px;
  height: 800px;
  margin: 0 auto;
}
</style>