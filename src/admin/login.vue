<template>
  <div class="admin-container">
    <div class="content">
      <div class="title">
        <h3>后台管理</h3>
        <p>LFC</p>
      </div>

      <div class="login">
        <div :class="['login-input-view',mobile_prompt && 'prompt-show']">
          <label>手机号</label>
          <input type="text" name="lfc_mobile" class="login-input" v-model="mobile" autocomplete="off" />
          <label class="prompt" v-if="mobile_prompt">{{mobile_prompt}}</label>
        </div>

        <div :class="['login-input-view',password_prompt && 'prompt-show']">
          <label>密码</label>
          <input type="password" name="lfc_password" v-model="password" class="login-input" autocomplete="new-password" @keyup.enter="login" />
          <label class="prompt" v-if="password_prompt">{{password_prompt}}</label>
        </div>

        <div class="submit" @click="login">
          <input class="btn" type="submit" value="登录" autocomplete="off">
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import NavHeader from '@/components/NavHeader'
export default {
  name: 'login',
  data () {
    return {
      mobile: '', // 手机号
      mobile_prompt: '', // 手机号出错时的提醒
      password: '', // 密码
      password_prompt: '', // 密码出错时的提醒
    }
  },
  watch: {
    mobile: function (val) {
      if (this.mobile_prompt && api.isPhone(val)) {
        this.mobile_prompt = ''
      }
    },
    password: function (val) {
      if (this.password_prompt && val.length>=6) {
        this.password_prompt = ''
      }
    },
  },
  components: {
    NavHeader,
  },
  methods:{
    login () {
      var _this   = this,
          boolean = true

      if ( !api.isPhone(this.mobile) ) {
        this.mobile_prompt = '手机号码格式错误'
        boolean = false
      }
      if ( this.password.length<6 ) {
        this.password_prompt = '密码必填且大于6位'
        boolean = false
      }

      if (boolean) {
        api.request({
          method: 'post',
          url: 'login',
          data: {
            mobile: this.mobile,
            password: this.password,
            is_admin: 1
          },
          success(res){
            alert(res.msg)
            api.setItem("adminId", res.data.user_id);
            _this.$router.href('admin')
          },
        })
      }
    },
  },
  mounted () { 
    if (api.getItem('adminId')) { 
      this.$router.href('admin')
    }
  },
}
</script>

<style scoped>
@import '../css/login.css';
  .admin-container{
    min-height: 100vh;
    padding: 50px 15px 15px;
    padding-top: 10vh;
    position: relative;
    background-color: #ECF0F5; }
  .content .title { 
    line-height: 1.6;}
  .content .title h3 { 
    font-size: 18px;
    font-weight: bold; }
  .content .title p { 
    font-size: 14px;
    color: #afb9c3; }
  .content .login .login-input-view { 
    margin-bottom: 30px; }

  .submit { 
    margin-top: 20px; }
</style>
