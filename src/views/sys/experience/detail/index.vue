<template>
  <div>
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-header id="detailheader">
        <experience-header />
      </el-header>
      <el-divider />
      <el-main>
        <div id="experiencemain">
          <experience-main />
        </div>
      </el-main>
    </el-container>
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
#detailheader{
  line-height: 60px;
  text-align: right;
  font-size: 20px;
}
</style>