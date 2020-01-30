<template>
  <el-row :gutter="2">
    <el-col :span="7" :offset="4">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="主页" name="first"></el-tab-pane>
        <el-tab-pane label="打卡签到区" name="second"></el-tab-pane>
        <el-tab-pane label="经验分享区" name="third"></el-tab-pane>
        <el-tab-pane label="知识分享区" name="fourth"></el-tab-pane>
        <el-tab-pane label="资料分享区" name="five"></el-tab-pane>
      </el-tabs>
    </el-col>
    <el-col :span="3" :offset="1">
       <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="input"/>  
    </el-col>
    <el-col :span="1">
       <el-button type="primary">搜索</el-button>
    </el-col>
    <el-col :span="6">
        <i class="el-icon-user"></i>
        <el-button type="primary" plain round>欢迎你, Master</el-button>  
        <el-badge value="new" class="item">
          <el-button type="warning" plain>评论</el-button>
        </el-badge>
        <el-badge value="hot" class="item">
          <el-button type="danger" plain>回复</el-button>
        </el-badge>
    </el-col>
  </el-row>
</template>
<script>
  export default {
    data() {
      return {
        activeName: 'first',
        input: ""
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  }
</script>
<style>
.item {
  margin-top: 0px;
  margin-right: 15px;
  margin-left: 5px;
}
</style>