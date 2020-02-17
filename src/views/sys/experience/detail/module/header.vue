<template>
  <div>
      <el-button icon="el-icon-arrow-left" @click="goBack" type="primary" >返回</el-button>
       <el-divider direction="vertical"></el-divider>
       <span style="fontSize:20px">详细页面</span>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    goBack() {
      this.$router.push("/experience");
    }
  }
};
</script>

<style scoped>
</style>