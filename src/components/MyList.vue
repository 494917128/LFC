<template>
  <div>
    <div class="item-container">
      <a @click="$router.href('product?id='+item.id)" class="item" v-for="(item,index) in list" :key="index">
        <div class="item-image-view">
          <img class="item-image" :src="image_url+item.image">
          <div class="new-label" v-if="item.is_new">NEW</div>
        </div>
        <div class="item-info">
          <div class="item-name">{{item.name}}</div>
          <div class="item-price">£{{item.price || '0.00'}}</div>
        </div>
      </a>
    </div>

  </div>
</template>

<script>
export default {
  name: 'MyList',
  props: ['list'],
  data () {
    return {
      image_url: api.globalData.image_url
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
    .list
  ==============================================================================*/
  .item-container { 
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap; }
  .item { 
    width: 25%;
    text-align: center;
    margin-top: 45px; }
  @media (max-width: 1024px) { 
   .item { 
      width: 50%; } }
  @media (max-width: 480px) { 
   .item { 
      width: 100%; } }
  .item .item-image-view { 
    position: relative;
    padding: 0 25px; }
  .item .item-image { 
    width: 100%; }
  .item .item-image-view .new-label { 
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    z-index: 1;
    top: 0;
    right: 0;
    width: 60px;
    height: 60px;
    border-radius: 60px;
    background: #000;
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px; }
  @media (max-width: 480px) { 
    .item .item-image-view .new-label { 
      width: 40px;
      height: 40px;
      border-radius: 40px; } }
  .item .item-info { 
    margin: 5px 5px 20px;
    padding: 10px 25px 0;
    line-height: 2; }
  .item .item-info .item-name { 
    font-size: 12px;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 2px; }
  .item .item-info .item-price { 
    margin: 0 5px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase; }


    /*============================================================================
    .pagination
  ==============================================================================*/
  .pagination { 
    display: flex;
    justify-content: center; }
  .pagination .pagination-item:first-child { 
    margin-left: 0;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px; }
  .pagination .pagination-item:last-child { 
    margin-right: 0;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px; }
  .pagination .pagination-item { 
    position: relative;
    padding: 6px 12px;
    margin-left: -1px;
    line-height: 1.42857143;
    color: #337ab7;
    text-decoration: none;
    background-color: #fff;
    border: 1px solid #ddd; }
  .pagination .pagination-item.disable { 
    color: #777;
    cursor: not-allowed;
    background-color: #fff;
    border-color: #ddd; }
  .pagination .pagination-item.active { 
    color: #fff;
    cursor: default;
    background-color: #337ab7;
    border-color: #337ab7; }

</style>
