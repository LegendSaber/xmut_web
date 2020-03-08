<template>
<div>
    <!-- <div class="homemain"> -->
        <el-row>
            <el-col :span="14" :offset="5">
                <el-card class="box-card">
                    <router-view/>
                </el-card>
            </el-col>
        </el-row>
    <!-- </div> -->

</div>
</template>

<script>
 export default {
    data() {
      return {
      };
    }
  }
</script>
<style scoped>
.homemain{
    width: 55%;
    height: 100%;
    /* margin: 0 auto; */
    margin-left: 10%; 
}
</style>
