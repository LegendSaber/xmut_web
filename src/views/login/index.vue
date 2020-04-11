<template>
  <div id="login-poster">
    <el-form 
      :model="loginForm"
      :rules="rules"
      status-icon
      ref="loginForm"
      class="login-container" 
      label-position="left" 
      label-width="0px">
      <h3 class="login_title">用户登录</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-select v-model="loginForm.value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button type="primary" @click="toRegister">前往注册</el-button>
      <el-form-item style="width: 100%">
        <el-button
          type="primary"
          style="width: 100%;background: #505458;border: none"
          v-on:click="login('loginForm')"
        >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
 
<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
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
            min: 3,
            max: 16,
            message: "长度在 8 到 16 个字符",
            trigger: "blur"
          }
        ],
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
      ],
    };
  },
  methods: {
    login(formName) {
      this.$refs[formName].validate(valid => {
        if (valid){
          let params = {}
          params.username = this.$data.loginForm.username
          params.password = this.$md5(this.$data.loginForm.password + "_XmUt")
          params.roleName = this.$data.loginForm.value

          this.$axios.post("/sysUser/login", params)
          .then (response => {
            if (response && response.success){
              window.sessionStorage.setItem('user', JSON.stringify(response.data.user))
              window.sessionStorage.setItem('token', response.data.token)
              this.$router.push("/dashbord")
              this.$notify.success(response.message)
            } else{
              this.$notify.error(response.message)
            }
          })
        } else {
          this.$notify.error("表单信息填写有误!")
        } 
      });
    },
    toRegister() {
      this.$router.push("/register");
    }
  },
  created() {
    if (window.sessionStorage.getItem('user') != null) {
      this.$router.push("/dashbord")
    }
  }
}
</script>
 
<style scoped>
#login-poster {
  background: url("../../assets/images/login.jpg") no-repeat;
  background-position: center;
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;
}

.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 90px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.login_title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}
</style>