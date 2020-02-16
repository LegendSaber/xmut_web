<template>
  <div>
    <h1>{{essay}}</h1>
    <el-button v-if="!isCollect" @click="collect" type="primary" icon="el-icon-star-off" plain>点击收藏</el-button>
    <el-button v-else @click="cancelCollect" type="warning" icon="el-icon-star-on">已收藏</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      essay: {},
      isCollect: false
    };
  },
  methods:{
      collect() {
          let params = {}
          params.id = this.$data.essay.id
          this.$axios.post("/collect/collectEx", params).then(response => {
              if (response && response.success){
                  this.$data.isCollect = true
              }
          })
      },
      cancelCollect() {
          let params = {}
          params.id = this.$data.essay.id
          this.$axios.post("/collect/cancelCollectEx", params).then(response => {
              if (response && response.success){
                  this.$data.isCollect = false
              }
          })
      }
  },
  created() {
    if (this.$route.query.content.id == null) this.goBack();
    this.$data.essay = this.$route.query.content;
    let params = {};
    params.id = this.$data.essay.id
    this.$axios.post("/collect/getExCollect", params).then(response =>{
        if (response && response.success){
            this.$data.isCollect = true
        }else {
            this.$data.isCollect = false
        }
    })
  }
};
</script>

<style scoped>
</style>