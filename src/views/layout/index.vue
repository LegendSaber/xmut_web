<template>
  <el-container style="height: 100%; border: 1px solid #eee">
      <el-header id="homeheader">
        <origin-header></origin-header>
      </el-header>
      <el-main>
        <div id="main">
          <origin-main></origin-main>
        </div>
      </el-main>
  </el-container>
</template>
<script>
import header from "./module/header"
import main from "./module/main"
export default {
  data() {
    return {}
  },
  components: {
    "origin-header": header,
    "origin-main": main
  },
  watch: {
    
  },
  mounted() {
    
  },
  methods: {
  }
};
</script>
<style>
#homeheader {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
    text-align: right;
    font-size: 20px;
}
#main{
  width: 55%;
  height: 100%;
  margin: 0 auto;
}
</style>
