<template>
  <div class="container">
    <NavHeader />

    <div class="content main-content">
      <h1 class="content-title">订单详情</h1>

      <div class="order-info">
        <div>订单号：{{order.order_number}}</div>
        <div v-if="order.address">
          <span>收货地址：</span>
          <span v-if="order.address.consignee">{{order.address.consignee}}，</span>
          <span v-if="order.address.tel">{{order.address.tel}}，</span>
          <span>{{order.address.prov}} {{order.address.city}} {{order.address.district}} {{order.address.address}}，</span>
          <span v-if="order.address.zipcode">{{order.address.zipcode}}</span>
        </div>
        <div>订单总价：￥{{order.totalPrice}}</div>
        <div>物流：</div>
        <div>状态：{{order.state}}</div>
      </div>

      <div class="order-info">
        <div>商品：</div>
      </div>
      <div class="account-order">
        <div class="order-view" v-if="order">
          <div class="order-body">
            <div style="flex:1;overflow: hidden;">
              <div class="order-item" v-for="(item,index) in order.products" :key="index">
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
          </div>
        </div>
        <p class="text" v-else>您还没有订单</p>
      </div>

    </div>

    <NavFooter />

  </div>
</template>

<script>
import NavHeader from '@/components/NavHeader'
import NavFooter from '@/components/NavFooter'
export default {
  name: 'account',
  data () {
    return {
      image_url: api.globalData.image_url,
      order_id: '',
      order: [],
    }
  },
  components: {
    NavHeader,
    NavFooter,
  },
  methods:{
    getOrderDetail(){
      var _this = this
      api.request({
        url: 'getOrderDetail',
        data: {
          order_id: this.order_id
        },
        success (res) {
          _this.order = res.data
        }
      })
    },
  },
  mounted () { 
    this.order_id = this.$route.params.id || ''
    this.getOrderDetail()
  },
}
</script>

<style scoped>
  .content { 
    display: flex;

    flex-direction: column; }
  .content .content-title { 
    width: 100%; }
  .content .order-info { 
    width: 100%;
    padding: 10px;
    line-height: 24px;
    align-self: center;
    display: flex;
    flex-direction: column; }

  .account-order { 
    width: 100%; }


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
</style>
