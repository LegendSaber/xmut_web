<template>
  <el-container style="height: 100%; border: 1px solid #eee">
      <el-header style="text-align: right; font-size: 20px;">
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
.el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
}
#main{
  width: 1000px;
  height: 100%;
  margin: 0 auto;
}
</style>
