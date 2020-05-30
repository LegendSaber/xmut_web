<template>
  <div>
    <o-carousel/>
    <el-divider></el-divider>
    <el-row>
      <el-col :offset="4" :span="16">
          <ve-histogram :data="chartData"></ve-histogram>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  
export default {
    data (){
      return {
        chartData: {
            columns: ["日期", "新增经验贴", "新增知识贴", "新增文件数"],
            rows: []
        },
      }
    },
    created() {
      this.$axios.get("/sysAdmin/getChartData", {}).then(response => {
        if (response && response.success){
          this.$data.chartData.rows = response.data
        }
      })
    }
  }
</script>
<style scoped>
.el-tag {
  font-size: 24px;
}
#btn1 {
  font-size: 24px;
  margin-left: 600px
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>