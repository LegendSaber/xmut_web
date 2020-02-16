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
            <el-input :autosize="{minRows:30,maxRows: 40}" type="textarea" v-model="ruleForm.content"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="demo-drawer__footer">
              <el-button :loading="loading" type="primary" @click="submitForm('ruleForm')">{{ loading ? '提交中 ...' : '提交' }}</el-button>
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
        currentPage: 0,
        pageSize: 12
      },
      dialog: false,
      loading: false,
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
          let params = {}
          this.loading = true
          params.title = this.$data.ruleForm.title
          params.content = this.$data.ruleForm.content
          setTimeout(()=>{
            this.$axios.post("/sysExperience/insert", params).then(response=>{
              this.loading = false
              if (response && response.success) {
                this.$alert(response.message, '提交结果', {
                confirmButtonText: '确定',
                  callback: action => {
                    this.resetForm('ruleForm')
                    this.$data.loading = false
                    this.$data.dialog = false
                  }
                })
              } else {
                this.$notify.error(response.message)
                return false
              }
            })
          }, 2000)
        } else {
          this.$alert('表单信息填写有误，请修改!', '提交结果', {
            confirmButtonText: '确定',
            callback: action => {}
          })
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleClose(done) {
      if (this.$data.loading) {
        return;
      }
      this.$confirm("确定要关闭表单吗？")
        .then(_ => {
          this.resetForm('ruleForm')
          done()
        })
    },
    cancelForm() {
      this.resetForm('ruleForm')
      this.$data.loading = false;
      this.$data.dialog = false;
    },
    categoryHandle() {
      if (this.$data.oldCategory != this.$data.categoryName) {
        if (this.$data.categoryName === "new") {
        } else if (this.$data.categoryName === "hot") {
        } else if (this.$data.categoryName === "collect") {
        } else {
        }
        this.$data.oldCategory = this.$data.categoryName;
      }
    },
    show(row) {
      this.$router.push({path: '/exdetail', query: {content: row}})
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
        let params = {};
        params.currentPage = this.$data.queryData.currentPage;
        params.pageSize = this.$data.queryData.pageSize;

        this.$data.loading = true;
        setTimeout(() => {
          this.$axios.post("/sysExperience/getAll", params).then(response => {
            if (response && response.data) {
              let data = response.data.records;

              if (data.length == 0) {
                this.$notify.error("没有更多数据");
                window.removeEventListener("scroll", this.windowScroll);
              } else{
                data[0].modifyTime = data[0].modifyTime.slice(0, 10)  
                this.$data.tableData.push(data[0]);
                if (data.length == 2) {
                  data[1].modifyTime = data[1].modifyTime.slice(0, 10)
                  this.$data.tableData.push(data[1])
                }
                this.$data.queryData.currentPage++
              }
            }
          });
          this.$data.loading = false;
        }, 2000);
      }
    }
  },
  mounted() {
    window.addEventListener("scroll", this.windowScroll);
  },
  created() {
    let params = {};
    params.currentPage = this.$data.queryData.currentPage;
    params.pageSize = this.$data.queryData.pageSize;
    this.$axios.post("/sysExperience/getAll", params).then(response => {
      if (response && response.data) {
        this.$data.tableData = response.data.records;
        let length = this.$data.tableData.length;

        for (let i = 0; i < length; i++) {
          this.$data.tableData[i].modifyTime = this.$data.tableData[
            i
          ].modifyTime.slice(0, 10);
        }

        this.$data.queryData.currentPage =
          this.$data.queryData.pageSize / 2 + 1;
        this.$data.queryData.pageSize = 2;
        this.$data.loading = false;
      }
    });
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.windowScroll);
  }
};
</script>
<style scoped>
</style>