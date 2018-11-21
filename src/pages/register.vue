<template>
  <div class="container">
    <NavHeader />

    <div class="content">
      <h2 class="title">注册</h2>

      <div class="login">
        <div :class="['login-input-view',name_prompt && 'prompt-show']">
          <label>昵称</label>
          <input type="text" name="lfc_name" class="login-input" v-model="name" autocomplete="off" />
          <label class="prompt" v-if="name_prompt">{{name_prompt}}</label>
        </div>

        <div :class="['login-input-view',mobile_prompt && 'prompt-show']">
          <label>手机号</label>
          <div class="login-input">
            <input type="text" name="lfc_mobile" v-model="mobile" autocomplete="off" />
            <a @click="getCode" v-if="count_down===''">获取验证码</a>
            <a v-else>{{count_down}}秒后再试</a>
          </div>
          <label class="prompt" v-if="mobile_prompt">{{mobile_prompt}}</label>
        </div>
        
        <div :class="['login-input-view',code_prompt && 'prompt-show']">
          <label>验证码</label>
          <input type="text" name="lfc_code" class="login-input" v-model="code" autocomplete="off" />
          <label class="prompt" v-if="code_prompt">{{code_prompt}}</label>
        </div>

        <div :class="['login-input-view',password_prompt && 'prompt-show']">
          <label>密码</label>
          <input type="password" name="lfc_password" class="login-input" v-model="password" autocomplete="new-password" />
          <label class="prompt" v-if="password_prompt">{{password_prompt}}</label>
        </div>

        <div class="submit" @click="register">
          <input class="btn" type="submit" value="注册">
        </div>

        <p class="register"><a @click="$router.href('login?mobile='+mobile)">返回登录</a></p>

      </div>
    </div>

    <NavFooter />

  </div>
</template>

<script>
import NavHeader from '@/components/NavHeader'
import NavFooter from '@/components/NavFooter'
import MyModal from '@/components/MyModal'
export default {
  name: 'register',
  data () {
    return {
      name: '', // 昵称
      name_prompt: '', // 昵称出错时的提醒
      mobile: '', // 手机号
      mobile_prompt: '', // 手机号出错时的提醒
      password: '', // 密码
      password_prompt: '', // 密码出错时的提醒
      code: '', // 验证码
      code_prompt: '', // 验证码出错时的提醒
      count_down: '', // 60秒倒计时
    }
  },
  watch: {
    name: function (val) {
      if (this.name_prompt && val) {
        this.name_prompt = ''
      }
    },
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
    code: function (val) {
      if (this.code_prompt && val) {
        this.code_prompt = ''
      }
    },
  },
  components: {
    NavHeader,
    NavFooter,
    MyModal
  },
  methods:{
    // 获取验证码
    getCode () { 
      var _this = this

      if ( !api.isPhone(this.mobile) ) {
        this.mobile_prompt = '手机号码格式错误'
      } else {
        api.request({
          method: 'post',
          url: 'getCode',
          data: {
            mobile: this.mobile
          },
          success(res){
            alert(res.msg)
            
            // 60秒倒计时
            _this.count_down = 60
            _this.timer = setInterval(() => {
              if (_this.count_down == 0) {
                clearInterval(_this.timer)
                _this.count_down = ''
              } else {
                _this.count_down = _this.count_down - 1
              }
            },1000)
          },
        })

      }
    },

    // 注册
    register () { 
      var _this   = this,
          boolean = true

      if (boolean) {
        api.request({
          method: 'post',
          url: 'register',
          data: {
            name: this.name,
            mobile: this.mobile,
            password: this.password,
            code: this.code
          },
          success(res){
            alert(res.msg)
            _this.$router.href('login?mobile='+_this.mobile);
          },
        })
      }
    },
  },
  mounted () { 
    this.mobile = this.$route.params.mobile || ''
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
  @import '../css/login.css'
</style>
