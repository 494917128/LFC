<template>
  <div class="container">
    <NavHeader />

    <div class="content main-content">
      <h1 class="content-title">用户</h1>

      <div class="account-info">
        <a class="photo">
          <img :src="userInfo.user_image||'@/images/default.png'">
          <input type="file" @change="uploadImage" accept="image/gif,image/jpeg,image/png,image/jpg">
        </a>
        <h5 class="name">
          {{userInfo.nickname || '匿名'}}
          <a class="iconfont icon-bianji" @click="update('name')"></a>
        </h5>
        <p class="text">
          {{userInfo.mobile || '无'}}
          <a class="iconfont icon-bianji" @click="update('mobile')"></a>
        </p>
        <div class="text">
          <template v-if="userInfo.address_default">
            <p>{{userInfo.address_default.consignee}}</p>
            <p>{{userInfo.address_default.prov}}，{{userInfo.address_default.city}}，{{userInfo.address_default.district}}</p>
            <p>{{userInfo.address_default.address}}</p>
            <p>{{userInfo.address_default.zipcode}}</p>
            <p>{{userInfo.address_default.tel}}</p>
          </template>

          <a @click="$router.href('address')">收货地址({{userInfo.address_num||0}})</a>
        </div>
        <a class="text" @click="collect">我的收藏({{userInfo.collect_length||0}})</a>
        <a class="text" @click="update('password')">修改密码</a>
        <a class="text" @click="logout">退出登录</a>
      </div>

      <div class="account-order">
        <div class="order-view" v-if="order.length" v-for="(item,index) in order" :key="index">
          <div class="order-header">{{item.date}}  订单号：{{item.order_number}}</div>
          <div class="order-body">
            <div style="flex:1;overflow: hidden;">
              <div class="order-item" v-for="(item,index) in item.products" :key="index">
                <a @click="$router.href('product?id='+item.id)">
                  <img :src="image_url+item.images[0]" class="order-image">
                </a>
                <div class="order-desc">
                  <a @click="$router.href('product?id='+item.id)">{{item.name}}</a>
                  <a>{{item.size}}</a>
                </div>
                <div class="order-price">￥{{item.price}}</div>
                <div class="order-num">{{item.num}}</div>
              </div>
            </div>
            <div class="order-more"><p>￥{{item.totalPrice}}</p></div>
            <div class="order-more"><a @click="$router.href('orderDetail?id='+item.id)">订单详情</a></div>
          </div>
        </div>
        <p class="text" v-else>您还没有订单</p>
      </div>

    </div>

    <MyPagination :pageLength="page_length" :page="page" @clickPage="clickPage" />

    <NavFooter />

    <MyModal :show="modal_show" :title="modal_title" @cancel="modalCancel" @confirm="modalConfirm" >
      <!-- 修改昵称 -->
      <div class="modal-input" v-if="modal_type=='name'">
        <div :class="['login-input-view', name_prompt?'prompt-show':'']">
          <label>昵称</label>
          <input type="text" class="login-input" v-model="name" />
          <label class="prompt" v-if="name_prompt">{{name_prompt}}</label>
        </div>
      </div>
      <!-- 修改手机号 -->
      <template v-if="modal_type=='mobile'">
        <div class="modal-input">
          <div :class="['login-input-view', mobile_prompt?'prompt-show':'']">
            <label>新的手机号</label>
            <div class="login-input">
              <input type="text" v-model="mobile" />
              <a @click="getCode" v-if="count_down===''">获取验证码</a>
              <a v-else>{{count_down}}秒后再试</a>
            </div>
            <label class="prompt" v-if="mobile_prompt">{{mobile_prompt}}</label>
          </div>
        </div>
        <div class="modal-input">
          <div :class="['login-input-view', code_prompt?'prompt-show':'']">
            <label>验证码</label>
            <input type="text" class="login-input" v-model="code" />
            <label class="prompt" v-if="code_prompt">{{code_prompt}}</label>
          </div>
        </div>
      </template>
      <!-- 修改密码 -->
      <template v-if="modal_type=='password'">
        <div class="modal-input">
          <div class="login-input-view">
            <label>手机号</label>
            <div class="login-input">
              <input type="text" :value="userInfo.mobile" disabled />
            </div>
          </div>
        </div>
        <div class="modal-input">
          <div class="login-input-view">
            <label>旧密码</label>
            <div :class="['login-input-view', password_prompt?'prompt-show':'']">
              <div class="login-input">
                <input type="password" v-model="password" />
                <a @click="$router.href('forgetPassword?mobile='+userInfo.mobile)">忘记密码？</a>
              </div>
              <label class="prompt" v-if="password_prompt">{{password_prompt}}</label>
            </div>
          </div>
        </div>
        <div class="modal-input">
          <div :class="['login-input-view', new_password_prompt?'prompt-show':'']">
            <label>新密码</label>
            <input type="password" class="login-input" v-model="new_password" />
            <label class="prompt" v-if="new_password_prompt">{{new_password_prompt}}</label>
          </div>
        </div>
      </template>
    </MyModal>
  </div>
