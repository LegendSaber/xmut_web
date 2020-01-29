<template>
  <div>
    <el-row>
      <el-button type="primary" plain>
        我或许败北，或许迷失自己，
        或许哪里也抵达不了，
        或许我已失去一切，
        任凭怎么挣扎也只能徒呼奈何，
        或许我只是徒然掬一把废墟灰烬，
        唯我一人蒙在鼓里，
        或许这里没有任何人把赌注下在我身上。
        无所谓。
        有一点是明确的：至少我有值得等待,有值得寻求的东西。</el-button>
    </el-row>
    <el-divider></el-divider>
    <el-row>
      <el-button type="danger" plain>——村上春树 《奇鸟行状录》</el-button>
    </el-row>
    <el-divider></el-divider>
    <el-carousel :interval="2000" type="card" height="300px">
      <el-carousel-item>
        <img src="../../assets/1.png"/>
      </el-carousel-item>
      <el-carousel-item>
        <img src="../../assets/2.png"/>
      </el-carousel-item>
      <el-carousel-item>
        <img src="../../assets/3.png"/>
      </el-carousel-item>
      <el-carousel-item>
        <img src="../../assets/4.png"/>
      </el-carousel-item>
      <el-carousel-item>
        <img src="../../assets/5.png"/>
      </el-carousel-item>
      <el-carousel-item>
        <img src="../../assets/6.png"/>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
</script>
<style>
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