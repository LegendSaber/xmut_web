<template>
  <div>
    <h1>{{essay}}</h1>
    <el-button v-if="!isCollect" @click="collect" type="primary" icon="el-icon-star-off" plain>点击收藏</el-button>
    <el-button v-else @click="cancelCollect" type="warning" icon="el-icon-star-on">已收藏</el-button>
    <el-button v-if="isMy" @click="deteleExperience" icon="el-icon-delete" type="danger" plain>删除</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      essay: {},
      isCollect: false,
      isMy: false
    };
  },
  methods: {
    deteleExperience() {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        let params = {};
        params.id = this.$data.essay.id;

        this.$axios
          .post("/sysExperience/deleteExperience", params)
          .then(response => {
            if (response && response.success) {
              this.$alert(response.message, "删除结果", {
                confirmButtonText: "确定",
                callback: action => {
                  this.goBack();
                }
              });
            }
          });
      });
    },
    collect() {
      let params = {};
      params.id = this.$data.essay.id;
      this.$axios.post("/collect/collectEx", params).then(response => {
        if (response && response.success) {
          this.$data.isCollect = true;
        }
      });
    },
    cancelCollect() {
      let params = {};
      params.id = this.$data.essay.id;
      this.$axios.post("/collect/cancelCollectEx", params).then(response => {
        if (response && response.success) {
          this.$data.isCollect = false;
        }
      });
    },
    goBack() {
      this.$router.push("/experience");
    }
  },
  created() {
    if (this.$route.query.content.id == null) this.goBack();
    this.$data.essay = this.$route.query.content;
    let params = {};
    params.id = this.$data.essay.id;
    this.$axios.post("/collect/getExCollect", params).then(response => {
      if (response && response.success) {
        this.$data.isCollect = true;
      } else {
        this.$data.isCollect = false;
      }
    });

    this.$axios.post("/sysExperience/isMyExperience", params).then(response => {
      if (response && response.success) {
        this.$data.isMy = true;
      } else {
        this.$data.isMy = false;
      }
    });
  }
};
</script>

<style scoped>
</style>