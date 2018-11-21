<template>
  <div class="container">
    <NavHeader />

    <div class="content main-content">
      <h1 class="content-title">购物车</h1>

      <template v-if="bag_list.length">
        <div class="bag-list">
          <div class="item" v-for="(item,index) in bag_list" :key="index">
            <a @click="$router.href('product?id='+item.product_id)" class="image">
              <img :src="image_url+item.image" >
            </a>

            <div class="desc">
              <a @click="$router.href('product?id='+item.product_id)">{{item.name}}</a>
              <a>{{item.size}}</a>
            </div>

            <div class="quantity">
              <div class="quantity-view">
                <a class="quantity-button" @click="numSubtract(index)" v-if="item.num!=1">-</a>
                <div class="quantity-button" v-else></div>
                <input type="text" ref="numInput" v-model="item.num" @blur="numUpdate(index)">
                <a class="quantity-button" @click="numAdd(index)">+</a>
              </div>
              <a class="remove" @click="remove(index)">删除×</a>
            </div>

            <div class="price">
              <span class="theme-money">￥{{item.total_price||item.num*item.price}}</span>
            </div>
          </div>
        </div>
        <MyPagination :pageLength="page_length" :page="page" @clickPage="clickPage" />

        <div class="total">
          <h2>总计</h2>
          <h1>￥{{all_price}}</h1>
        </div>

        <div class="address-default" v-if="address.length">
          <h2>收货地址</h2>
          <div class="text">
            <p v-if="address_select">
              <span v-if="address_select.consignee">{{address_select.consignee}}，</span>
              <span v-if="address_select.tel">{{address_select.tel}}，</span>
              <span>{{address_select.prov}} {{address_select.city}} {{address_select.district}} {{address_select.address}}，</span>
              <span v-if="address_select.zipcode">{{address_select.zipcode}}</span>
            </p>
            <div class="address-actions">
              <a @click="showAddress">选择其他</a>
            </div>
          </div>
        </div>
        <div :class="['modal_cover','justify-center',show_address?'show':'']" @click="hideAddress">
          <div class="address-list" @click.stop>
            <a class="modal_close justify-center" @click="hideAddress">X</a>
            <div :class="['address-item',item.id==address_select.id?'active':'']" v-for="(item,index) in address" :key="index">
              <h4 class="address-title">{{item.consignee}}{{item.is_default ? '（默认）' : ''}}</h4>
              <p>{{item.prov}}，{{item.city}}，{{item.district}}</p>
              <p>{{item.address}}</p>
              <p>{{item.zipcode}}</p>
              <p>{{item.tel}}</p>
              <div class="address-actions">
                <a @click="selectAddress(item)">选择</a>
              </div>
            </div>
            <MyPagination :pageLength="address_page_length" :page="address_page" @clickPage="addressPage" style="width:100%;" />
          </div>

        </div>

        <div class="pay">
          <div class="pay-button" @click="pay">
            <img src="@/images/ali-pay.png">
          </div>
          <div class="pay-button">
            <img src="@/images/wechat-pay.png">
          </div>
        </div>

      </template>

      <div class="justify-center" v-else>您的购物车还没有商品</div>

    </div>

    <NavFooter />
  </div>
</template>

<script>
import NavHeader from '@/components/NavHeader'
import NavFooter from '@/components/NavFooter'
import MyPagination from '@/components/MyPagination'
export default {
  name: 'shoppingBag',
  data () {
    return {
      image_url: api.globalData.image_url,
      bag_list: [],
      page: 1,
      page_length: 1,
      address_select: {},
      address: [],
      address_page: 1,
      address_page_length: 1,
      loading: false,
      all_price: '',
      show_address: false, // 判断address模态框是否显示
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
        this.getBagList()
      }
    },
    addressPage ({page}) {
      if (page >= 1 && page <= this.address_page_length) {
        this.address_page = page
        this.getAddress()
      }
    },
    getBagList (callback) {
      var _this = this
      api.request({
        method: 'post',
        url: 'getShoppingBag',
        data: {
          page: this.page,
          user_id: this.user_id,
        },
        success (res) {
          var list = res.data.list
              // page = res.data.page
          // _this.page_length = page.TotalPage
          _this.bag_list = list
          _this.updateAllPrice()
          callback && callback()
        }
      })
    },
    getAddress () {
      var _this   = this
      api.request({
        url: 'getAddress',
        data: {
          page: this.address_page,
          user_id: this.user_id
        },
        success (res) {
          var list = res.data.list,
              page = res.data.page
          _this.address = list
          _this.address_select = list[0]
          _this.address_page_length = page.TotalPage
        }
      })
    },

    numUpdate (index) {
      var value = this.$refs.numInput[index].value
      if (!api.isNum(value)) {
        value = 1
      }
      this.$set(this.bag_list[index], 'num', Number(value))
      this.updateShoppingBag(index)
    },
    numSubtract (index) {
      this.$set(this.bag_list[index], 'num', this.bag_list[index].num-1)
      this.updateShoppingBag(index)
    },
    numAdd (index) {
      this.$set(this.bag_list[index], 'num', this.bag_list[index].num+1) 
      this.updateShoppingBag(index)
    },
    remove (index) { 
      var _this = this
      if (confirm('您确定要将该商品从购物车中移除吗？')) {
        api.request({
          method: 'post',
          url: 'deleteShoppingBag',
          data: {
            id: this.bag_list[index].id,
          },
          success (res) {
            _this.getBagList()
          }
        })
      }
    },
    updateShoppingBag (index) {
      var _this = this,
          id = this.bag_list[index].id,
          num = this.bag_list[index].num
      api.request({
        method: 'post',
        url: 'updateShoppingBag',
        data: {
          id: id,
          num: num,
        },
        success (res) {
          _this.$set(_this.bag_list[index], 'total_price', res.data.total_price) 
          _this.updateAllPrice()
        }
      })
    },
    updateAllPrice () {
      var all_price = 0
      for (var i = 0, len = this.bag_list.length; i < len; i++) {
        var price = Number(this.bag_list[i].total_price) || this.bag_list[i].num * this.bag_list[i].price
        all_price += price
      }
      this.all_price = all_price.toFixed(2)
    },
    showAddress(){
      this.show_address = true
    },
    hideAddress(){
      this.show_address = false
    },
    selectAddress(item) {
      this.address_select = item
      this.hideAddress()
    },
    pay (bag_id) {
      var _this = this
      api.request({
        method: 'post',
        url: 'addOrder',
        data: {
          address_id:　this.address_select.id,
          user_id: this.user_id,
          totalPrice: this.all_price,
        },
        success (res) {
          alert('购买成功')
          _this.getBagList()
        }
      })
    }
  },
  mounted () { 
    this.user_id = api.getItem('userId')
    this.getBagList(this.getAddress)
  },
}
</script>

