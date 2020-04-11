<template>
  <div>
    <el-row>
      <el-col :offset="6" :span="12">
        <el-card class="box-card">
          <el-row>
            <el-col :offset="9">
              <el-upload
                class="avatar-uploader"
                :action="'http://localhost:8888/xmut/sysUsermanager/saveAvatar?token=' + token"
                :show-file-list="false"
                :with-credentials="true"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-col>
          </el-row>
          <el-row>
            <el-divider>
              <i class="el-icon-picture-outline-round"></i>
            </el-divider>
          </el-row>
          <el-row>
            <ve-line :data="chartData"></ve-line>
          </el-row>
          <el-row>
            <el-divider>
              <i class="el-icon-picture-outline-round"></i>
            </el-divider>
          </el-row>
          <el-row>
            <el-col :offset="11" :span="2">
              <el-button icon="el-icon-s-data" type="warning">积分:{{currentUser.score}}</el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentUser: {},
      imageUrl: "",
      chartData: {
        columns: ["日期", "新增经验贴", "新增知识贴", "新增文件数"],
        rows: [
        ]
      },
      token: ""
    };
  },
  methods: {
    handleAvatarSuccess(response, file) {
      window.sessionStorage.setItem('user', JSON.stringify(response.data))
      
      this.$data.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 0.5;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 500kb!");
      }

      return isJPG && isLt2M;
    }
  },
  created() {
    this.$data.token = window.sessionStorage.getItem("token")
    let currentUser = JSON.parse(window.sessionStorage.getItem("user"));
    let params = {}
    params.id = currentUser.id
    this.$axios.get("/sysUser/getUserById", params).then(response => {
        if (response && response.success) {
            window.sessionStorage.setItem('user', JSON.stringify(response.data))
            this.$data.currentUser = JSON.parse(window.sessionStorage.getItem("user"));
            
            this.$axios.get("/sysUsermanager/getChartData", {}).then(response => {
                if (response && response.success) {
                    this.$data.chartData.rows = response.data
                }
            })

            this.$axios.get("/sysUsermanager/getAvatar", {}).then(response => {
              if (response && response.success) {
                this.$data.imageUrl = response.data
              }
            })
        }
    })   
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>