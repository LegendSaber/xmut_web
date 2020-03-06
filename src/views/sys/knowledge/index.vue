<template>
  <div>
    <o-carousel />
    <el-divider />
    <el-tag style="margin-left:200px;fontSize: 28px" type="success" plain>时代不同，空气不同，人的想法也随之不同。</el-tag>
    <el-divider />
    <el-button
      @click="addKnowledge"
      type="primary"
      style="margin-bottom: 5px"
      icon="el-icon-circle-plus"
      :loading="loading"
    >分享知识</el-button>
    <div>
      <el-row>
        <el-col :span="21">
          <el-tabs v-model="categoryName" type="card" @tab-click="categoryHandle">
            <el-tab-pane :disabled="loading" label="最新" name="new"></el-tab-pane>
            <el-tab-pane :disabled="loading" label="热门" name="hot"></el-tab-pane>
            <el-tab-pane :disabled="loading" label="收藏" name="collect"></el-tab-pane>
            <el-tab-pane :disabled="loading" label="我的" name="my"></el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="1">
          <el-dropdown @command="handleCommand" style="margin-top:6px;">
            <el-button type="primary">
              知识类别<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">数据结构与算法</el-dropdown-item>
              <el-dropdown-item command="b">操作系统</el-dropdown-item>
              <el-dropdown-item command="c">计算机组成原理</el-dropdown-item>
              <el-dropdown-item command="d">计算机网络</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </div>
    <el-table
      :data="tableData"
      border
      :row-class-name="tableRowClassName"
      style="width: 100%;fontSize:18px"
      v-loading="loading"
      element-loading-text="拼命加载中"
    >
      <el-table-column min-width="120" prop="createTime" label="日期"></el-table-column>
      <el-table-column min-width="110" prop="author" label="作者"></el-table-column>
      <el-table-column min-width="240" prop="title" label="标题"></el-table-column>
      <el-table-column min-width="350" label="操作">
        <template slot-scope="scope">
          <el-button @click="show(scope.row.id)" icon="el-icon-zoom-in" type="primary" plain>查看</el-button>
          <el-button
            v-if="queryData.flag == 1"
            icon="el-icon-bell"
            type="success"
            plain
          >更新日期:{{scope.row.modifyTime}}</el-button>
          <el-button
            v-if="queryData.flag == 2"
            icon="el-icon-user"
            type="warning"
            plain
          >收藏人数:{{scope.row.favorNum}}</el-button>
          <el-button
            v-if="queryData.flag == 3"
            icon="el-icon-star-on"
            @click="cancelCollect(scope.row.id)"
            type="warning"
            plain
          >已收藏</el-button>
          <el-button
            v-if="queryData.flag == 4"
            icon="el-icon-edit"
            type="warning"
            @click="editKnowledge(scope.row.id)"
            plain
          >编辑</el-button>
          <el-button
            v-if="queryData.flag == 4"
            icon="el-icon-delete"
            type="danger"
            @click="deleteKnowledge(scope.row.id)"
            plain
          >删除</el-button>
          <el-button
            type="info"
            plain
          >{{scope.row.category}}</el-button>
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
      queryData: {
        currentPage: 0,
        pageSize: 12,
        category: '数据结构与算法',
        flag: 1,
        isScroll: false
      }
    };
  },
  methods: {
    addKnowledge(){
      this.$router.push('/addKnowledge')
    },
    handleCommand(command) {
        if (command == 'a' && this.$data.queryData.category != '数据结构与算法'){
          this.$data.queryData.category = '数据结构与算法'
          this.getInitData()
        } else if (command == 'b' && this.$data.queryData.category != '操作系统'){
          this.$data.queryData.category = '操作系统'
          this.getInitData()
        } else if (command == 'c' && this.$data.queryData.category != '计算机组成原理'){
          this.$data.queryData.category = '计算机组成原理'
          this.getInitData()
        } else if (command == 'd' && this.$data.queryData.category != '计算机网络'){
          this.$data.queryData.category = '计算机网络'
          this.getInitData()
        }
    },
    categoryHandle() {
      if (this.$data.oldCategory != this.$data.categoryName) {
        if (this.$data.categoryName === "new") {
          this.$data.queryData.flag = 1;
        } else if (this.$data.categoryName === "hot") {
          this.$data.queryData.flag = 2;
        } else if (this.$data.categoryName === "collect") {
          this.$data.queryData.flag = 3;
        } else {
          this.$data.queryData.flag = 4;
        }
        this.getInitData();
        this.$data.oldCategory = this.$data.categoryName;
      }
    },
    show(id) {
      window.sessionStorage.setItem("knowledge_id", id);
      this.$router.push("/kndetail");
    },
    cancelCollect(id) {
      this.$confirm("确定要取消收藏吗? ").then(_ => {
        let params = {};
        params.id = id;

        this.$axios.post("/sysKnowledge/cancelCollect", params).then(response => {
          if (response && response.success) {
            this.$notify.success(response.message);
            this.getInitData();
          }
        });
      });
    },
    editKnowledge(id){
      window.sessionStorage.setItem("editKnowledge_id", id);
      this.$router.push("/addKnowledge");
    },
    deleteKnowledge(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        let params = {};
        params.id = id;

        this.$axios.post("sysKnowledge/delete", params).then(response => {
          if (response && response.success) {
            this.$alert(response.message, "删除结果", {
              confirmButtonText: "确定",
              callback: action => {
                this.getInitData();
              }
            });
          }
        });
      });
    },
    getInitData() {
      this.$data.queryData.currentPage = 0;
      this.$data.queryData.pageSize = 12;
      this.$data.loading = true;
      this.$data.queryData.isScroll = false;
      setTimeout(() => {
        this.getKnowledgeData();
        window.addEventListener("scroll", this.windowScroll);
        this.$data.queryData.currentPage =
          this.$data.queryData.pageSize / 2 + 1;
        this.$data.queryData.pageSize = 2;
        document.documentElement.scrollTop = 0;
        this.$data.loading = false;
      }, 2000);
    },
    getKnowledgeData() {
      let params = {};
      params.currentPage = this.$data.queryData.currentPage;
      params.pageSize = this.$data.queryData.pageSize;
      params.category = this.$data.queryData.category
      if (this.$data.queryData.flag == 1 || this.$data.queryData.flag == 2) {
        params.flag = this.$data.queryData.flag;
        this.$axios.get("/sysKnowledge/getAll", params).then(response => {
          if (response && response.success) {
            this.setData(response.data);
          }
        });
      } else if (this.$data.queryData.flag == 3) {
        this.$axios.get("/sysKnowledge/getFavorKnowledge", params).then(response => {
          if (response && response.success) {
            this.setData(response.data);
          }
        });
      } else {
        this.$axios.get("/sysKnowledge/getMyKnowledge", params).then(response => {
          if (response && response.success) {
            this.setData(response.data);
          }
        });
      }
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
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return "warning-row";
      }
      return "";
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
          this.getKnowledgeData();
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
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