<style scoped>
    /*============================================================================
    .bag-list
  ==============================================================================*/
  .bag-list { 
    margin: 10px 0 40px;
    padding-bottom: 40px;
    border-bottom: 1px solid #e2e2e2; }
  .bag-list .item {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    border-top: 1px solid #e2e2e2;
    padding: 10px 0; }
  .bag-list .item:first-child { 
    border-top: none; }

  .bag-list .item .image {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    width: 100px;
    height: 100px;
    margin-right: 30px; }
  .bag-list .item .image img { 
    width: 100%;
    height: 100%;
    object-fit: cover; }

  .bag-list .item .desc {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: 15px;
    line-height: 1.7;
    flex-grow: 1;
    padding-top: 24px;
    padding-bottom: 24px;
    padding-right: 20px; }
  @media only screen and (max-width: 768px) { 
    .bag-list .item .desc {
      flex: inherit;
      padding-right: 0;
      width: calc(100% - 130px); } }

  .bag-list .item .quantity { 
    padding-top: 15px;
    padding-bottom: 10px;
    margin-right: 40px;
    text-align: center; }
  .bag-list .item .quantity .quantity-view { 
    display: flex;
    white-space: nowrap;
    border: 1px solid #000;
    background: #fff;
    color: #000; }
  .bag-list .item .quantity .quantity-button { 
    box-sizing: content-box;
    width: 16px;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 5px; }
  .bag-list .item .quantity .quantity-view input { 
    border: none;
    width: 2em;
    padding-left: 5px;
    padding-right: 5px;
    text-align: center;
    box-sizing: content-box; }
  .bag-list .item .quantity .remove { 
    display: block;
    margin-top: 5px; }

  .bag-list .item .price { 
    padding-top: 24px;
    padding-bottom: 24px;
    text-align: right;
    flex-shrink: 0;
    width: 100px; }
  @media only screen and (max-width: 768px) { 
    .bag-list .item .price { 
      flex-grow: 1; } }

    /*============================================================================
    .total
  ==============================================================================*/
  .total { 
    display: flex;
    justify-content: space-between;
    margin-bottom: 50px; }
  .total h2 { 
    font-weight: bold;
    padding: 0 20px;
    font-size: 27px; }
  .total h1 { 
    font-size: 30px; }

    /*============================================================================
    .pay
  ==============================================================================*/
  .pay { 
    display: flex;
    justify-content: flex-end; }
  .pay .pay-button { 
    background-color: #3DAF35;
    margin: 0 10px;
    box-shadow: 3px 3px 4px 2px rgba(0, 0, 0, 0.3); }
  .pay .pay-button img { 
   width: 80px;
   hegiht: 80px; }

    /*============================================================================
    .address
  ==============================================================================*/
  .address-default { 
    display: flex;
    justify-content: space-between;
    margin-bottom: 50px; }
  .address-default h2 { 
    font-weight: bold;
    padding: 0 20px;
    font-size: 20px; }
  .address-default .text {
    max-width: 50%; 
    text-align: right;
    font-size: 16px; }

  .modal_cover{
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
  .modal_close { 
    position: absolute;
    top: 10px;
    right: 10px;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    font-size: 20px;
    color: #fff;
    background-color: #ddd; }

  .address-list {
    width: 90%;
    max-height: 100vh;
    overflow-y: auto;
    max-width: 600px;
    position: relative;
    padding: 10px 20px 10px;
    border-radius: 5px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap; }
  .address-list .address-item { 
    width: calc(50% - 20px);
    box-sizing: border-box;
    background: rgba(0,0,0,0.05);
    padding: 20px;
    margin: 20px 0; }
  .address-list .address-item.active { 
    background-color: #ccc; }
  .address-title { 
    color: #000000;
    font-weight: bold;
    font-size: 18px;
    line-height: 1.2em;
    margin-bottom: 10px; }
  .address-actions { 
    margin: 10px 0; }
  .address-actions a { 
    padding-right: 15px; }

</style>
