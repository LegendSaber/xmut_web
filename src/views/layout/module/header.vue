<template>
  <div>
    <div>
      <el-row>
        <el-col :span="7" :offset="4">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="主页" name="first"></el-tab-pane>
            <el-tab-pane v-if="currentUser.roleName == '研友'" label="打卡签到区" name="second"></el-tab-pane>
            <el-tab-pane label="经验分享区" name="third"></el-tab-pane>
            <el-tab-pane label="知识分享区" name="fourth"></el-tab-pane>
            <el-tab-pane label="资料分享区" name="five"></el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :offset="1" :span="3">
          <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="input" />
        </el-col>
        <el-col :span="1">
          <a :href="'search?value=' + input">
            <el-button type="primary" icon="el-icon-search">搜索</el-button>
          </a>
        </el-col>
        <el-col :offset="2" :span="2">
          <el-dropdown @command="handleCommand">
            <span>
              <i v-if="!isImg" class="el-icon-user-solid"></i>
              <el-avatar v-else shape="square" :size="24" :src="imgUrl"></el-avatar>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="user">个人中心</el-dropdown-item>
              <el-dropdown-item command="cpassword">修改密码</el-dropdown-item>
              <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span>{{currentUser.username}}</span>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      title="修改密码"
      :visible.sync="dialogFormVisible"
      :before-close="dialogclose"
      width="30%"
      :center="true"
    >
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="90px"
        class="demo-ruleForm"
      >
        <el-form-item label="旧密码:" prop="oldPass">
          <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码:" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            v-loading.fullscreen.lock="fullscreenLoading"
            type="primary"
            @click="submitForm('ruleForm')"
          >提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    var checkoldPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkoldPass");
        }
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      fullscreenLoading: false,
      activeName: "first",
      input: "",
      imgUrl: "",
      isImg: false,
      currentUser: {},
      dialogFormVisible: false,
      ruleForm: {
        pass: "",
        checkPass: "",
        oldPass: ""
      },
      rules: {
        pass: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          },
          { validator: validatePass, trigger: "blur" }
        ],
        checkPass: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          },
          { validator: validatePass2, trigger: "blur" }
        ],
        oldPass: [
          { required: true, message: "请输入旧密码", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          },
          { validator: checkoldPass, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    handleCommand(command) {
      if (command == "logout") {
        this.$confirm("是否确定退出登录?", "提示", {
          confirmButtonText: "退出",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$axios.get("/sysUser/logout", {}).then(response => {
            if (response && response.success) {
              window.sessionStorage.removeItem("user");
              this.$notify.success(response.message);
              this.$router.push("/");
            }
          });
        });
      } else if (command == "cpassword") {
        this.$data.dialogFormVisible = true;
      } else if (command == "user") {
        this.$router.push("/usermanager");
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {};
          const loading = this.$loading({
            lock: true,
            text: "表单已提交，请稍等",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });

          params.oldPass = this.$md5(this.$data.ruleForm.oldPass + "_XmUt");
          params.newPass = this.$md5(this.$data.ruleForm.pass + "_XmUt");
          setTimeout(() => {
            this.$axios.post("/sysUser/cpassword", params).then(response => {
              loading.close();
              if (response && response.success) {
                this.$alert(response.message, "修改结果", {
                  confirmButtonText: "确定",
                  callback: action => {
                    window.sessionStorage.removeItem("user");
                    this.$router.push("/login");
                  }
                });
              } else {
                this.$alert(response.message, "修改结果", {
                  confirmButtonText: "确定",
                  callback: action => {
                    this.resetForm("ruleForm");
                  }
                });
              }
            });
          }, 2000);
        } else {
          this.$notify.error("表单填写方式错误，请检查");
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
        .catch(() => {});
    },
    handleClick() {
      if (this.activeName === "first" && this.$route.path != "/dashbord") {
        this.$router.push("/dashbord");
      } else if (this.activeName === "second" && this.$route.path != "/sign") {
        this.$router.push("/sign");
      } else if (
        this.activeName === "third" &&
        this.$route.path != "/experience"
      ) {
        this.$router.push("/experience");
      } else if (this.activeName === "five" && this.$route.path != "/file") {
        this.$router.push("/file");
      } else if (
        this.activeName === "fourth" &&
        this.$route.path != "/knowledge"
      ) {
        this.$router.push("/knowledge");
      }
    }
  },
  created() {
    let currentUser = JSON.parse(window.sessionStorage.getItem("user"));
    if (currentUser) {
      this.$data.currentUser = currentUser;
    } else {
      this.$notify.error("您还没登录，请先登录");
      this.$router.push("/");
    }

    this.$axios.get("/sysUsermanager/getAvatar").then(response => {
      if (response && response.success) {
        this.$data.imgUrl = response.data;
        this.$data.isImg = true;
      }
    });
  }
};
</script>
<style>
</style>