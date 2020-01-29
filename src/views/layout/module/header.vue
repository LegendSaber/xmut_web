<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="打卡签到" name="first"></el-tab-pane>
    <el-tab-pane label="经验分享" name="second"></el-tab-pane>
    <el-tab-pane label="知识分享" name="third"></el-tab-pane>
    <el-tab-pane label="资料分享" name="fourth"></el-tab-pane>
  </el-tabs>
</template>
<script>
  export default {
    name: 'Header',
    data() {
      return {
        activeName: 'second'
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  };
</script>