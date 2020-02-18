<template>
  <div>
    <h1 style="fontSize:30px;">{{essay.title}}</h1>
    <div class="author-info">
      <el-button type="primary" plain style="fontSize:14px;">{{essay.author}}</el-button>
      <el-divider direction="vertical"></el-divider>
      <span style="fontSize:18px;">发表于: {{essay.createTime}}</span>
      <el-divider direction="vertical"></el-divider>
      <span>收藏人数: {{essay.favorNum}}</span>
    </div>
    <el-divider />
    <div v-html="essay.content" style="fontSize:20px;"></div>
    <el-divider />
    <el-button v-if="!isCollect" @click="collect" type="primary" icon="el-icon-star-off" plain>点击收藏</el-button>
    <el-button v-else @click="cancelCollect" type="warning" icon="el-icon-star-on">已收藏</el-button>
    <el-button v-if="isMy" @click="deteleExperience" icon="el-icon-delete" type="danger" plain>删除</el-button>
    <el-divider />
    <el-button
      @click="addComment"
      type="primary"
      style="margin-bottom: 5px"
      icon="el-icon-circle-plus"
    >评论</el-button>
    <el-dialog
      title="评论"
      :visible.sync="dialogFormVisible"
      :before-close="dialogclose"
      width="30%"
      :center="true"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item prop="content">
          <el-input  :autosize="{minRows:20,maxRows: 30}" type="textarea" v-model="ruleForm.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          :loading="dwloading"
          type="primary"
          @click="submitForm('ruleForm')"
        >{{ dwloading ? '提交中 ...' : '提交' }}</el-button>
        <el-button type="warning" @click="resetForm('ruleForm')" plain>重置</el-button>
      </div>
    </el-dialog>
    <el-tabs type="card" v-model="cardForm.category" @tab-click="commentHandleClick">
      <el-tab-pane label="最新" name="new"></el-tab-pane>
      <el-tab-pane label="热门" name="hot"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      essay: {},
      commentData: [],
      isCollect: false,
      isMy: false,
      cardForm: {
        category: "new",
        oldCategory: "new"
      },
      queryComment: {
        currentPage: 0,
        pageSize: 12,
        flag: 1
      },
      dwloading: false,
      dialogFormVisible: false,
      ruleForm: {
        content: ""
      },
      rules: {
        content: [
          { required: true, message: "请填写内容", trigger: "blur" },
          {
            min: 10,
            max: 100,
            message: "长度在 10 到 100 个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {}
          params.id = this.$data.essay.id
          params.content = this.$data.ruleForm.content
          this.$data.dwloading = true;
          this.$axios.post("/sysComment/insert", params).then(response => {
            if (response && response.success) {
              this.$data.dwloading = false;
            }
          })
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
    },
    dialogclose(done) {
      this.$confirm("确认关闭？")
        .then(() => {
          this.resetForm("ruleForm");
          done();
        })
    },
    addComment() {
      this.$data.dialogFormVisible = true;
    },
    commentHandleClick() {
      if (this.$data.cardForm.category != this.$data.cardForm.oldCategory) {
        let params = {};
        params.currentPage = this.$data.queryComment.currentPage;
        params.pageSize = this.$data.queryComment.pageSize;
        params.id = this.$data.essay.id;

        if (this.$data.cardForm.category == "new") params.flag = 1;
        else params.flag = 2;
        this.$axios.post("/sysComment/getAll", params).then(response => {
          if (response && response.success) {
            this.$data.commentData = response.data.records;
          }
        });
        this.$data.cardForm.oldCategory = this.$data.cardForm.category;
      }
    },
    getFormatCode(strValue) {
      return strValue
        .replace(/\r\n/g, "<br/>")
        .replace(/\n/g, "<br/>")
        .replace(/\s/g, " ");
    },
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