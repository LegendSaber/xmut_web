<template>
  <el-container style="height: 100%; border: 1px solid #eee">
      <el-header style="text-align: right; font-size: 12px;">
        <origin-header></origin-header>
      </el-header>
      <origin-main></origin-main>
  </el-container>
</template>
<script>
import header from "./module/header";
import main from "./module/main";
export default {
  data() {
    return {
      screenWidth: document.body.clientWidth, // 屏幕宽度
    };
  },
  components: {
    "origin-header": header,
    "origin-main": main
  },
  watch: {
    screenWidth (val) {
      this.screenWidth = val
    }
  },
  mounted() {
    // 监听窗口大小
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth
      })()
    }
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
.el-aside {
   color: #333;
}
</style>
