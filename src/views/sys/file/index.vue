<template>
  <div>
    <o-carousel />
    <el-divider />
    <el-upload
      class="upload-demo"
      :with-credentials="true"
      :action="'http://localhost:8888/xmut/sysFile/upload?token=' + token"
      :show-file-list="false"
      :before-upload="beforeAvatarUpload"
      :on-success="handleAvatarSuccess"
      :on-error="handleAvatarError"
    >
      <el-button :disabled="loading" icon="el-icon-upload" size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传zip文件，且不超过500kb</div>
    </el-upload>
    <el-divider />
    <el-tabs v-model="categoryName" type="card" @tab-click="categoryHandle">
      <el-tab-pane :disabled="loading" label="最新" name="new"></el-tab-pane>
      <el-tab-pane :disabled="loading" label="热门" name="hot"></el-tab-pane>
    </el-tabs>
    <div style="height:120px;" v-for="(table, index) in tableData" :key="index">
      <el-row v-loading="loading" :gutter="2">
          <el-col style="margin-top: 40px;" :offset="1" :span="2">
            <el-avatar v-if="table.img == null" shape="square" :size="60" :src="squareUrl"></el-avatar>
            <el-avatar v-else shape="square" :size="60" :src="table.img"></el-avatar>
          </el-col>
          <el-col style="margin-top: 32px;" :span="16">
            <el-row><a @click="download(table.id)">{{table.fileName}}</a></el-row>
            <el-row style="margin-top:8px;">
              <span style="fontSize: 14px;color:#3b5998;cursor: pointer;" type="primary">{{table.author}}</span>
              <el-divider direction="vertical"></el-divider>
              <span style="fontSize: 14px;color: #767676;">于{{table.createTime}}上传</span>
              <el-divider direction="vertical"></el-divider>
              <span style="fontSize: 14px;color: #767676;">收藏人数: {{table.favorNum}}</span>
            </el-row>
          </el-col>
          <el-col :offset="1" :span="1">
            <el-button @click="download(table.id)" round style="margin-top: 24px;height:80px;" icon="el-icon-download" type="primary">下载</el-button>
          </el-col>
          <el-col :offset="1" :span="1">
            <el-button @click="collect(table.id)" round style="margin-top: 24px;height:80px;" icon="el-icon-folder-add" type="warning">收藏</el-button>
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
      categoryName: "new",
      oldCategory: "new",
      tableData: [],
      loading: true,
      queryData: {
        currentPage: 0,
        pageSize: 12,
        flag: 1,
        isScroll: false
      },
      token: ""
    };
  },
  methods: {
    handleAvatarSuccess(response, file) {
      this.$data.loading = false;
      if (response.success) {
        this.$notify.success("上传成功");
        this.getInitData();
      } else {
        this.$notify.error(response.message);
      }
    },
    handleAvatarError() {
      this.$data.loading = false;
      this.$notify.error("文件上传失败");
    },
    beforeAvatarUpload(file) {
      this.$data.loading = true;
      //校验文件格式
      if (file.type.indexOf("zip") == -1) {
        this.$message.error("只能上传zip文件");
        this.$data.loading = false;
        return false;
      }

      //校验文件大小
      if (file.size / 1024 / 1024 > 0.5) {
        this.$message.error("上传的文件不可以超过500kb");
        this.$data.loading = false;
        return false;
      }

      return true;
    },
    getInitData() {
      this.$data.queryData.currentPage = 0;
      this.$data.queryData.pageSize = 12;
      this.$data.loading = true;
      this.$data.queryData.isScroll = false;
      setTimeout(() => {
        this.getFileData();
        window.addEventListener("scroll", this.windowScroll);
        this.$data.queryData.currentPage =
          this.$data.queryData.pageSize / 2 + 1;
        this.$data.queryData.pageSize = 2;
        document.documentElement.scrollTop = 0;
        this.$data.loading = false;
      }, 2000);
    },
    categoryHandle() {
      if (this.$data.oldCategory != this.$data.categoryName) {
        if (this.$data.categoryName === "new") {
          this.$data.queryData.flag = 1;
        } else if (this.$data.categoryName === "hot") {
          this.$data.queryData.flag = 2;
        } 
        this.getInitData();
        this.$data.oldCategory = this.$data.categoryName;
      }
    },
    getFileData() {
      let params = {};
      params.currentPage = this.$data.queryData.currentPage;
      params.pageSize = this.$data.queryData.pageSize;
      
        params.flag = this.$data.queryData.flag;
        this.$axios.get("/sysFile/getAll", params).then(response => {
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
        }
      } else {
        for (let i = 0; i < length; i++) {
          tmpData[i].createTime = tmpData[i].createTime.slice(0, 10);
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
    download(id) {
      window.open("http://localhost:8888/xmut/sysFile/download?id=" + id + "&token=" + this.$data.token)
    },
    collect(id) {
      let params = {};
      params.id = id;
      this.$axios.post("/sysFile/collect", params).then(response => {
        if (response && response.success) {
          this.$notify.success(response.message);
          this.getInitData();
        } else {
          this.$notify.error(response.message);
        }
      });
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

      if (scrollHeight - (scrollTop + windowHeight) <= 1 && !this.$data.loading) {
        this.$data.loading = true;
        setTimeout(() => {
          document.documentElement.scrollTop = scrollTop - 3;
          this.$data.queryData.isScroll = true;
          this.getFileData();
          this.$data.loading = false;
        }, 2000);
      }
    }
  },
  mounted() {
    window.addEventListener("scroll", this.windowScroll);
  },
  created() {
    this.getInitData();
    this.$data.token = window.sessionStorage.getItem("token")
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