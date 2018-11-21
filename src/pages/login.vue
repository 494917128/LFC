<template>
  <div class="container">
    <NavHeader />

    <div class="content">
      <h2 class="title">登录</h2>

      <div class="login">
        <div :class="['login-input-view',mobile_prompt && 'prompt-show']">
          <label>手机号</label>
          <input type="text" name="lfc_mobile" class="login-input" v-model="mobile" autocomplete="off" />
          <label class="prompt" v-if="mobile_prompt">{{mobile_prompt}}</label>
        </div>

        <div :class="['login-input-view',password_prompt && 'prompt-show']">
          <label>密码</label>
          <div class="login-input">
            <input type="password" name="lfc_password" v-model="password" autocomplete="new-password" @keyup.enter="login" />
            <a @click="$router.href('forgetPassword?mobile='+mobile)">忘记密码？</a>
          </div>
          <label class="prompt" v-if="password_prompt">{{password_prompt}}</label>
        </div>

        <div class="submit" @click="login">
          <input class="btn" type="submit" value="登录" autocomplete="off">
        </div>

        <p class="register"><a @click="$router.href('register?mobile='+mobile)">注册账号</a></p>

      </div>
    </div>

    <NavFooter />

    <!-- <MyModal :show="modal_text" title="提示" :text="modal_text" :noCancel="true" @cancel="cancel" @confirm="cancel" /> -->

  </div>
</template>

<script>
import NavHeader from '@/components/NavHeader'
import NavFooter from '@/components/NavFooter'
import MyModal from '@/components/MyModal'
export default {
  name: 'login',
  data () {
    return {
      mobile: '', // 手机号
      mobile_prompt: '', // 手机号出错时的提醒
      password: '', // 密码
      password_prompt: '', // 密码出错时的提醒
      // modal_text: '',
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
    NavFooter,
    MyModal
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
            password: this.password
          },
          success(res){
            alert(res.msg)
            api.setItem("userId", res.data.user_id);
            _this.$router.href('index')
          },
        })
      }
    },
  },
  mounted () { 
    this.mobile = this.$route.params.mobile || ''
    this.password = this.$route.params.password || ''
  },
}
</script>

<style scoped>
  @import '../css/login.css';
</style>
