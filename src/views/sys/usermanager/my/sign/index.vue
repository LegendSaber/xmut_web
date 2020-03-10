<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/mydata' }">个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>我的签到</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row>
          <el-button icon="el-icon-s-flag" type="success">累计签到次数:{{currentUser.signDay}}</el-button>
          <el-button icon="el-icon-success" type="warning">共签到:{{total}}次</el-button>
          <el-button icon="el-icon-notebook-2" type="primary">签到情况如下:</el-button>
      </el-row>
      <el-table :data="signList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="签到人"></el-table-column>
        <el-table-column prop="createTime" label="签到日期"></el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.currentPage"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentUser:{},
      signList: {},
      queryInfo: {
        currentPage: 1,
        pageSize: 4
      },
      total: 0
    };
  },
  created() {
    this.getSignList();
    let currentUser = JSON.parse(window.sessionStorage.getItem("user"));
    let params = {}
    params.id = currentUser.id
    this.$axios.get("/sysUser/getUserById", params).then(response => {
        if (response && response.success) {
            window.sessionStorage.setItem('user', JSON.stringify(response.data))
            this.$data.currentUser = JSON.parse(window.sessionStorage.getItem("user"));
        }
    })
  },
  methods: {
    getSignList() {
      let params = {};

      params.currentPage = this.$data.queryInfo.currentPage;
      params.pageSize = this.$data.queryInfo.pageSize;

      this.$axios.get("/sysSign/getMySign", params).then(response => {
        if (response && response.success) {
          this.$data.signList = response.data.records;
          this.$data.total = response.data.total;
          let len = response.data.records.length;

          for (let i = 0; i < len; i++) {
            this.$data.signList[i].createTime = this.$data.signList[
              i
            ].createTime.slice(0, 10);
          }
        }
      });
    },
    handleSizeChange(newSize) {
        this.$data.queryInfo.pageSize = newSize;
        this.getSignList();
    },
    handleCurrentChange(newPage) {
        this.$data.queryInfo.currentPage = newPage;
        this.getSignList();
    }
  }
};
</script>

<style scoped>
</style>