</template>

<script>
import NavHeader from '@/components/NavHeader'
import NavFooter from '@/components/NavFooter'
import MyModal from '@/components/MyModal'
import MyPagination from '@/components/MyPagination'
export default {
  name: 'account',
  data () {
    return {
      image_url: api.globalData.image_url,
      user_id:'',
      userInfo: {},
      order: [],
      page: 1,
      page_length: 1,

      count_down: '', // 倒计时
      name: '', // 昵称
      name_prompt: '', // 昵称出错时的提醒
      mobile: '', // 手机号
      mobile_prompt: '', // 手机号出错时的提醒
      password: '', // 密码
      password_prompt: '', // 密码出错时的提醒
      new_password: '', // 新密码
      new_password_prompt: '', // 新密码出错时的提醒
      code: '', // 验证码
      code_prompt: '', // 验证码出错时的提醒
      count_down: '', // 60秒倒计时

      modal_type: '',
      modal_show: false,
      modal_title: '',

      imgs: [],

    }
  },
  components: {
    NavHeader,
    NavFooter,
    MyModal,
    MyPagination
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
    new_password: function (val) {
      if (this.new_password_prompt && this.password>=6) {
        this.new_password_prompt = ''
      }
    },
    code: function (val) {
      if (this.code_prompt && val) {
        this.code_prompt = ''
      }
    },
  },
  methods:{
    uploadImage(event){
      var _this = this
      api.uploadFile(event,function(res){
        _this.updateUserInfo({
          image: res.data.image,
          user_id: _this.user_id
        })
      })

    },
    update (type) {
      var modal_title = ''
      switch (type) {
        case ('name'):
          modal_title = '昵称'
          break;
        case ('mobile'):
          modal_title = '手机号'
          break;
        case ('password'):
          modal_title = '密码'
          break;
      }

      this.modal_type = type
      this.modal_show = true
      this.modal_title = '修改'+modal_title
    },
    // 获取验证码
    getCode () { 
      var _this = this

      if ( !api.isPhone(this.mobile) ) {
        this.mobile_prompt = '手机号码格式错误'
      } else {
        api.request({
          method: 'post',
          url: 'code/getCode',
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
    modalCancel(){
      this.modal_show = false
    },
    modalConfirm(){
      var _this   = this,
          boolean = true,
          data    = {}

      if (this.modal_type=='name') {
        if ( !this.name ) {
          this.name_prompt = '请输入昵称'
          boolean = false
        }
        if (boolean) {
          data.name = this.name
        }
      } else if (this.modal_type=='mobile') {
        if ( !api.isPhone(this.mobile) ) {
          this.mobile_prompt = '手机号码格式错误'
          boolean = false
        }
        if ( !this.code ) { 
          this.code_prompt = '请输入验证码'
          boolean = false
        }
        if (boolean) {
          data.mobile = this.mobile
          data.code = this.code
        }
      } else if (this.modal_type=='password') {
        if ( this.password.length<6 ) {
          this.password_prompt = '密码必填且大于6位'
          boolean = false
        }
        if ( this.new_password.length<6 ) {
          this.new_password_prompt = '密码必填且大于6位'
          boolean = false
        }
        if (boolean) {
          data.mobile = this.userInfo.mobile
          data.password = this.password
          data.new_password = this.new_password
        }
      }

      if (boolean) {
        data.user_id = this.user_id
        this.updateUserInfo(data)
      }

    },
    updateUserInfo(data){
      var _this = this
      api.request({
        url: 'user/update-info',
        data: data,
        success (res) {
          console.log(res.data)
          if (res.state == 1){
            _this.modalCancel()
            alert(res.msg)
            _this.getUserInfo()
          }
        }
      })
    },
    logout () {
      api.removeItem('access_token')
      api.removeItem('refresh_token')
      this.$router.href('login')
    },
    collect (){
      this.$router.href('media?type=myCollect')
    },
    getUserInfo(){
      var _this = this
      api.request({
        url: 'user/info',
        data: { },
        success (res) {
          _this.userInfo = res.data
          _this.name = res.data.nickname
          console.log(res.data)
        }
      })
    },
    getOrderList(){
      var _this = this
      api.request({
        url: 'getOrderList',
        data: {
          page: this.page,
          user_id: this.user_id
        },
        success (res) {
          var list = res.data.list,
              page = res.data.page
          _this.page_length = page.TotalPage
          _this.order = list
          console.log(res.data)
        }
      })
    },
    clickPage ({page}) {
      if (page >= 1 && page <= this.page_length) {
        this.page = page
        this.getOrder()
      }
    },
  },
  mounted () { 
    this.getUserInfo()
    this.getOrderList()
  },
}
</script>

<style scoped>
  .content { 
    display: flex;
    flex-wrap: wrap; }
  .content .content-title { 
    width: 100%; }

  .account-info { 
    display: flex;
    flex-direction: column;
    padding-right: 5px;
    width: 30%; }
  .account-info .photo { 
    width: 80px;
    height: 80px;
    margin-bottom: 15px;
    position: relative; }
  .account-info .photo:hover:before { 
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,.5); }
  .account-info .photo:hover:after { 
    content: '更改头像';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 40px;
    height: 40px;
    text-align: center;
    letter-spacing: 1px;
    line-height: 16px;
    margin: auto;
    border: 1px solid #fff;
    display: flex;
    justify-content: center;
    align-items: center;  
    color: #fff;
    font-size: 14px; }
  .account-info .photo img { 
    width: 100%;
    height: 100%;
    object-fit: cover; }
  .account-info .photo input[type="file"] { 
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    padding: 0;
    z-index: 1; }
  .account-info .name { 
    font-size: 20px;
    margin-bottom: 15px; }
  .account-info .text { 
    margin-bottom: 15px; }
  .account-order { 
    width: 70%; }
  @media only screen and (max-width: 768px) { 
    .account-info,.account-order { 
      float: none;
      display: block;
      width: 100%;
      margin: 20px 0; } }

    /*============================================================================
    .order
  ==============================================================================*/
  .order-view {
    overflow: hidden;
    border: 1px solid #ececec;
    margin: 10px; }
  .order-view:hover { 
    border-color: #bfbfbf; }
  .order-view .order-header { 
    padding: 10px 15px;
    background-color: #ececec; }

  .order-view .order-body { 
    display: flex; }
  .order-view .order-item { 
    flex: 1;
    padding: 10px;
    display: flex;
    list-style: none;
    border-top: 1px solid #e2e2e2; }
  .order-view .order-item:first-child { 
    border-top: none; }
  .order-view .order-image { 
    width: 100px;
    height: 100px;
    margin-right: 10px;
    object-fit: cover; }
  .order-view .order-desc { 
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: 15px;
    line-height: 24px; 
    flex-grow: 1;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-right: 10px; }
  .order-view .order-price {
    line-height: 24px; 
    padding: 10px 3px;
    text-align: center;
    width: 88px; }
  .order-view .order-num { 
    line-height: 24px; 
    width: 44px;
    padding: 10px 3px;
    text-align: center; }

  .order-view .order-more { 
    flex-shrink: 0;
    min-width: 88px;
    text-align: center;
    line-height: 1.8;
    border: 1px solid #ececec;
    padding: 20px 10px;
    border-width: 0 1px; }
  .order-view .order-more p { 
    font-weight: bold; } 



    /*============================================================================
    .modal-input
  ==============================================================================*/
  .modal-input { 
    text-align: left; }
  .login-input-view { 
    margin-bottom: 20px; }
  .login-input-view label { 
    display: block;
    font-size: 14px;
    line-height: 1.8;
    margin-bottom: 4px; }
  .login-input-view .prompt { 
    margin-bottom: -14px;
    color: red; }
  .login-input { 
    border: 1px solid #000;
    display: flex;
    align-items: center;
    background-color: #fff;
    width: 100%; }
  .login-input input { 
    flex: 1;
    border:none; }
  .login-input a{ 
    padding-right: 10px;
    padding-left: 10px; }

  .login-input-view.prompt-show { 
    color: red; }
  .login-input-view.prompt-show .login-input { 
    border-color: red; }
</style>
