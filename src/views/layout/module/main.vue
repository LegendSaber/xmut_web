<template>
<div>
    <el-row>
        <el-col :span="14" :offset="5">
            <el-card class="box-card">
                <router-view/>
            </el-card>
        </el-col>
    </el-row>
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
</style>
