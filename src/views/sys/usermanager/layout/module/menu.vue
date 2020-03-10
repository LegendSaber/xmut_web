<template>
  <div>
    <div class="toggle-button" @click="toggleCollapse">|||</div>
    <el-menu
      class="el-menu-vertical-demo"
      background-color="#333744"
      text-color="#fff"
      active-text-color="#ffd04b"
      unique-opened
      :collapse="isCollapse"
      :collapse-transition="false"
      @select="handleSelect"
    >
      <el-menu-item v-if="isMaster" index="1">
        <i class="el-icon-message-solid"></i>
        <span slot="title">我的签到</span>
      </el-menu-item>
      <el-menu-item v-if="isMaster" index="5">
        <i class="el-icon-user-solid"></i>
        <span slot="title">我的资料</span>
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-s-data"></i>
          <span>经验模块</span>
        </template>
        <el-menu-item index="2-1">
          <i class="el-icon-s-comment"></i>
          <span slot="title">我的经验</span>
        </el-menu-item>
        <el-menu-item index="2-2">
          <i class="el-icon-s-opportunity"></i>
          <span slot="title">我的收藏</span>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-share"></i>
          <span>知识模块</span>
        </template>
        <el-menu-item index="3-1">
          <i class="el-icon-s-order"></i>
          <span slot="title">我的知识</span>
        </el-menu-item>
        <el-menu-item index="3-2">
          <i class="el-icon-s-promotion"></i>
          <span slot="title">我的收藏</span>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-upload"></i>
          <span>文件模块</span>
        </template>
        <el-menu-item index="4-1">
          <i class="el-icon-s-marketing"></i>
          <span slot="title">我的文件</span>
        </el-menu-item>
        <el-menu-item index="4-2">
          <i class="el-icon-s-management"></i>
          <span slot="title">我的收藏</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: true,
      isMaster: false 
    };
  },
  created(){
    if (JSON.parse(window.sessionStorage.getItem("user")).roleName === "研友") this.$data.isMaster = true
  },
  methods: {
    toggleCollapse() {
      this.$data.isCollapse = !this.$data.isCollapse
      this.$emit("changeCollapse", this.$data.isCollapse)
    },
    handleSelect(index, indexPath) {
      if (index == "1") {
        if (this.$route.path != "/mysign") this.$router.push("/mysign")
      } else if (index == "2-1") {
        if (this.$route.path != "/myexperience") this.$router.push("/myexperience")
      } else if (index == "2-2") {
        if (this.$route.path != "/collectex") this.$router.push("/collectex")
      } else if (index == "3-1"){
        if (this.$route.path != "/myknowledge") this.$router.push("/myknowledge")
      } else if (index == "3-2"){
        if (this.$route.path != "/collectkn") this.$router.push("/collectkn")
      } else if (index == "4-1"){
        if (this.$route.path != "/myfile") this.$router.push("/myfile")  
      }else if (index == "4-2"){
        if (this.$route.path != "/collectfile") this.$router.push("/collectfile")  
      } else if (index == "5") {
          if (this.$route.path != '/mydata') this.$router.push("/mydata")
      }
    }
  }
};
</script>

<style scoped>
.toggle-button {
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>