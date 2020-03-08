<template>
  <el-container>
      <el-header>
        <origin-header></origin-header>
      </el-header>
      <el-main>
        <origin-main></origin-main>
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
    line-height: 60px;
    color: #333;
    text-align: center;
    font-size: 20px;
}
.el-main{
  background-color: #EAEDF1;
  background: url("../../assets/images/main.jpg");
}
</style>
