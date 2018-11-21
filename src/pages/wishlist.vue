<template>
  <div class="container">
    <NavHeader />

    <div class="content main-content">
      <h1 class="content-title">愿望清单</h1>

      <div class="wishlist-container">
        <div class="item" v-for="(item,index) in wishlist" :key="index">
          <a @click="$router.href('product?id='+item.product_id)"><img :src="image_url+item.image" class="image"></a>
          <a @click="$router.href('product?id='+item.product_id)" class="name">{{item.name}}</a>
          <p class="price">￥{{item.price}}</p>
          <!-- 无尺码选择 -->
          <!-- <button class="button">添加至购物车</button> -->
          <button class="button" @click="$router.href('product?id='+item.product_id)">查看该商品</button>
          <button class="button" @click="removeWishlist(index)">移除</button>
          <!-- <a class="add-note">添加备注 ↓</a> -->
        </div>
      </div>

      <MyPagination :pageLength="page_length" :page="page" @clickPage="clickPage" />
    </div>

    <NavFooter />
  </div>
</template>

<script>
import NavHeader from '@/components/NavHeader'
import NavFooter from '@/components/NavFooter'
import MyPagination from '@/components/MyPagination'
export default {
  name: 'withlist',
  data () {
    return {
      image_url: api.globalData.image_url,
      user_id: '',
      wishlist: [],
      page: 1,
      page_length: 1,
      loading: false,
    }
  },
  components: {
    NavHeader,
    NavFooter,
    MyPagination
  },
  methods:{
    clickPage ({page}) {
      if (page >= 1 && page <= this.page_length) {
        this.page = page
        this.getWishList()
      }
    },
    getWishList () {
      var _this = this
      api.request({
        method: 'post',
        url: 'getWishList',
        data: {
          page: this.page,
          user_id: this.user_id,
        },
        success (res) {
          var list = res.data.list,
              page = res.data.page
          _this.page_length = page.TotalPage
          _this.wishlist = list
        }
      })
    },
    removeWishlist (index) {
      var _this = this
      if (confirm('您确定要将该商品从愿望清单中移除吗？')) {
        api.request({
          method: 'post',
          url: 'setWishlist',
          data: {
            product_id: this.wishlist[index].product_id,
            user_id: this.user_id,
          },
          success (res) {
            if (res.data == 0) {
              _this.getWishList()
            } 
          }
        })
      }
    },

  },
  mounted () { 
    this.user_id = api.getItem('userId')
    this.getWishList()
  },
}
</script>

<style scoped>
  .wishlist-container { 
    display: flex;
    justify-content: center;
    flex-wrap: wrap; }
  .wishlist-container .item { 
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #DCDCDC;
    border-radius: 2px;
    background-color: #F7F7F7;
    padding: 15px 30px;
    margin-left: 1.5%;
    margin-right: 1.5%;
    width: 30%;
    text-align: center;
    margin-top: 45px; }
  @media (max-width: 1024px) { 
    .wishlist-container .item { 
      margin-left: 2.5%;
      margin-right: 2.5%;
      width: 45%; } }
  @media (max-width: 480px) { 
    .wishlist-container .item { 
      margin-left: 5%;
      margin-right: 5%;
      width: 90%; } }
  .wishlist-container .item .image { 
    width: 60%; }
  .wishlist-container .item .name { 
    font-size: 15px;
    line-height: 2;
    font-weight: bold; }
  .wishlist-container .item .price { 
    margin: 10px 0 5px;
    font-size: 14px;
    text-transform: uppercase; }
  .wishlist-container .item .button { 
    align-self: stretch;
    margin: 5px 0; }
  .wishlist-container .item .add-note { 
    margin: 10px 0;
    font-size: 14px;
    text-transform: uppercase; }
        
</style>
