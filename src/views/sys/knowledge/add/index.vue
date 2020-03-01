<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="标题" prop="title">
        <el-input :autosize="{maxRows: 1}" v-model="ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input :autosize="{minRows:30,maxRows: 30}" type="textarea" v-model="ruleForm.content"></el-input>
      </el-form-item>
      <el-form-item>
      <div>
        <el-upload
            action="http://localhost:8888/xmut/sysKnowledge/upload"
            list-type="picture-card"
            ref="upload"
            :with-credentials="true"
            :auto-upload="false"
            :before-upload="beforeAvatarUpload"
            :on-preview="handlePictureCardPreview">
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="ruleForm.dialogVisible">
            <img width="100%" :src="ruleForm.dialogImageUrl" alt="">
        </el-dialog>
      </div>
      </el-form-item>
      <el-form-item>
        <div class="demo-drawer__footer">
          <el-select v-model="ruleForm.value" placeholder="请选择类别">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button
            :loading="loading"
            type="primary"
            @click="submitForm('ruleForm')"
          >{{ loading ? '提交中 ...' : '提交' }}</el-button>
          <el-button type="warning" @click="resetForm('ruleForm')" plain>重置</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [
        {
          value: "数据结构与算法",
          label: "数据结构与算法"
        },
        {
          value: "操作系统",
          label: "操作系统"
        },
        {
          value: "计算机组成原理",
          label: "计算机组成原理"
        },
        {
          value: "计算机网络",
          label: "计算机网络"
        }
      ],
      loading: false,
      ruleForm: {
        title: "",
        content: "",
        value: "",
        dialogImageUrl: '',
        dialogVisible: false
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
            min: 10,
            max: 2000,
            message: "长度在 10 到 2000 个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    getFormatCode(strValue) {
      return strValue
        .replace(/\r\n/g, "<br/>")
        .replace(/\n/g, "<br/>")
        .replace(/\s/g, " ");
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (this.$data.ruleForm.value == ''){
          this.$alert("请选择文章类别!", "提交结果", {
            confirmButtonText: "确定"
          });
          return false;
        }
        if (valid) {
          let params = {};

          params.title = this.$data.ruleForm.title;
          if (this.$data.ruleForm.content != null)
            params.content = this.getFormatCode(this.$data.ruleForm.content);
          else params.content = this.$data.ruleForm.content;
          params.category = this.$data.ruleForm.value 
          this.$axios.post("/sysKnowledge/insert", params).then(response => {
            if (response && response.success) {
              this.$refs.upload.submit()
              this.$alert(response.message, "删除结果", {
                confirmButtonText: "确定",
                callback: action => {
                  this.$router.push("/knowledge")
                }
              });
            }
          })
        } else {
          this.$alert("表单信息填写有误，请修改!", "提交结果", {
            confirmButtonText: "确定"
          });
          return false;
        }
      });
    },
    resetForm(formName) {
        this.$data.ruleForm.value = ''
        this.$refs[formName].resetFields();
    },
    beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        
        return isJPG && isLt2M;
    },
    handlePictureCardPreview(file) {
        this.$data.ruleForm.dialogImageUrl = file.url;
        this.$data.ruleForm.dialogVisible = true;
    }
  }
};
</script>

<style>
</style>