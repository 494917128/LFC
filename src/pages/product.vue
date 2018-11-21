<template>
  <div class="container">
    <NavHeader />

    <div class="content product-content">
      <div class="product-info">
        <div class="text-view">
          <div class="text" v-for="(item,index) in product_data.type" :key="index">{{item}}</div>
        </div>
        <div class="text-view"></div>
      </div>

      <div class="product-image-view">

        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(item,index) in product_data.imgs" :key="index">
              <img class="product-image" :src="image_url+item">
            </div>
          </div>
          <div class="swiper-button-prev"></div><!--左箭头-->
          <div class="swiper-button-next"></div><!--右箭头-->
        </div>


        <div class="swiper-pagination"></div>

      </div>

      <div class="product-info">
        <div class="text title">{{product_data.name}}</div>
        <div class="text title">￥{{product_data.price}}</div>

        <div class="input-view" v-if="product_data.sizes&&product_data.sizes.unit.length">
          <label>尺码</label>
          <select v-model="product_size">
            <option disabled value="">请选择</option>
            <option v-for="(item,index) in product_data.sizes.unit" :key="index" :value="item.size_id">{{item.size_name}}</option>
          </select>
        </div>

        <a class="size-btn" @click="sizeTable" v-if="product_data.sizes&&product_data.sizes.unit.length">尺码表</a>

        <div class="input-view">
          <label>数量</label>
          <input type="number" v-model="product_num" />
        </div>

        <a class="product-like justify-center" @click="like">
          <i :class="['iconfont',product_data.is_wish?'icon-home_ico_like-':'icon-like']"></i>
          <span>愿望清单</span>
        </a>

        <div class="button-view">
          <a @click="shoppingBag" class="button btn" type="button">添加购物车</a>
        </div>

      </div>
    </div>

    <NavFooter />

    <div :class="['size-table', 'justify-center', size_show?'show':'']" v-if="product_data.sizes&&product_data.sizes.unit.length" @click="sizeHidden">
      <div class="size-table-container" @click.stop>
        <a class="close" @click="sizeHidden">×</a>
        <div class="title">尺码表</div>
        <table border="1" cellspacing="0" cellpadding="0">
          <tr>
            <th></th>
            <th v-for="(item,index) in product_data.sizes.unit" :key="index">{{item.size_name}}</th>
          </tr>
          <tr v-for="(item,index) in product_data.sizes.list">
            <th>{{item.type}}</th>
            <td v-for="(val,idx) in item.list" :key="idx">{{val.value}}</td>
          </tr>
        </table>
        <div class="text">所有单位均为厘米(cm)</div>
      </div>
    </div>

  </div>
</template>

<script>
import NavHeader from '@/components/NavHeader'
import NavFooter from '@/components/NavFooter'
import MyModal from '@/components/MyModal'
export default {
  name: 'product',
  data () {
    return {
      image_url: api.globalData.image_url,
      product_id: '',
      user_id: '',
      product_data: {},
      product_size: '',
      product_num: '1',
      size_show: false,
    }
  },
  components: {
    NavHeader,
    NavFooter,
    MyModal
  },
  methods:{
    sizeTable () {
      this.size_show = true
    },
    sizeHidden () {
      this.size_show = false
    },
    like () {
      var _this = this

      api.request({
        method: 'post',
        url: 'setWishlist',
        data: {
          product_id: this.product_id,
          user_id: this.user_id,
        },
        success (res) {
          if (res.data == 0) {
            alert('已从愿望清单中删除')
          } else {
            alert('成功添加至愿望清单')
          }
          _this.$set(_this.product_data, 'is_wish', res.data) 
        }
      })
    },
    getProduct () {
      var _this = this
      // this.product_data = {
      //   id: 1, 
      //   name: 'JLINGZ Original Logo Hoodie', 
      //   imgs: [ require('@/images/product.png'), require('@/images/product.png') ], 

      //   sizes: {
      //     unit: ['X','XX','X','XX','X'],
      //     list: [
      //       { type: 'chest', value: [1,2,3,4,5] },
      //       { type: 'length', value: [11,12,13,14,15] }
      //     ]
      //   },
      //   type: [ 
      //     { name: '经典T恤1' }, 
      //     { name: '经典T恤2' }, 
      //     { name: '经典T恤3' } 
      //   ],
      //   price: '45.00',
      //   is_new: 1,
      //   is_wish: 0,
      // } 
      api.request({
        method: 'post',
        url: 'getProduct',
        data: {
          product_id: this.product_id,
          user_id: this.user_id || 0,
        },
        success (res) {
          console.log(res)
          _this.product_data = res.data
          setTimeout(()=>{_this.newSwiper()},100)
        }
      })
    },
    newSwiper () {
      new Swiper('.swiper-container', {
        setWrapperSize: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      })
    },
    // 添加购物车
    shoppingBag () {
      var _this = this
      if (!this.user_id) {
        alert('请登录后再添加购物车')
      } else if (!this.product_size && this.product_data.sizes && this.product_data.sizes.unit.length) {
        alert('请选择尺码')
      } else if (!api.isNum(this.product_num)) {
        alert('请输入正确的数量')
      } else {
        api.request({
          method: 'post',
          url: 'setShoppingBag',
          data: {
            product_id: this.product_id,
            user_id: this.user_id,
            size_id: this.product_size,
            num: Number(this.product_num),
          },
          success (res) {
            if(confirm('添加成功，是否查看购物车？')){
              _this.$router.href('shoppingBag')
            }
          }
        })
      }
    },
  },
  mounted () { 
    this.product_id = this.$route.params.id || ''
    this.user_id = api.getItem('userId')
    this.getProduct()
  },
}
</script>

