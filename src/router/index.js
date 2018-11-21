import Vue from 'vue'
import Router from 'vue-router'

// 注册登录
import register from '@/pages/register'
import login from '@/pages/login'
import forgetPassword from '@/pages/forgetPassword'

import about from '@/pages/about'
import account from '@/pages/account'
import orderDetail from '@/pages/orderDetail'
import address from '@/pages/address'
import contact from '@/pages/contact'
import index from '@/pages/index'
import media from '@/pages/media'
import mediaDetail from '@/pages/mediaDetail'
import product from '@/pages/product'
import productlist from '@/pages/productlist'
import returns from '@/pages/returns'
import search from '@/pages/search'
import shoppingBag from '@/pages/shoppingBag'
import shoppingCard from '@/pages/shoppingCard'
import wishlist from '@/pages/wishlist'

// 后台页面
import admin from '@/admin/index'
import admin_login from '@/admin/login'
import productType from '@/admin/product/type'

import aa from '@/admin/aa'

function getData (hash){
    var params = hash.split("?")[1];
    var paramArr = params ? params.split('&') : [];
    var res = {};
    for(var i = 0;i<paramArr.length;i++){
        var str = paramArr[i].split('=');
        res[str[0]]=str[1];
    }
    return res
}
// 页面跳转
Router.prototype.href = function (hash) {
  var data = getData(hash),
      name = hash.split("?")[0];
  this.push({ name: name, params: data });
}
// 属于登录注册的页面
Router.prototype.login_path = [ 'register', 'login' ]
// 必须登录的页面
Router.prototype.login_should = [ 'account', 'address', 'wishlist' ]
// 后台页面，tag不显示
Router.prototype.admin_path = [ 'admin', 'admin/login' ]

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/register',
      name: 'register',
      component: register
    }, 
    {
      path: '/login',
      name: 'login',
      component: login
    }, 
    {
      path: '/forgetPassword',
      name: 'forgetPassword',
      component: forgetPassword
    }, 

    {
      path: '/about',
      name: 'about',
      component: about
    }, 
    {
      path: '/account',
      name: 'account',
      component: account
    }, 
    {
      path: '/orderDetail/:id',
      name: 'orderDetail',
      component: orderDetail
    }, 
    {
      path: '/contact',
      name: 'contact',
      component: contact
    }, 
    {
      path: '/address',
      name: 'address',
      component: address
    }, 
    {
      path: '/',
      name: 'index',
      component: index
    }, 
    {
      path: '/media',
      name: 'media',
      component: media
    }, 
    {
      path: '/mediaDetail/:id',
      name: 'mediaDetail',
      component: mediaDetail
    }, 
    {
      path: '/product/:id',
      name: 'product',
      component: product
    }, 
    {
      path: '/productlist',
      name: 'productlist',
      component: productlist
    }, 
    {
      path: '/returns',
      name: 'returns',
      component: returns
    }, 
    {
      path: '/search',
      name: 'search',
      component: search
    }, 
    {
      path: '/shoppingBag',
      name: 'shoppingBag',
      component: shoppingBag
    }, 
    {
      path: '/shoppingCard',
      name: 'shoppingCard',
      component: shoppingCard
    }, 
    {
      path: '/wishlist',
      name: 'wishlist',
      component: wishlist
    }, 


    {
      path: '/admin',
      name: 'admin',
      component: admin,
      children: [
        {
          path: '/admin/product/type',
          name: 'admin/product/type',
          component: productType
        }, 
        {
          path: '/admin/aa',
          name: 'admin/aa',
          component: aa
        }, 
        
      ]
    }, 
    {
      path: '/admin/login',
      name: 'admin/login',
      component: admin_login
    }, 

  ],
  scrollBehavior (to, from, savedPosition) {
     window.scrollTo(0,0);
  }
})
