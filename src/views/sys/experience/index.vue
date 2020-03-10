<template>
  <div>
    <o-carousel />
    <el-divider />
    <el-tag style="margin-left:200px;fontSize: 28px" type="danger" plain>青春是一个短暂的美梦, 当你醒来时, 它早已消失无踪</el-tag>
    <el-divider />
    <el-button
      @click="addExperience"
      type="primary"
      style="margin-bottom: 5px"
      icon="el-icon-circle-plus"
      :loading="loading"
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
                :loading="dwloading"
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
      <el-tab-pane :disabled="loading" label="最新" name="new"></el-tab-pane>
      <el-tab-pane :disabled="loading" label="热门" name="hot"></el-tab-pane>
    </el-tabs>
    <!-- <el-table
      :data="tableData"
      border
      :row-class-name="tableRowClassName"
      style="width: 100%;fontSize:18px"
      v-loading="loading"
      element-loading-text="拼命加载中"
    >
      <el-table-column min-width="130" prop="createTime" label="日期"></el-table-column>
      <el-table-column min-width="130" prop="author" label="作者"></el-table-column>
      <el-table-column min-width="280" prop="title" label="标题"></el-table-column>
      <el-table-column min-width="280" label="操作">
        <template slot-scope="scope">
          <el-button @click="show(scope.row.id)" icon="el-icon-zoom-in" type="primary" plain>查看</el-button>
          <el-button
            v-if="queryData.flag == 1"
            icon="el-icon-bell"
            type="success"
            plain
          >更新日期:{{scope.row.modifyTime}}</el-button>
          <el-button
            v-if="queryData.flag == 2"
            icon="el-icon-user"
            type="warning"
            plain
          >收藏人数:{{scope.row.favorNum}}</el-button>
          <el-button
            v-if="queryData.flag == 3"
            icon="el-icon-star-on"
            @click="cancelCollect(scope.row.id)"
            type="warning"
            plain
          >已收藏</el-button>
          <el-button
            v-if="queryData.flag == 4"
            icon="el-icon-edit"
            type="warning"
            @click="editExperience(scope.row)"
            plain
          >编辑</el-button>
          <el-button
            v-if="queryData.flag == 4"
            icon="el-icon-delete"
            type="danger"
            @click="deleteExperience(scope.row.id)"
            plain
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table> -->
     <div style="height:140px;" v-for="(table, index) in tableData" :key="index">
      <el-row v-loading="loading" :gutter="2">
          <el-col style="margin-top: 40px;" :offset="1" :span="2">
            <el-avatar shape="square" :size="60" :src="squareUrl"></el-avatar>
          </el-col>
          <el-col style="margin-top: 28px;" :span="16">
            <el-row><a :href="'exdetail?id=' + table.id">{{table.title}}</a></el-row>
            <el-row style="margin-top:5px;fontSize: 14px;color:#767676;">{{table.content.slice(0, 48)}}...</el-row>
            <el-row style="margin-top:5px;">
              <span style="fontSize: 14px;color:#3b5998;cursor: pointer;" type="primary">{{table.author}}</span>
              <el-divider direction="vertical"></el-divider>
              <span style="fontSize: 14px;color: #767676;">发表于: {{table.createTime}}</span>
              <el-divider direction="vertical"></el-divider>
              <span style="fontSize: 14px;color: #767676;">收藏人数: {{table.favorNum}}</span>
            </el-row>
          </el-col>
          <el-col :offset="1" :span="1">
            <a :href="'exdetail?id=' + table.id"><el-button round style="margin-top: 24px;height:100px;" icon="el-icon-zoom-in" type="primary">查看</el-button></a>
          </el-col>
      </el-row>
      <el-row>
         <el-divider><i class="el-icon-s-data"></i></el-divider>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      squareUrl:"https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
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
    decryptCode(strValue) {
      return strValue
        .replace(/<br\s*\/?>/gi, "\r\n")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/\ \;/g, " ");
    },
    addExperience() {
      this.$data.ruleForm.essayId = -1;
      this.$data.dialog = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {};
          this.$data.dwloading = true;
          params.title = this.$data.ruleForm.title;
          if (this.$data.ruleForm.content != null)
            params.content = this.getFormatCode(this.$data.ruleForm.content);
          else params.content = this.$data.ruleForm.content;
          if (this.$data.ruleForm.essayId == -1) {
            setTimeout(() => {
              this.$axios
                .post("/sysExperience/insert", params)
                .then(response => {
                  if (response && response.success) {
                    this.$alert(response.message, "提交结果", {
                      confirmButtonText: "确定",
                      callback: action => {
                        this.$data.dwloading = false;
                        this.$data.dialog = false;
                        this.resetForm("ruleForm");
                        this.getInitData()
                      }
                    });
                  } else {
                    this.$notify.error(response.message);
                    this.$data.dwloading = false;
                  }
                });
            }, 2000);
          } else {
            params.id = this.$data.ruleForm.essayId;
            setTimeout(() => {
              this.$axios
                .post("/sysExperience/modifyExperience", params)
                .then(response => {
                  if (response && response.success) {
                    this.$alert(response.message, "提交结果", {
                      confirmButtonText: "确定",
                      callback: action => {
                        this.$data.dwloading = false;
                        this.$data.dialog = false;
                        this.resetForm("ruleForm");
                        this.getInitData()
                      }
                    });
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
      if (this.$data.oldCategory != this.$data.categoryName) {
        if (this.$data.categoryName === "new") {
          this.$data.queryData.flag = 1;
        } else if (this.$data.categoryName === "hot") {
          this.$data.queryData.flag = 2;
        } else if (this.$data.categoryName === "collect") {
          this.$data.queryData.flag = 3;
        } else {
          this.$data.queryData.flag = 4;
        }
        this.getInitData()
        this.$data.oldCategory = this.$data.categoryName
      }
    },
    getInitData(){
      this.$data.queryData.currentPage = 0;
      this.$data.queryData.pageSize = 12;
      this.$data.loading = true;
      this.$data.queryData.isScroll = false;

      setTimeout(() => {
        this.getExperienceData();
        window.addEventListener("scroll", this.windowScroll);
        this.$data.queryData.currentPage =
          this.$data.queryData.pageSize / 2 + 1;
        this.$data.queryData.pageSize = 2;
        document.documentElement.scrollTop = 0;
        this.$data.loading = false;
      }, 2000);
    },
    getExperienceData() {
      let flag = this.$data.queryData.flag
      let params = {};
      params.currentPage = this.$data.queryData.currentPage;
      params.pageSize = this.$data.queryData.pageSize;

      if (flag == 1 || flag == 2) {
        params.flag = flag;
        this.$axios.get("/sysExperience/getAll", params).then(response => {
          if (response && response.success) {
            this.setData(response.data);
          }
        });
      } else if (flag == 3) {
        this.$axios
          .get("/sysExperience/getFavorExperience", params)
          .then(response => {
            if (response && response.success) {
              this.setData(response.data);
            }
          });
      } else if (flag == 4) {
        this.$axios
          .get("/sysExperience/getMyExperience", params)
          .then(response => {
            if (response && response.success) {
              this.setData(response.data);
            }
          });
      }
    },
    setData(data) {
      if (data == null) {
        this.$data.tableData = [];
        return;
      }
      let tmpData = data.records;
      let length = tmpData.length;
      if (!this.$data.queryData.isScroll) {
        this.$data.tableData = tmpData;

        for (let i = 0; i < length; i++) {
          this.$data.tableData[i].createTime = this.$data.tableData[
            i
          ].createTime.slice(0, 10);
          this.$data.tableData[i].modifyTime = this.$data.tableData[
            i
          ].modifyTime.slice(0, 10);
        }
      } else {
        for (let i = 0; i < length; i++) {
          tmpData[i].createTime = tmpData[i].createTime.slice(0, 10);
          tmpData[i].modifyTime = tmpData[i].modifyTime.slice(0, 10);
          this.$data.tableData.push(tmpData[i]);
        }
        if (length == 2) {
          this.$data.queryData.currentPage++;
        }
      }
      if (length < this.$data.queryData.pageSize) {
        this.$notify.error("没有更多数据");
        window.removeEventListener("scroll", this.windowScroll);
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return "warning-row";
      }
      return "";
    },
    show(id) {
      window.sessionStorage.setItem("experience_id", id)
      this.$router.push("/exdetail");
    },
    cancelCollect(id) {
      this.$confirm("确定要取消收藏吗? ").then(_ => {
        this.$data.loading = true;
        let params = {};
        params.id = id;

        setTimeout(() => {
          this.$axios
            .post("/collect/cancelCollectEx", params)
            .then(response => {
              if (response && response.success) {
                this.$alert(response.message, "取消结果", {
                  confirmButtonText: "确定",
                  callback: action => {
                    this.getInitData()
                  }
                });
              }
            });
        }, 2000);
      });
    },
    editExperience(row) {
      this.$data.ruleForm.essayId = row.id;
      this.$data.ruleForm.title = row.title;
      this.$data.ruleForm.content = this.decryptCode(row.content);
      this.$data.dialog = true;
    },
    deleteExperience(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        this.loading = true;
        let params = {};
        params.id = id;
        setTimeout(() => {
          this.$axios
            .post("/sysExperience/deleteExperience", params)
            .then(response => {
              if (response && response.success) {
                this.$alert(response.message, "删除结果", {
                  confirmButtonText: "确定",
                  callback: action => {
                    this.getInitData()
                  }
                });
              }
            });
        }, 2000);
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

      if (scrollTop + windowHeight == scrollHeight && !this.$data.loading) {
        this.$data.loading = true;
        setTimeout(() => {
          document.documentElement.scrollTop = scrollTop - 10;
          this.$data.queryData.isScroll = true;
          this.getExperienceData();
          this.$data.loading = false;
        }, 2000);
      }
    }
  },
  mounted() {
    window.addEventListener("scroll", this.windowScroll);
  },
  created() {
    this.getInitData()
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.windowScroll);
  }
};
</script>

<style scoped>
a {
    text-decoration: none;
    cursor: pointer;
    font-size: 18px;
    font-weight: 500;
    line-height: 1.6;
    margin: 0;
    padding: 0;
    color: #3b5998;
    background-color: transparent;
    font-family: PingFang SC,Verdana,Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,Microsoft Sans Serif,WenQuanYi Micro Hei,sans-serif;
}

a:hover{
  color: #da8d28e8;
}
</style>