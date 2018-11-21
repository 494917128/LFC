<template>
<div class="admin-container">
  <div class="admin-title justify-center">
    登出
  </div>

  <div class="admin-content">
    <div class="admin-nav">
      <div @click="$router.href('admin/product/type')">上传商品标签</div>
    </div>
    <router-view class="admin-router"></router-view>
  </div>

</div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      adminId: '',
    }
  },
  methods:{

  },
  mounted () { 
    if (!api.getItem('adminId')) { 
      this.$router.href('admin/login')
      return;
    }
    this.adminId = api.getItem('adminId')
  },
}
</script>

<style scoped>
  .admin-container { 
    display: flex;
    flex-direction: column;
    min-height: 100vh; }
  .admin-title { 
    height: 48px;
    background-color: #5CB147;
    color: #FFF; }

  .admin-content { 
    flex: 1;
    display: flex; }
  .admin-nav { 
    background-color: #3B3B3B;
    color: #FFF;
    padding: 10px;
    flex-shrink: 0; }
  .admin-router { 
    flex: 1; }
</style>