<style scoped>
  @media (max-width: 768px) { 
    .main-content { 
      display: flex;
      flex-direction: column; } }

  .product-info { 
    display: flex;
    flex-direction: column;
    width: 20%; }
  .product-info .text-view { 

    flex: 1; }
  .product-info .text { 
    color: #000;
    padding: 10px 0;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: initial;
    letter-spacing: 2px; }

  .product-image-view { 
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 60%; }
  .product-image-view .swiper-button-prev, .product-image-view .swiper-button-next { 
    width: 15px;
    height: 30px;
    padding: 0 20px;
    background-size: 15px 30px; }
  @media (max-width: 1024px) { 
    .product-image-view .swiper-button-prev, .product-image-view .swiper-button-next { 
      width: 10px;
      height: 20px;
      padding: 0 20px;
      background-size: 10px 20px; } }
  .product-image-view .swiper-pagination { 
    position: relative; }
  .product-image-view .swiper-slide { 
    display: flex;
    justify-content: center;
    align-items: center; }
  .product-image-view .product-image, .product-image-view .swiper-container { 
    width: 80%;
    margin: auto; }
  @media (max-width: 1024px) { 
    .product-info { 
      width: 25%; }
    .product-image-view { 
      width: 50%; } }
  @media (max-width: 768px) { 
    .product-info { 
      text-align: center;
      width: 100%; }
    .product-image-view { 
      width: 100%; } }

  .product-info .title { 
    font-weight: 700;
    padding: 15px 0; }
  .product-info .input-view { 
    display: flex;
    align-items: center; }
  .product-info .size-btn { 
    font-size: 12px;
    line-height: 30px;
    align-self: flex-end; }
  .product-info .product-like { 
    align-self: flex-start;
    margin-top: 20px;
    font-size: 20px; }
  .product-info .product-like .iconfont { 
    font-size: 20px; }
  .product-info .product-like span { 
    margin-top: -3px;
    font-size: 12px;
    padding-left: 10px;
    font-weight: bold; }
  .product-info .input-view label { 
    font-size: 12px;
    margin-right: 20px;
    flex-shrink: 0; }
  .product-info .input-view select, .product-info .input-view input { 
    font-size: 12px;
    flex: 1; }
  .product-info .button-view { 
    display: flex;
    flex-direction: column;
    padding: 10px 0; }
  .product-info .button-view .btn { 
    margin: 15px 0; }

  .size-table { 
    background-color: rgba(0, 0, 0, 0.3);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    transition: all 0.3s;
    opacity: 0;
    visibility: hidden; }
  .show{
    visibility: visible;
    opacity: 1; }
  .size-table-container { 
    position: relative;
    background-color: #F0F0F0;
    border-radius: 2px;
    padding: 20px;
    overflow: hidden; }
  .size-table-container .close { 
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 16px; } 
  .size-table-container .title { 
    font-size: 18px;
    font-weight: bold;
    padding: 10px 0;
    text-align: center; }
  .size-table-container .text { 
    padding: 10px 0;
    text-align: center; }
</style>
