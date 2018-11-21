<template>
  <div class="header">

    <div :class="['header-container',color]">
      <div class="header-left">
        <a class="header-mobile-nav">
          <i class="iconfont icon-nav" />
        </a>

        <a title="商店" @click="$router.href('productlist')">商店</a>

        <a title="关于" @click="$router.href('about')">关于</a>
      </div>

      <a @click="$router.href('index')" class="header-logo">
        <img :src="[color=='white'?require('@/images/logo/logo_white.png'):require('@/images/logo/logo.png')]" alt="LFC">
        <span :style="{color: color=='white'?'#FFF':'#000'}">LFC</span>
      </a>

      <div class="header-right"> 
        <a title="媒体" @click="$router.href('media')">
          <i class="iconfont icon-xiangji" />
        </a>

        <a title="愿望清单" @click="$router.href('wishlist')">
          <i class="iconfont icon-like" />
        </a>

        <a title="搜索" @click="$router.href('search')">
          <i class="iconfont icon-search" />
        </a>

        <a title="用户" @click="$router.href('account')">
          <i class="iconfont icon-account" />
        </a>

        <a title="购物车" @click="$router.href('shoppingBag')" class="header-mobile-show">
          <i class="iconfont icon-shopping-bag" />
        </a>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'NavHeader',
  props: ['color'], // white的时候白色文字，默认黑色
  data () {
    return {

    }
  },
  methods:{

  },
  mounted () { 
   
  },
}
</script>

<style scoped>
    /*============================================================================
    .header
  ==============================================================================*/
  .header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 120px;
    transition: all 0.3s ease;
    z-index: 1; }
  .header .header-container {
    display: flex;
    align-items: center;
    position: relative;
    padding: 25px 55px; }
  @media (max-width: 1024px) {
    .header .header-container {
      padding: 25px 30px; } }

    /*============================================================================
    .header-left
  ==============================================================================*/
  .header .header-left { 
    flex: 1; }
  .header .header-left a {
    padding-right: 55px;
    font-size: 16px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 4.08px;
    color: #000;
    transition: opacity 0.3s ease; }
  .header .header-left a:hover {
    opacity: 0.6; }
  @media (max-width: 1024px) {
    .header .header-left a {
      padding-right: 25px; } }
  @media (max-width: 768px) {
    .header .header-left a {
      display: none; } }
  .header .header-left a.header-mobile-nav {
    display: none; }
  .header .header-left a.header-mobile-nav .iconfont{
    font-size: 24px;
    color: #797C7A;
  }
  @media (max-width: 768px) {
    .header .header-left a.header-mobile-nav {
      display: block; } }

  .header .header-container.white .header-left a, .header .header-container.white .header-left a.header-mobile-nav .iconfont {
    color: #FFF;
  }

    /*============================================================================
    .header-right
  ==============================================================================*/
  .header .header-right {
    text-align: right;
    flex: 1; }
  .header .header-right a {
    margin: 0;
    display: inline-block;
    padding-left: 55px; }
  .header .header-right a .iconfont{
    font-size: 24px;
    color: #000;
    transition: opacity 0.3s ease; }
  .header .header-right a .iconfont:hover {
    opacity: 0.6; }
  @media (max-width: 1024px) {
    .header .header-right a {
      padding-left: 25px; } }
  @media (max-width: 768px) {
    .header .header-right a {
      display: none; }
    .header .header-right .header-mobile-show {
      display: block; } }

  .header .header-container.white .header-right a .iconfont {
    color: #FFF;
  }

    /*============================================================================
    .header-logo
  ==============================================================================*/
  .header .header-logo { 
    position: relative;
    display: flex;
    flex-direction: column;
    flex-shrink: 0; }
  .header .header-logo img {
    max-width: 76px; }
  .header .header-logo span { 
    position: absolute;
    left: 0;
    right: 0;
    bottom: 8px;
    text-align: center;
    font-size: 20px;
    letter-spacing: 3px;
    font-weight: bold; }
</style>
