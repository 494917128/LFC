<template>
  <div class="footer">
    <h1 class="footer-title">微信</h1>

    <div class="footer-wechat">
      <img src="@/images/wechat.jpg">
    </div>

    <div class="footer-nav">
      <a @click="$router.href('productlist')" class="footer-nav-item">商店</a>
      <a @click="$router.href('about')" class="footer-nav-item">关于</a>
      <a @click="$router.href('media')" class="footer-nav-item">媒体</a>
      <a @click="$router.href('returns')" class="footer-nav-item">退换</a>
      <a @click="$router.href('contact')" class="footer-nav-item">联系</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavFooter',
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
    .footer
  ==============================================================================*/
  .footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 60px; }

  .footer-title {
    font-size: 18px; }

  .footer-wechat {
    width: 300px;
    margin: 20px 0 50px; }
  @media (max-width: 1024px) {
    .footer-wechat {
      width: 200px; } }
  .footer-wechat img {
    width: 100%;
    height: 100%;
    box-shadow: 5px 5px 6px 2px rgba(0, 0, 0, 0.5); }

  .footer-nav { 
    display: flex;
    width: 600px;
    max-width: 100%;
    justify-content: space-around;
    margin: 1em 0 40px; }
  .footer-nav-item { 
    white-space: nowrap;
    padding: 0 20px;
    color: #000;
    font-size: 16px;
    font-weight: 400;
    text-transform: uppercase;
    user-select: none;
    letter-spacing: 1.7px; }
  @media (max-width: 480px) {
    .footer-nav {
      margin-bottom: 1em; }
    .footer-nav-item {
      padding-top: 5px;
      padding-bottom: 5px; } }
</style>
