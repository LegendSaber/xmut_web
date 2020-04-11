<template>
  <div id="register-poster">
    <el-form
      :model="registerForm"
      :rules="rules"
      ref="registerForm"
      status-icon
      class="register-container"
      label-position="left"
      label-width="0px"
    >
      <h3 class="register_title">用户注册</h3>
      <el-form-item prop="username">
        <el-input 
          type="text" 
          v-model="registerForm.username" 
          auto-complete="off" 
          placeholder="用户名"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          v-model="registerForm.password"
          auto-complete="off"
          placeholder="密码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="repPassword">
        <el-input
          type="password"
          v-model="registerForm.repPassword"
          auto-complete="off"
          placeholder="确认密码"
        ></el-input>
      </el-form-item>
      <el-select v-model="registerForm.value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button type="warning" @click="toLogin">肥去登录</el-button>
      <el-form-item style="width: 100%">
        <el-button
          type="primary"
          style="width: 100%;background: #505458;border: none"
          v-on:click="register('registerForm')"
        >注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      registerForm: {
        username: "",
        password: "",
        repPassword: "",
        value: "研友"
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 8,
            max: 16,
            message: "长度在 8 到 16 个字符",
            trigger: "blur"
          }
        ],
        repPassword: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          {
            min: 8,
            max: 16,
            message: "长度在 8 到 16 个字符",
            trigger: "blur"
          }
        ]
      },
      options: [
        {
          value: "研友",
          label: "研友"
        },
        {
          value: "路人",
          label: "路人"
        }
      ]
    };
  },
  methods: {
    register(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.registerForm.password != this.registerForm.repPassword) {
            this.$notify.error("两次密码输入不一致");
            return false;
          }
          let params = {};
          params.username = this.$data.registerForm.username;
          params.password = this.$md5(
            this.$data.registerForm.password + "_XmUt"
          );
          params.roleName = this.$data.registerForm.value;

          this.$axios.post("/sysUser/register", params).then(response => {
            if (response && response.success) {
              this.$alert(response.message, "注册结果", {
                confirmButtonText: "确定",
                callback: action => {
                  this.$router.push("/login");
                }
              });
            } else {
              this.$alert(response.message, "注册结果", {
                confirmButtonText: "确定",
                callback: action => {}
              });
            }
          });
        } else {
          this.$notify.error("表单填写错误!");
          return false;
        }
      });
    },
    toLogin() {
      this.$router.push("/login");
    }
  }
};
</script>
 
<style scoped>
#register-poster {
  background: url("../../assets/images/register.jpg") no-repeat;
  background-position: center;
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;
}
.register-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 90px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.register_title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}
</style>