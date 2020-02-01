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
      <el-dropdown @command="handleCommand">
          <i class="el-icon-setting"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="user">个人中心</el-dropdown-item>
            <el-dropdown-item command="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>{{username}}</span>  
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
        input: "",
        username: "",
        currentUser: {}
      };
    },
    methods: {
      created() {
        alert("1111")
        let currentUser = JSON.parse(window.sessionStorage.getItem('user'))
        console.log(currentUser)
        if (currentUser) {
          this.$data.currentUser = currentUser
          this.$data.username = this.$data.currentUser.username
        }
      },
      handleCommand() {
        if (command == "logout"){
          
        }
      },
      handleClick() {
        if (this.activeName === "first" && this.$route.path != "/dashbord"){
          this.$router.push("/dashbord");
        } else if (this.activeName === "second" && this.$route.path != "/sign") {
          this.$router.push("/sign")
        }
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