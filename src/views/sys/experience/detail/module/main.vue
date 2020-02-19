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
      title="评论/回复"
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
        <el-form-item label="内容" prop="content">
          <el-input :autosize="{minRows:10,maxRows: 30}" type="textarea" v-model="ruleForm.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          :loading="dwloading"
          type="primary"
          @click="submitForm('ruleForm')"
        >{{ dwloading ? '提交中 ...' : '提交' }}</el-button>
        <el-button type="warning" @click="resetForm('ruleForm')" plain>重置</el-button>
        <el-button @click="cancelForm" type="danger" plain>取 消</el-button>
      </div>
    </el-dialog>
    <el-tabs type="card" v-model="cardForm.category" @tab-click="commentHandleClick">
      <el-tab-pane label="最新" name="new"></el-tab-pane>
      <el-tab-pane label="热门" name="hot"></el-tab-pane>
    </el-tabs>
    <div style="margin-left: 50px;" v-for="(comment, index) in commentData" :key="index">
      <div style="fontSize: 20px;" v-html="comment.content"></div>
      <br />
      <div style="fontSize:10px;">
        <el-link type="primary">{{comment.author}}</el-link>
        <el-divider direction="vertical"></el-divider>
        <span>发表于: {{comment.createTime}}</span>
        <el-divider direction="vertical"></el-divider>
        <span>推荐人数: {{comment.favorNum}}</span>
        <el-divider direction="vertical"></el-divider>
        <el-link @click="recommend(comment.id)" type="warning">推荐</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link @click="replace(comment)" type="danger">回复</el-link>
        <el-divider />
        <div v-for="(son, index) in comment.sonComment" :key="index">
          <div style="margin-left:80px;fontSize: 15px;" v-html="son.content"></div>
          <br/>
          <div style="fontSize: 10px;margin-left:80px;">
            <el-link type="success">{{son.author}}</el-link>
            <el-divider direction="vertical"></el-divider>
            <span>回复于: {{son.createTime}}</span>
          </div> 
          <el-divider/>
        </div>
      </div>
    </div>
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
        flag: 1,
        isScroll: false,
        selectId: -1,
        selectAuthor: "",
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
    addComment(){
      this.$data.queryComment.selectId = -1
      this.$data.dialogFormVisible = true;
    },
    replace(comment) {
      this.$data.queryComment.selectId = comment.id
      this.$data.queryComment.selectAuthor = comment.author;
      this.$data.dialogFormVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.$data.queryComment.selectId == -1){
            let params = {};
            params.id = this.$data.essay.id;
            params.content = this.getFormatCode(this.$data.ruleForm.content);
            this.$data.dwloading = true;
            setTimeout(() => {
              this.$axios.post("/sysComment/insert", params).then(response => {
                if (response && response.success) {
                  this.$alert(response.message, "提交结果", {
                    confirmButtonText: "确定",
                    callback: action => {
                      this.resetForm("ruleForm");
                      this.$data.dwloading = false;
                      this.$data.dialogFormVisible = false;
                      this.$data.queryComment.currentPage = 0;
                      this.$data.queryComment.pageSize = 12;
                      this.$data.queryComment.isScroll = false;
                      this.getComment();
                      this.$data.queryComment.currentPage =
                        this.$data.queryComment.pageSize / 2 + 1;
                      this.$data.queryComment.pageSize = 2;
                      window.addEventListener("scroll", this.windowScroll);
                    }
                  });
                }
              });
            }, 2000);
          } else {
            let params = {}
            params.id = this.$data.queryComment.selectId
            params.author = this.$data.queryComment.selectAuthor
            params.content = this.getFormatCode(this.$data.ruleForm.content);
            this.$data.dwloading = true;
            setTimeout(() => {
              this.$axios.post("/sysComment/insertSon", params).then(response => {
                if (response && response.success) {
                  this.$alert(response.message, "提交结果", {
                    confirmButtonText: "确定",
                    callback: action => {
                      this.resetForm("ruleForm");
                      this.$data.dwloading = false;
                      this.$data.dialogFormVisible = false;
                      this.$data.queryComment.currentPage = 0;
                      this.$data.queryComment.pageSize = 12;
                      this.$data.queryComment.isScroll = false;
                      this.getComment();
                      this.$data.queryComment.currentPage =
                        this.$data.queryComment.pageSize / 2 + 1;
                      this.$data.queryComment.pageSize = 2;
                      window.addEventListener("scroll", this.windowScroll);
                    }
                  });
                }
              })
            }, 2000)
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
    },
    dialogclose(done) {
      if (this.$data.dwloading) return;
      this.$confirm("确认关闭？").then(() => {
        this.resetForm("ruleForm");
        done();
      });
    },
    cancelForm() {
      this.resetForm("ruleForm");
      this.$data.dwloading = false;
      this.$data.dialogFormVisible = false;
    },
    getComment() {
      let params = {};
      params.currentPage = this.$data.queryComment.currentPage;
      params.pageSize = this.$data.queryComment.pageSize;
      params.id = this.$data.essay.id;
      params.flag = this.$data.queryComment.flag;

      this.$axios.post("/sysComment/getAll", params).then(response => {
        if (response && response.success) {    
          if (response.data == null){
              window.removeEventListener("scroll", this.windowScroll);
              return;
          }
          if (!this.$data.queryComment.isScroll) {
            this.$data.commentData = response.data.records;
            let len = this.$data.commentData.length;
            for (let i = 0; i < len; i++) {
              this.$data.commentData[i].createTime = this.$data.commentData[
                i
              ].createTime.slice(0, 10);
              this.$data.commentData[i].sonComment.sort(this.sortFun)
              let sonLen = this.$data.commentData[i].sonComment.length;
              for (let j = 0; j < sonLen; j++) {
                this.$data.commentData[i].sonComment[j].createTime = this.$data.commentData[i].sonComment[j].createTime.slice(0, 10)
              }
            }
            
            if (len < this.$data.queryComment.pageSize) {
              window.removeEventListener("scroll", this.windowScroll);
            }
          } else {
            let tmp = response.data.records;
            let len = tmp.length;
            if (len == 2) {
              tmp[0].createTime = tmp[0].createTime.slice(0, 10);
              tmp[1].createTime = tmp[1].createTime.slice(0, 10);
              this.$data.commentData.push(tmp[0]);
              this.$data.commentData.push(tmp[1]);
              this.$data.queryComment.currentPage++;
            } else {
              if (len == 1) {
                tmp[0].createTime = tmp[0].createTime.slice(0, 10);
                this.$data.commentData.push(tmp[0]);
              }
              this.$notify.error("没有更多数据了");
              window.removeEventListener("scroll", this.windowScroll);
            }
          }
        }
      });
    },
    sortFun(x, y){
      return x.createTime - y.createTime
    },
    commentHandleClick() {
      if (this.$data.cardForm.category != this.$data.cardForm.oldCategory) {
        if (this.$data.cardForm.category == "new")
          this.$data.queryComment.flag = 1;
        else this.$data.queryComment.flag = 2;
        this.$data.queryComment.currentPage = 0;
        this.$data.queryComment.pageSize = 12;
        this.$data.queryComment.isScroll = false;
        this.getComment();
        this.$data.cardForm.oldCategory = this.$data.cardForm.category;
        this.$data.queryComment.currentPage =
          this.$data.queryComment.pageSize / 2 + 1;
        this.$data.queryComment.pageSize = 2;
        window.addEventListener("scroll", this.windowScroll);
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
    },
    recommend(id) {
      let params = {};
      params.id = id;

      this.$axios.post("/sysComment/recommend", params).then(response => {
        this.$alert(response.message, "推荐结果", {
          confirmButtonText: "确定",
          callback: action => {
            this.$data.queryComment.currentPage = 0;
            this.$data.queryComment.pageSize = 12;
            this.$data.queryComment.isScroll = false;
            this.getComment();
            this.$data.queryComment.currentPage =
              this.$data.queryComment.pageSize / 2 + 1;
            this.$data.queryComment.pageSize = 2;
            window.addEventListener("scroll", this.windowScroll);
          }
        });
      });
    },
    windowScroll() {
      //滚动条滚动时距离顶部的距离
      let scrollTop = document.documentElement.scrollTop;
      //可视区的高度
      let windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      //滚动条总高度
      let scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;

      if (scrollTop + windowHeight == scrollHeight) {
        const loading = this.$loading({
          lock: true,
          text: "正在加载数据",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        setTimeout(() => {
          document.documentElement.scrollTop = scrollTop - 10;
          this.$data.queryComment.isScroll = true;
          this.getComment();
          loading.close();
        }, 2000);
      }
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
    this.getComment();
    this.$data.queryComment.currentPage =
          this.$data.queryComment.pageSize / 2 + 1;
        this.$data.queryComment.pageSize = 2;
  },
  mounted() {
    window.addEventListener("scroll", this.windowScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.windowScroll);
  }
};
</script>

<style scoped>
</style>