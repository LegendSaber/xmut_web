<template>
  <div>
    <o-carousel />
    <el-divider />
    <el-tag style="margin-left:200px;fontSize: 28px" type="danger" plain>青春是一个短暂的美梦, 当你醒来时, 它早已消失无踪</el-tag>
    <el-divider />
    <a href="addexperience?id=-1"><el-button
      type="primary"
      style="margin-bottom: 5px"
      icon="el-icon-circle-plus"
      :loading="loading"
    >发表经验</el-button></a>

    <el-tabs v-model="categoryName" type="card" @tab-click="categoryHandle">
      <el-tab-pane :disabled="loading" label="最新" name="new"></el-tab-pane>
      <el-tab-pane :disabled="loading" label="热门" name="hot"></el-tab-pane>
    </el-tabs>
     <div style="height:140px;" v-for="(table, index) in tableData" :key="index">
      <el-row v-loading="loading" :gutter="2">
          <el-col style="margin-top: 40px;" :offset="1" :span="2">
            <el-avatar v-if="table.img == null" shape="square" :size="60" :src="squareUrl"></el-avatar>
            <el-avatar v-else shape="square" :size="60" :src="table.img"></el-avatar>
          </el-col>
          <el-col style="margin-top: 28px;" :span="16">
            <el-row><a :href="'exdetail?id=' + table.id">{{table.title}}</a></el-row>
            <el-row style="margin-top:5px;fontSize: 14px;color:#767676;">{{table.content.slice(0, 48)}}...</el-row>
            <el-row style="margin-top:5px;">
              <span style="fontSize: 14px;color:#3b5998;cursor: pointer;" type="primary">{{table.author}}</span>
              <el-divider direction="vertical"></el-divider>
              <span style="fontSize: 14px;color: #767676;">发表于: {{table.createTime}}</span>
              <el-divider direction="vertical"></el-divider>
              <span style="fontSize: 14px;color: #767676;">收藏人数: {{table.favorNum}}</span>
            </el-row>
          </el-col>
          <el-col :offset="1" :span="1">
            <a :href="'exdetail?id=' + table.id"><el-button round style="margin-top: 24px;height:100px;" icon="el-icon-zoom-in" type="primary">查看</el-button></a>
          </el-col>
      </el-row>
      <el-row>
         <el-divider><i class="el-icon-s-data"></i></el-divider>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      squareUrl:"https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
      categoryName: "new",
      oldCategory: "new",
      tableData: [],
      loading: true,
      queryData: {
        isScroll: false,
        flag: 1,
        currentPage: 0,
        pageSize: 12
      },
    };
  },
  methods: {
    categoryHandle() {
      if (this.$data.oldCategory != this.$data.categoryName) {
        if (this.$data.categoryName === "new") {
          this.$data.queryData.flag = 1;
        } else if (this.$data.categoryName === "hot") {
          this.$data.queryData.flag = 2;
        } 
        this.getInitData()
        this.$data.oldCategory = this.$data.categoryName
      }
    },
    getInitData(){
      this.$data.queryData.currentPage = 0;
      this.$data.queryData.pageSize = 12;
      this.$data.loading = true;
      this.$data.queryData.isScroll = false;

      setTimeout(() => {
        this.getExperienceData();
        window.addEventListener("scroll", this.windowScroll);
        this.$data.queryData.currentPage =
          this.$data.queryData.pageSize / 2 + 1;
        this.$data.queryData.pageSize = 2;
        document.documentElement.scrollTop = 0;
        this.$data.loading = false;
      }, 2000);
    },
    getExperienceData() {
      let flag = this.$data.queryData.flag
      let params = {};
      params.currentPage = this.$data.queryData.currentPage;
      params.pageSize = this.$data.queryData.pageSize;
      params.flag = flag;
      
      this.$axios.get("/sysExperience/getAll", params).then(response => {
          if (response && response.success) {
            this.setData(response.data);
          }
        }); 
    },
    setData(data) {
      if (data == null) {
        this.$data.tableData = [];
        return;
      }
      
      let tmpData = data.records;
      let length = tmpData.length;
      if (!this.$data.queryData.isScroll) {
        this.$data.tableData = tmpData;

        for (let i = 0; i < length; i++) {
          this.$data.tableData[i].createTime = this.$data.tableData[
            i
          ].createTime.slice(0, 10);
          this.$data.tableData[i].modifyTime = this.$data.tableData[
            i
          ].modifyTime.slice(0, 10);
        }
      } else {
        for (let i = 0; i < length; i++) {
          tmpData[i].createTime = tmpData[i].createTime.slice(0, 10);
          tmpData[i].modifyTime = tmpData[i].modifyTime.slice(0, 10);
          this.$data.tableData.push(tmpData[i]);
        }
        if (length == 2) {
          this.$data.queryData.currentPage++;
        }
      }
      if (length < this.$data.queryData.pageSize) {
        this.$notify.error("没有更多数据");
        window.removeEventListener("scroll", this.windowScroll);
      }
    },
    windowScroll() {
      //滚动条滚动时距离顶部的距离
      let scrollTop = document.documentElement.scrollTop;
      //可视区的高度
      let windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      //滚动条总高度
      let scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;

      if (scrollTop + windowHeight == scrollHeight && !this.$data.loading) {
        this.$data.loading = true;
        setTimeout(() => {
          document.documentElement.scrollTop = scrollTop - 10;
          this.$data.queryData.isScroll = true;
          this.getExperienceData();
          this.$data.loading = false;
        }, 2000);
      }
    }
  },
  mounted() {
    window.addEventListener("scroll", this.windowScroll);
  },
  created() {
    this.getInitData()
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.windowScroll);
  }
};
</script>

<style scoped>
a {
    text-decoration: none;
    cursor: pointer;
    font-size: 18px;
    font-weight: 500;
    line-height: 1.6;
    margin: 0;
    padding: 0;
    color: #3b5998;
    background-color: transparent;
    font-family: PingFang SC,Verdana,Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,Microsoft Sans Serif,WenQuanYi Micro Hei,sans-serif;
}

a:hover{
  color: #da8d28e8;
}
</style>