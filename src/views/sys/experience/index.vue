<template>
  <div>
    <o-carousel />
    <el-divider />
    <el-tag style="margin-left:200px;fontSize: 28px" type="danger" plain>青春是一个短暂的美梦, 当你醒来时, 它早已消失无踪</el-tag>
    <el-divider />
    <el-button
      @click="dialog = true"
      type="primary"
      style="margin-bottom: 5px"
      icon="el-icon-circle-plus"
    >发表经验</el-button>

    <el-drawer
      title="编辑文章"
      :before-close="handleClose"
      :visible.sync="dialog"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer"
      size="50%"
    >
      <div class="demo-drawer__content">
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
            <el-input
              :autosize="{minRows:30,maxRows: 40}"
              type="textarea"
              v-model="ruleForm.content"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <div class="demo-drawer__footer">
              <el-button
                :loading="loading"
                type="primary"
                @click="submitForm('ruleForm')"
              >{{ dwloading ? '提交中 ...' : '提交' }}</el-button>
              <el-button type="warning" @click="resetForm('ruleForm')" plain>重置</el-button>
              <el-button @click="cancelForm" type="danger" plain>取 消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>

    <el-tabs v-model="categoryName" type="card" @tab-click="categoryHandle">
      <el-tab-pane label="最新" name="new"></el-tab-pane>
      <el-tab-pane label="热门" name="hot"></el-tab-pane>
      <el-tab-pane label="收藏" name="collect"></el-tab-pane>
      <el-tab-pane label="我的" name="my"></el-tab-pane>
    </el-tabs>
    <el-table
      :data="tableData"
      border
      style="width: 100%;fontSize:18px"
      v-loading="loading"
      element-loading-text="拼命加载中"
    >
      <el-table-column fixed prop="modifyTime" label="日期" width="300"></el-table-column>
      <el-table-column prop="author" label="作者" width="240"></el-table-column>
      <el-table-column prop="title" label="标题" width="240"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="show(scope.row)" type="primary" plain>查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      categoryName: "new",
      oldCategory: "new",
      tableData: [],
      loading: true,
      queryData: {
        isScroll: false,
        flag: 1,
        currentPage: 0,
        pageSize: 12
      },
      dialog: false,
      dwloading: false,
      ruleForm: {
        title: "",
        content: ""
      },
      rules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          {
            min: 10,
            max: 40,
            message: "长度在 10 到 40 个字符",
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
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {};
          this.$data.dwloading = true;
          params.title = this.$data.ruleForm.title;
          params.content = this.$data.ruleForm.content;
          setTimeout(() => {
            this.$axios.post("/sysExperience/insert", params).then(response => {
              this.$data.dwloading = false;
              if (response && response.success) {
                this.$alert(response.message, "提交结果", {
                  confirmButtonText: "确定",
                  callback: action => {
                    this.resetForm("ruleForm");
                    this.$data.dialog = false;
                  }
                });
              } else {
                this.$notify.error(response.message);
                return false;
              }
            });
          }, 2000);
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
    handleClose(done) {
      if (this.$data.dwloading) {
        return;
      }
      this.$confirm("确定要关闭表单吗？").then(_ => {
        this.resetForm("ruleForm");
        done();
      });
    },
    cancelForm() {
      this.resetForm("ruleForm");
      this.$data.dwloading = false;
      this.$data.dialog = false;
    },
    categoryHandle() {
      if (this.$data.loading) 
      {
        this.$data.categoryName = this.$data.oldCategory;
        return;
      }
      if (this.$data.oldCategory != this.$data.categoryName) {
        this.$data.queryData.currentPage = 0;
        this.$data.queryData.pageSize = 12;
        this.$data.queryData.isScroll = false;
        this.$data.loading = true;
        window.addEventListener("scroll", this.windowScroll);
        if (this.$data.categoryName === "new") {
          this.$data.queryData.flag = 1;
        } else if (this.$data.categoryName === "hot") {
          this.$data.queryData.flag = 2;
        } else if (this.$data.categoryName === "collect") {
          this.$data.queryData.flag = 3;
        } else {
          this.$data.queryData.flag = 4;
        }
        setTimeout(() => {
          document.documentElement.scrollTop = 0;
          window.pageYOffset = 0;
          document.body.scrollTop = 0;
          this.getExperienceData(this.$data.queryData.flag);
          this.$data.oldCategory = this.$data.categoryName;
          this.$data.loading = false;
        }, 2000);
      }
    },
    getExperienceData(flag) {
      let params = {};
      params.currentPage = this.$data.queryData.currentPage;
      params.pageSize = this.$data.queryData.pageSize;

      if (flag == 1 || flag == 2) {
        params.flag = flag;
        this.$axios.post("/sysExperience/getAll", params).then(response => {
          if (response && response.success) {
            this.setData(response.data);
          }
        });
      } else if (flag == 3) {
        this.$axios
          .post("/sysExperience/getFavorExperience", params)
          .then(response => {
            if (response && response.success) {
              this.setData(response.data);
            }
          });
      } else if (flag == 4) {
        this.$axios
          .post("/sysExperience/getMyExperience", params)
          .then(response => {
            if (response && response.success) {
              this.setData(response.data);
            }
          });
      }
    },
    setData(data) {
      let tmpData = data.records;
      let size = tmpData.length;

      if (this.$data.queryData.isScroll) {
        for (let i = 0; i < size; i++) {
          tmpData[i].modifyTime = tmpData[i].modifyTime.slice(0, 10);
          this.$data.tableData.push(tmpData[i]);
        }
        if (size < 2) {
          this.$notify.error("没有更多数据");
          window.removeEventListener("scroll", this.windowScroll);
        } else {
          this.$data.queryData.currentPage++;
        }
      } else {
        this.$data.tableData = tmpData;
        let length = this.$data.tableData.length;

        for (let i = 0; i < length; i++) {
          this.$data.tableData[i].modifyTime = this.$data.tableData[
            i
          ].modifyTime.slice(0, 10);
        }

        if (size < this.$data.queryData.pageSize) {
          window.removeEventListener("scroll", this.windowScroll);
        }
        this.$data.queryData.currentPage = size / 2 + 1;
        this.$data.queryData.pageSize = 2;
      }
    },
    show(row) {
      this.$router.push({ path: "/exdetail", query: { content: row } });
    },
    windowScroll() {
      //滚动条滚动时距离顶部的距离
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      //可视区的高度
      let windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      //滚动条总高度
      let scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;

      if (scrollTop + windowHeight == scrollHeight) {
        if (this.$data.loading) return;
        this.$data.loading = true;
        setTimeout(() => {
          document.documentElement.scrollTop = scrollTop;
          console.log(document.documentElement.scrollTop);
          this.$data.queryData.isScroll = true;
          this.getExperienceData(this.$data.queryData.flag);
          this.$data.loading = false;
        }, 2000);
      }
    }
  },
  mounted() {
    window.addEventListener("scroll", this.windowScroll);
  },
  created() {
    setTimeout(() => {
      this.getExperienceData(this.$data.queryData.flag);
      this.$data.loading = false;
    }, 2000);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.windowScroll);
  }
};
</script>
<style scoped>
</style>