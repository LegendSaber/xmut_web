<template>
  <div>
    <o-carousel />
    <el-divider />
    <el-tag style="margin-left:240px;fontSize: 28px" type="warning" plain>迷失的人就迷失了，相遇的人会再相遇。</el-tag>
    <el-divider />
    <el-upload
      class="upload-demo"
      :with-credentials = "true"
      action="http://localhost:8888/xmut/sysFile/upload"
      :show-file-list="false"
      :before-upload="beforeAvatarUpload"
      :on-success="handleAvatarSuccess"
      :on-error="handleAvatarError"
    >
      <el-button 
      :disabled="loading"
      icon="el-icon-upload" 
      size="small" 
      type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传zip文件，且不超过50M</div>
    </el-upload>
    <el-divider />
    <el-tabs v-model="categoryName" type="card" @tab-click="categoryHandle">
      <el-tab-pane :disabled="loading" label="最新" name="new"></el-tab-pane>
      <el-tab-pane :disabled="loading" label="热门" name="hot"></el-tab-pane>
      <el-tab-pane :disabled="loading" label="收藏" name="collect"></el-tab-pane>
      <el-tab-pane :disabled="loading" label="我的" name="my"></el-tab-pane>
    </el-tabs>
    <el-table
      :data="tableData"
      border
      :row-class-name="tableRowClassName"
      style="width: 100%;fontSize:18px"
      v-loading="loading"
      element-loading-text="拼命加载中"
    >
      <el-table-column min-width="130" prop="createTime" label="日期"></el-table-column>
      <el-table-column min-width="130" prop="author" label="作者"></el-table-column>
      <el-table-column min-width="280" prop="fileName" label="文件名"></el-table-column>
      <el-table-column min-width="280" label="操作">
        <template slot-scope="scope">
          <el-button @click="download(scope.row)" icon="el-icon-download" type="primary" plain>下载</el-button>
          <el-button
            v-if="queryData.flag == 1"
            icon="el-icon-folder-add"
            @click="cancelCollect(scope.row)"
            type="warning"
            plain
          >收藏</el-button>
          <el-button
            v-if="queryData.flag == 2"
            icon="el-icon-user"
            type="warning"
            plain
          >收藏人数:{{scope.row.favorNum}}</el-button>
          <el-button
            v-if="queryData.flag == 3"
            icon="el-icon-star-on"
            @click="cancelCollect(scope.row)"
            type="warning"
            plain
          >已收藏</el-button>
          <el-button
            v-if="queryData.flag == 4"
            icon="el-icon-delete"
            type="danger"
            @click="deleteFile(scope.row)"
            plain
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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
      queryData:{
        currentPage: 0,
        pageSize: 12,
        flag: 1,
        isScroll: false
      }
    };
  },
  methods: {
    handleAvatarSuccess(response, file) {
      this.$data.loading = false
      if (response.success) {
        this.$notify.success("上传成功");
        this.getInitData()
      } else {
        this.$notify.error(response.message);
      }
    },
    handleAvatarError() {
      this.$data.loading = false
      this.$notify.error("文件上传失败");
    },
    beforeAvatarUpload(file) {
      this.$data.loading = true
      //校验文件格式
      if (file.type.indexOf("zip") == -1) {
        this.$message.error("只能上传zip文件");
        return false;
      }

      //校验文件大小
      if (file.size / 1024 / 1024 > 50) {
        this.$message.error("上传的文件不可以超过50M");
        return false;
      }

      return true;
    },
    getInitData(){
      this.$data.queryData.currentPage = 0
        this.$data.queryData.pageSize = 12
        this.$data.loading = true
        this.$data.queryData.isScroll = false
        setTimeout(() => {
          this.getFileData()
          window.addEventListener("scroll", this.windowScroll);
          this.$data.queryData.currentPage =
              this.$data.queryData.pageSize / 2 + 1;
          this.$data.queryData.pageSize = 2;
          document.documentElement.scrollTop = 0
          this.$data.loading = false
          this.$data.oldCategory = this.$data.categoryName      
        }, 2000)
    },
    categoryHandle() {
      if (this.$data.oldCategory != this.$data.categoryName) {
        if (this.$data.categoryName === "new") {
          this.$data.queryData.flag = 1
        } else if (this.$data.categoryName === "hot") {
          this.$data.queryData.flag = 2
        } else if (this.$data.categoryName === "collect") {
          this.$data.queryData.flag = 3
        } else {
          this.$data.queryData.flag = 4
        }
        this.getInitData()
      }
    },
    getFileData(){
      let params = {}
      params.currentPage = this.$data.queryData.currentPage
      params.pageSize = this.$data.queryData.pageSize
      if (this.$data.queryData.flag == 1 || this.$data.queryData.flag == 2){
        params.flag = this.$data.queryData.flag
        this.$axios.post("/sysFile/getAll", params).then(response => {
          if (response && response.success) {
            this.setData(response.data)
          }
        })
      } else if (this.$data.queryData.flag == 3){

      } else {

      }
    },
    setData(data) {
      if (data == null) {
        this.$data.tableData = []
        return;
      }
      let tmpData = data.records
      let length = tmpData.length
      if (!this.$data.queryData.isScroll) {
        this.$data.tableData = tmpData

        for (let i = 0; i < length; i++) {
          this.$data.tableData[i].createTime = this.$data.tableData[i].createTime.slice(0, 10)
        }
      }else {
        for (let i = 0; i < length; i++){
          tmpData[i].createTime = tmpData[i].createTime.slice(0, 10)
          this.$data.tableData.push(tmpData[i])
        }
        if (length == 2) {
          this.$data.queryData.currentPage++
        }
      }
      if (length < this.$data.queryData.pageSize) {
          this.$notify.error("没有更多数据")
          window.removeEventListener("scroll", this.windowScroll);
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return "warning-row";
      }
      return "";
    },
    download(row) {
      
    },
    cancelCollect(row) {
      this.$confirm("确定要取消收藏吗? ").then(_ => {
      });
    },
    deleteFile(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        
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

      if (scrollTop + windowHeight == scrollHeight && !this.$data.loading) {
        this.$data.loading = true;
        setTimeout(() => {
          document.documentElement.scrollTop = scrollTop - 10;
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
    this.getInitData()
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.windowScroll);
  }
};
</script>

<style>
.el-table .warning-row {
  background: #f0f9eb;
}
</style>