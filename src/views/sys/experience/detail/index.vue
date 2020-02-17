<template>
  <div>
    <o-carousel/>
    <el-divider />
    <el-tag style="margin-left: 240px;fontSize: 28px" type="success" plain>Pain is inevitable. Suffering is optional.</el-tag>
    <el-divider />
    <experience-header/>
    <el-divider />
    <experience-main/>
  </div>
</template>
<script>
import header from "./module/header";
import main from "./module/main";
export default {
  data() {
    return {};
  },
  components: {
    "experience-header": header,
    "experience-main": main
  },
  methods: {}
};
</script>
<style scoped>
</style>