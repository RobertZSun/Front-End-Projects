<template>
  <div class="login_container">
    <div class="login_box">
      <!-- Login avatar part -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- Login form part -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="formRules"
        label-width="0px"
        class="login_form"
      >
        <!-- username -->
        <el-form-item prop="username">
          <el-input
            type="text"
            v-model="loginForm.username"
            placeholder="Username"
            prefix-icon="el-icon-user"
            ref="unameRef"
          ></el-input>
        </el-form-item>
        <!-- password -->
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            placeholder="Password"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <!-- conform and reset button -->
        <el-form-item class="btns">
          <el-button type="primary" native-type="submit" @click="login">Login</el-button>
          <el-button @click="resetForm">Reset</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script type="text/javascript">
import Vue from 'vue'

export default {
  data: function () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      formRules: {
        username: [
          { required: true, message: 'Please input username', trigger: 'blur' },
          {
            min: 3,
            max: 16,
            message:
              'username should be at least 3 characters up to 16 characters',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: 'Please input password', trigger: 'blur' },
          {
            min: 6,
            max: 20,
            message:
              'password should be at least 6 characters up to 20 characters',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    resetForm: function () {
      this.$refs.loginFormRef.resetFields()
    },
    login: function () {
      this.$refs.loginFormRef.validate(async (result) => {
        if (result) {
          const { data: dataReceived } = await Vue.axios.post('login', this.loginForm)
          if (dataReceived.meta.status !== 200) {
            this.$message.error('Login Failed')
          } else {
            this.$message.success('Login Successed')
            window.sessionStorage.setItem('token', dataReceived.data.token)
            this.$router.push('/home')
          }
        } else {
          return false
        }
      })
    }
  },
  mounted: function () {
    this.$refs.unameRef.focus()
  }
}
</script>

<style  lang='scss' scoped>
$bgc: #2b4b6b;
$login_box_window_bgc: #fff;
.login_container {
  height: 100%;
  background-color: $bgc;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: $login_box_window_bgc;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    padding: 10px;
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: $login_box_window_bgc;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .btns {
    display: flex;
    justify-content: center;
  }

  .login_form {
    padding: 0 20px;
    width: 100%;
    box-sizing: border-box;
    position: absolute;
    bottom: 0;
  }
}
</style>
