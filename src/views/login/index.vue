<template>
  <div id="login-poster">
    <el-form class="login-container" label-position="left" label-width="0px">
      <h3 class="login_title">用户登录</h3>
      <el-form-item>
        <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item>
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
          v-on:click="login"
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
        value: 1
      },
      options: [
        {
          value: 1,
          label: "研友"
        },
        {
          value: 2,
          label: "路人"
        },
        {
          value: 3,
          label: "开课老师"
        }
      ],
    };
  },
  methods: {
    login() {
        let params = {}
        params.username = this.$data.loginForm.username
        params.password = this.$data.loginForm.password
        params.flag = this.$data.loginForm.value

        this.$axios.post("/sysStudent/login", params)
        .then (response => {
          if (response && response.success){
            window.sessionStorage.setItem('user', JSON.stringify(response.data))
            this.$router.push("/dashbord")
            this.$notify.success(response.message)
          } else{
            this.$notify.error(response.message)
          }
        }).catch (error => {
        })
    },
    toRegister() {
      this.$router.push("/register");
    }
  }
}
</script>
 
<style>
#login-poster {
  background: url("../../assets/login.jpg") no-repeat;
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