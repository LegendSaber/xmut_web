<template>
  <div>
    <el-tag  type="primary" plain>
        我或许败北，或许迷失自己，
        或许哪里也抵达不了，
        </el-tag>
    <el-tag  type="primary" plain> 或许我已失去一切，
        任凭怎么挣扎也只能徒呼奈何，
        或许我只是徒然掬一把废墟灰烬，</el-tag>
    <el-tag  type="primary" plain>唯我一人蒙在鼓里，
        或许这里没有任何人把赌注下在我身上。
        无所谓。
        </el-tag>
    <el-tag  type="primary" plain>    有一点是明确的：至少我有值得等待,有值得寻求的东西。</el-tag>
    <el-divider></el-divider>
    <el-button id="btn1" type="danger" plain>——村上春树 《奇鸟行状录》</el-button>
    <el-divider></el-divider>
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