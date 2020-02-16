<template>
    <div>
        <el-row :gutter="2">
            <el-page-header @back="goBack" content="详情页面"></el-page-header>
        </el-row>
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