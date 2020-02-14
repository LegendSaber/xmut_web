<template>
  <div>
    <o-carousel />
    <el-divider />
    <el-tag style="margin-left:200px;fontSize: 28px" type="danger" plain>青春是一个短暂的美梦, 当你醒来时, 它早已消失无踪</el-tag>
    <el-divider />
    <el-table
      :data="tableData"
      border
      style="width: 100%;fontSize:18px"
      v-loading="loading"
      element-loading-text="拼命加载中"
    >
      <el-table-column fixed prop="modifyTime" label="日期" width="300"></el-table-column>
      <el-table-column prop="author" label="作者" width="240"></el-table-column>
      <el-table-column prop="title" label="标题" width="240"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="primary">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      loading: true,
      queryData: {
        currentPage: 0,
        pageSize: 12,
      }
    };
  },
  methods: {
    handleClick(row) {},
    windowScroll() {
      //滚动条滚动时距离顶部的距离
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      //可视区的高度
      let windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      //滚动条总高度
      let scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;

      if (scrollTop + windowHeight == scrollHeight) {
        let params = {}
        params.currentPage = this.$data.queryData.currentPage
        params.pageSize = this.$data.queryData.pageSize
  
        this.$data.loading = true
        setTimeout(() => {
          this.$axios.post("/sysExperience/getAll", params).then(response => {
            if (response && response.data){
              let data = response.data.records

              if (data.length == 0){
                this.$notify.error("没有更多数据")
                window.removeEventListener("scroll", this.windowScroll)
              } else {
                data[0].modifyTime = data[0].modifyTime.slice(0, 10)
                data[1].modifyTime = data[1].modifyTime.slice(0, 10)
                this.$data.tableData.push(data[0])
                this.$data.tableData.push(data[1])
                this.$data.queryData.currentPage++
              }
            }
          })
          this.$data.loading = false
        }, 2000)
      }
    }
  },
  mounted() {
    window.addEventListener("scroll", this.windowScroll)
  },
  created() {
    let params = {}
    params.currentPage = this.$data.queryData.currentPage
    params.pageSize = this.$data.queryData.pageSize
    this.$axios.post("/sysExperience/getAll", params).then(response => {
      if (response && response.data) {
        this.$data.tableData = response.data.records
        let length = this.$data.tableData.length
        
        for (let i = 0; i < length; i++) {
          this.$data.tableData[i].modifyTime = this.$data.tableData[i].modifyTime.slice(0, 10)
        }

         this.$data.queryData.currentPage = (this.$data.queryData.pageSize / 2) + 1
         this.$data.queryData.pageSize = 2
         this.$data.loading = false
      }
    })
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.windowScroll)
  }
};
</script>
<style scoped>
</style>