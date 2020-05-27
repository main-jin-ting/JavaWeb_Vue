<template>
  <div class="login-container">
    <el-card class="box-card box">
      <div slot="header" class="clearfix">
        <span>系统登录</span>
      </div>
      <div>
        <el-form ref="form" :model="form" label-width="0px">
          <el-form-item label="" prop="username"
                        :rules="{
                    required: true, message: '用户名不能为空', trigger: 'blur'
                  }">
            <el-input placeholder="输入用户名" clearable  prefix-icon="el-icon-user-solid" v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="" :rules="{
                    required: true, message: '密码不能为空', trigger: 'blur'
                  }">
            <el-input placeholder="输入密码" clearable show-password prefix-icon="el-icon-s-goods" type="password"
                      v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item label="" prop="captcha" :rules="{
                    required: true, message: '验证码不能为空', trigger: 'blur'
                  }">
            <div style="display: flex">
              <el-input placeholder="输入验证码" style="width: 150px" clearable prefix-icon="el-icon-key" v-model="form.captcha"></el-input>
              <img :src="captchaImage" alt="" class="captcha" @click="getCaptcha">
            </div>
          </el-form-item>
          <el-button :loading="loginLoading" @click="login('form')" style="width: 100%" type="primary">登录</el-button>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
  import api from '@/api/login'
  import Cookies from 'js-cookie';

  export default {
    name: 'Login',
    data() {
      return {
        loginLoading:false,
        form:{
          username:'',
          password:'',
          captcha:'',
          key:''
        },
        captchaImage:'',
        loginTip:'',
      }
    },
    mounted(){
      this.getCaptcha()
    },
    created(){
      let that = this;
      document.onkeypress = function(e) {
        var keycode = document.all ? event.keyCode : e.which;
        if (keycode == 13) {
          that.login("form");
          return false;
        }
      };
    },
    methods: {
      /**
       * 系统登录
       */
      login(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loginLoading=true
            api.login(this.form).then(res => {
              const {token}=res.data
              Cookies.set('token',token)
              console.log("login_token："+token)
              let redirect = this.$route.query.redirect
              if(redirect){
                this.$router.push({path:redirect})
              }else{
                this.$router.push({path:'/'})
              }
              this.loginLoading=false
              
              // 延迟1秒提示登录成功
              let date = new Date();
              if(date.getHours() >= 0 && date.getHours() < 12){
                this.loginTip="上午好"
              }else if(date.getHours()>=12&&date.getHours()<18){
                this.loginTip="下午好"
              }else{
                this.loginTip="晚上好"
              }
              this.$notify({
                title: '欢迎',
                message: this.loginTip + '，欢迎回来',
                type: 'success'
              });
            }).catch(e => {
              this.loginLoading=false
            })
          }
        })
      },
      getCaptcha(){
        api.captcha({}).then(res => {
          const {url,key} = res.data
          this.form.key = key
          this.captchaImage = url
        }).catch(e => {
          this.form.key = ''
          this.captchaImage = ''
        })
      }
    }
  }
</script>

<style lang="less">
  .login-container{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    width: 100%;
    background-position: center center;
    background-size: cover;
    background-image: url(../../assets/img/login2.jpg);
    .box{
      width: 350px;
      position: absolute;
      right: 40%;
      top: 30%;
    }
  }
</style>

