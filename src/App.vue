<template>
  <div id="app">  	
    <keep-alive include="productlist,search">
      <router-view/>
    </keep-alive>
    <MyTag v-if="show_tag" />
  </div>
</template>

<script>
import MyTag from '@/components/MyTag'

export default {
  name: 'App',
  data() {
    return {
      show_tag: true
    }
  },
  watch: {
    '$route' (to, from) {
      this.isLogin(to.name)
    }
  },
  components: {
    MyTag
  },
  methods: {
    // name：路由名，当页面处在登录注册但是已经登录过的用户，直接跳转到index页面
  	isLogin (name) { 
  	  var _this        = this,
          login_path   = this.$router.login_path,
          login_should = this.$router.login_should,
          admin_path   = this.$router.admin_path
      login_path.map((item, index) => { 
      	if (name == item && api.getItem('userId')) { 
      		_this.$router.href('index')
      	}
      })
      login_should.map((item, index) => { 
        if (name == item && !api.getItem('userId')) { 
          _this.$router.href('login')
        }
      })
      admin_path.map((item, index) => { 
        if (name == item) { 
          _this.show_tag = false
        }
      })
  	}
  },
  mounted () { 
  	var name = this.$router.history.current.name
  	this.isLogin(name)
  },

}
</script>

<style>
#app{
	display: relative;
}
</style>
