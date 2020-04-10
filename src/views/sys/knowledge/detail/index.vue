<template>
  <div>
    <h1 style="fontSize:30px;">{{essay.title}}</h1>
    <div class="author-info">
      <el-button type="primary" style="fontSize:12px;">{{essay.author}}</el-button>
      <el-divider direction="vertical"></el-divider>
      <el-button type="success" style="fontSize:12px;">{{essay.category}}</el-button>
      <el-divider direction="vertical"></el-divider>
      <span>发表于: {{essay.createTime}}</span>
      <el-divider direction="vertical"></el-divider>
      <span>收藏人数: {{essay.favorNum}}</span>
    </div>
    <el-divider />
    <div v-html="$xss(essay.content)" style="fontSize:20px;"></div>
    <el-row v-if="images.length > 0">
      <el-divider />
      <el-col>
        <img
          v-for="(image, index) in images"
          :alt="image.name"
          :key="index"
          :src="image.img"
          width="304"
          height="228"
          style="margin-left: 24px;"
          @click="showImg(index)"
        />
        <el-dialog :visible.sync="bigImg.dialogVisible">
          <img width="100%" :src="bigImg.dialogImageUrl" alt />
        </el-dialog>
      </el-col>
    </el-row>
    <el-divider />
    <el-button v-if="!isCollect" @click="collect" type="primary" icon="el-icon-star-off" plain>点击收藏</el-button>
    <el-button v-else @click="cancelCollect" type="warning" icon="el-icon-star-on">已收藏</el-button>
    <el-button v-if="isMy" @click="deteleKnowledge" icon="el-icon-delete" type="danger" plain>删除</el-button>
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
    <div v-for="(comment, index) in commentData" :key="index">
      <el-row>
        <el-col :span="1" :offset="1">
          <el-avatar v-if="comment.img == null" shape="square" :size="50" :src="squareUrl"></el-avatar>
          <el-avatar v-else shape="square" :size="50" :src="comment.img"></el-avatar>
        </el-col>
        <el-col :span="19" :offset="1">
          <div style="fontSize: 16px;" v-html="$xss(comment.content)"></div>
          <div class="comment">
            <span style="color:#3b5998;cursor: pointer;" type="primary">{{comment.author}}</span>
            <el-divider direction="vertical"></el-divider>
            <span>发表于: {{comment.createTime}}</span>
            <el-divider direction="vertical"></el-divider>
            <span>推荐人数: {{comment.favorNum}}</span>
            <el-divider direction="vertical"></el-divider>
            <el-link @click="recommend(comment.id)" type="warning">推荐</el-link>
            <el-divider direction="vertical"></el-divider>
            <el-link @click="replace(comment)" type="danger">回复</el-link>
          </div>
        </el-col>
      </el-row>
      <div v-for="(son, index) in comment.sonComment" :key="index">
        <el-row>
          <el-col :offset="3">
            <el-divider>
              <i class="el-icon-s-comment"></i>
            </el-divider>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="3">
            <div style="fontSize: 16px;" v-html="$xss(son.content)"></div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="3" :span="5">
            <div style="margin-top:10px;fontSize: 14px;">
              <el-link type="success">{{son.author}}</el-link>
              <el-divider direction="vertical"></el-divider>
              <span>回复于: {{son.createTime}}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-row>
        <el-divider>
          <i class="el-icon-s-data"></i>
        </el-divider>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      squareUrl:
        "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
      essay: {},
      commentData: [],
      images: [],
      bigImg: {
        dialogImageUrl: "",
        dialogVisible: false
      },
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
        selectAuthor: ""
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
            min: 5,
            max: 100,
            message: "长度在 5 到 100 个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    showImg(index) {
      this.$data.bigImg.dialogImageUrl = this.$data.images[index].img;
      this.$data.bigImg.dialogVisible = true;
    },
    addComment() {
      this.$data.queryComment.selectId = -1;
      this.$data.dialogFormVisible = true;
    },
    replace(comment) {
      this.$data.queryComment.selectId = comment.id;
      this.$data.queryComment.selectAuthor = comment.author;
      this.$data.dialogFormVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.$data.queryComment.selectId == -1) {
            let params = {};
            params.id = this.$data.essay.id;
            params.content = this.getFormatCode(this.$data.ruleForm.content);
            this.$data.dwloading = true;
            setTimeout(() => {
              this.$axios
                .post("/sysComment/insertKnowledgeComment", params)
                .then(response => {
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
                  }else{
                    this.$notify.error(response.message)
                    this.$data.dwloading = false;
                    this.$data.dialogFormVisible = false;
                  }
                });
            }, 2000);
          } else {
            let params = {};
            params.id = this.$data.queryComment.selectId;
            params.content = this.getFormatCode(this.$data.ruleForm.content);
            this.$data.dwloading = true;
            setTimeout(() => {
              this.$axios
                .post("/sysComment/insertSon", params)
                .then(response => {
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
                  } else {
                    this.$notify.error(response.message)
                    this.$data.dwloading = false;
                    this.$data.dialogFormVisible = false;
                  }
                });
            }, 2000);
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

      this.$axios
        .get("/sysComment/getKnowledgeComment", params)
        .then(response => {
          if (response && response.success) {
            if (response.data == null) {
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
                this.$data.commentData[i].sonComment.sort(function sortFun(
                  x,
                  y
                ) {
                  return Date.parse(y.createTime) - Date.parse(x.createTime);
                });
                let sonLen = this.$data.commentData[i].sonComment.length;
                for (let j = 0; j < sonLen; j++) {
                  this.$data.commentData[i].sonComment[
                    j
                  ].createTime = this.$data.commentData[i].sonComment[
                    j
                  ].createTime.slice(0, 10);
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
    deteleKnowledge() {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        let params = {};
        params.id = this.$data.essay.id;

        this.$axios.post("/sysKnowledge/delete", params).then(response => {
          if (response && response.success) {
            this.$alert(response.message, "删除结果", {
              confirmButtonText: "确定",
              callback: action => {
                this.$router.push("/knowledge");
              }
            });
          }
        });
      });
    },
    collect() {
      let params = {};
      params.id = this.$data.essay.id;
      this.$axios.post("/sysKnowledge/collect", params).then(response => {
        if (response && response.success) {
          this.$data.isCollect = true;
        }
      });
    },
    cancelCollect() {
      let params = {};
      params.id = this.$data.essay.id;
      this.$axios.post("/sysKnowledge/cancelCollect", params).then(response => {
        if (response && response.success) {
          this.$data.isCollect = false;
        }
      });
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
    let knowledge_id = this.$route.query.id;
    if (knowledge_id == null) this.$router.push("/knowledge");

    let getParams = {};
    getParams.id = knowledge_id;
    this.$axios
      .get("/sysKnowledge/getKnowledgeById", getParams)
      .then(response => {
        if (response && response.success) {
          this.$data.essay = response.data;
          this.$data.essay.createTime = this.$data.essay.createTime.slice(
            0,
            10
          );

          let params = {};
          params.id = this.$data.essay.id;
          this.$axios.post("/sysKnowledge/isCollect", params).then(response => {
            if (response && response.success) {
              this.$data.isCollect = true;
            } else {
              this.$data.isCollect = false;
            }
          });

          this.$axios
            .get("/sysKnowledge/isMyKnowledge", params)
            .then(response => {
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

          this.$axios.get("/sysFile/loadPicture", params).then(response => {
            if (response && response.success) {
              let data = response.data;
              let length = data.length;

              for (let i = 0; i < length; i++) {
                let params = {};
                params.name = data[i].name;
                params.img = data[i].img;
                this.$data.images.push(params);
              }
            }
          });
        } else {
          this.$notify.error(response.message);
          this.$router.push("/knowledge");
        }
      });
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
.comment {
  line-height: 1.6;
  margin-bottom: 6px;
  font-size: 14px;
  margin-top: 8px;
}
span {
  color: #767676;
}

img {
  margin: 5px;
  border: 1px solid #ccc;
}

img:hover {
  border: 1px solid #777;
}
</style>