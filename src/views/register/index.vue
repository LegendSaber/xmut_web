<template>
  <div id="register-poster">
    <el-form class="register-container" label-position="left" label-width="0px">
      <h3 class="register_title">用户注册</h3>
      <el-form-item>
        <el-input type="text" v-model="registerForm.username" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          type="password"
          v-model="registerForm.password"
          auto-complete="off"
          placeholder="密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
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
          v-on:click="register"
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
    register() {
      if (this.registerForm.password != this.registerForm.repPassword){
        this.$notify.error("两次密码输入不一致");
      }else{
        let params = {}
        params.username = this.$data.registerForm.username
        params.password = this.$data.registerForm.password
        params.flag = this.$data.registerForm.value

        this.$axios.post('/sysUser/register', params)
        .then(response => {
          if (response && response.success){
            this.$alert(response.message, '注册结果', {
              confirmButtonText: '确定',
                  callback: action => {  
                    this.$router.push("/login")
                  }
            });   
          } else {
            this.$alert(response.message, '注册结果', {
              confirmButtonText: '确定',
                  callback: action => {
                  }
            });   
          }   
        })
        .catch(error => {
        });
      }
    },
    toLogin() {
      this.$router.push("/login");
    }
  }
}
</script>
 
<style>
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