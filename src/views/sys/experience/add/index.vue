<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="smart-green"
    >
      <h1>
        分享经验
        <span>请输入以下内容</span>
      </h1>
      <el-form-item style="margin-top: 40px;margin-left: 60px;" label="标题" prop="title">
        <el-input style="width: 40%;" :autosize="{maxRows: 1}" v-model="ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item style="margin-top: 30px;margin-left: 60px;" label="内容" prop="content">
        <el-input style="width: 80%;" :autosize="{minRows:30,maxRows: 40}" type="textarea" v-model="ruleForm.content"></el-input>
      </el-form-item>
      <el-form-item style="margin-top: 32px;margin-left: 60px;">
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button type="warning" @click="resetForm('ruleForm')" plain>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        title: "",
        content: "",
        essayId: -1
      },
      rules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          {
            min: 3,
            max: 40,
            message: "长度在 3 到 40 个字符",
            trigger: "blur"
          }
        ],
        content: [
          { required: true, message: "请填写内容", trigger: "blur" },
          {
            min: 5,
            max: 2000,
            message: "长度在 5 到 2000 个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    if (this.$route.query.id != -1) {
      let currentUser = JSON.parse(window.sessionStorage.getItem("user"));
      this.$data.ruleForm.essayId = this.$route.query.id;
      let getParams = {};
      getParams.id = this.$data.ruleForm.essayId;
      this.$axios
        .get("/sysExperience/getExperienceById", getParams)
        .then(response => {
          if (response && response.success) {
            let data = response.data;
            if (data.author != currentUser.username)
              this.$router.push("/experience");
            this.$data.ruleForm.title = data.title;
            this.$data.ruleForm.content = this.decryptCode(data.content);
          } else {
            this.$notify.error(response.message)
            this.$router.push("/experience");
          }
        });
    }
  },
  methods: {
    getFormatCode(strValue) {
      return strValue
        .replace(/\r\n/g, "<br/>")
        .replace(/\n/g, "<br/>")
        .replace(/\s/g, " ");
    },
    decryptCode(strValue) {
      return strValue
        .replace(/<br\s*\/?>/gi, "\r\n")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/\ \;/g, " ");
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {};
          params.title = this.$data.ruleForm.title;
          if (this.$data.ruleForm.content != null)
            params.content = this.getFormatCode(this.$data.ruleForm.content);
          else params.content = this.$data.ruleForm.content;
          if (this.$data.ruleForm.essayId == -1) {
            this.$axios.post("/sysExperience/insert", params).then(response => {
              if (response && response.success) {
                this.$alert(response.message, "提交结果", {
                  confirmButtonText: "确定",
                  callback: action => {
                    this.$router.push("/experience");
                  }
                });
              }
            });
          } else {
            params.id = this.$data.ruleForm.essayId;

            this.$axios
              .post("/sysExperience/modifyExperience", params)
              .then(response => {
                if (response && response.success) {
                  this.$alert(response.message, "提交结果", {
                    confirmButtonText: "确定",
                    callback: action => {
                      this.$router.push("/experience");
                    }
                  });
                }
              });
          }
        } else {
          this.$alert("表单信息填写有误，请修改!", "提交结果", {
            confirmButtonText: "确定",
            callback: action => {}
          });
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped>
.smart-green {
  background: #f8f8f8;
  font: 12px Arial, Helvetica, sans-serif;
  color: #666;
}
.smart-green h1 {
  font: 24px "Trebuchet MS", Arial, Helvetica, sans-serif;
  padding: 20px 0px 20px 40px;
  display: block;
  margin: -30px -30px 10px -30px;
  color: #fff;
  background: #9dc45f;
  text-shadow: 1px 1px 1px #949494;
  border-radius: 5px 5px 0px 0px;
  -webkit-border-radius: 5px 5px 0px 0px;
  -moz-border-radius: 5px 5px 0px 0px;
  border-bottom: 1px solid #89af4c;
}
.smart-green h1 > span {
  display: block;
  font-size: 11px;
  color: #fff;
}
</style>