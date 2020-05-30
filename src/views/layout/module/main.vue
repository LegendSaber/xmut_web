<template>
<div>
    <el-row>
        <el-col :span="16" :offset="4">
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
