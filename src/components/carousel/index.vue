<template>
    <el-carousel :interval="2000" type="card" height="300px">
      <el-carousel-item>
        <img src="@/assets/images/1.png"/>
      </el-carousel-item>
      <el-carousel-item>
        <img src="@/assets/images/2.png"/>
      </el-carousel-item>
      <el-carousel-item>
        <img src="@/assets/images/3.png"/>
      </el-carousel-item>
      <el-carousel-item>
        <img src="@/assets/images/4.png"/>
      </el-carousel-item>
      <el-carousel-item>
        <img src="@/assets/images/5.png"/>
      </el-carousel-item>
      <el-carousel-item>
        <img src="@/assets/images/6.png"/>
      </el-carousel-item>
    </el-carousel>
</template>

<script>
    export default {
        name: 'Carousel'
    }
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