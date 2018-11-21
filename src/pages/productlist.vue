<template>
  <div class="container">
    <NavHeader />

    <div class="content product-content">
      <div class="nav">
        <a @click="clickNav(index)" :class="['nav-item', index==nav_index?'active':'']" v-for="(item,index) in nav" :key="index">
          <!-- <img :src="image_url+item.image" v-if="item.image" /> -->
          <a>{{item.name}}</a>
        </a>
      </div>

      <video controls="" width="100%" preload="none" autoplay="autoplay" v-if="video">
          <source :src="image_url+video" type="video/mp4">
      </video>

      <div class="nav">
        <a @click="clickType(index)" :class="['nav-item', index==type_index?'active':'']" v-for="(item,index) in type" :key="index">
          <!-- <img :src="image_url+item.image" v-if="item.image" /> -->
          <a>{{item.name}}</a>
        </a>
      </div>
      <MyList :list="list" :pageLength="page_length" :page="page" />
      <MyPagination :pageLength="page_length" :page="page" @clickPage="clickPage" />

    </div>

    <NavFooter />
  </div>
</template>

<script>
import NavHeader from '@/components/NavHeader'
import NavFooter from '@/components/NavFooter'
import MyList from '@/components/MyList'
import MyPagination from '@/components/MyPagination'
export default {
  name: 'productlist',
  data () {
    return {
      image_url: api.globalData.image_url,
      nav: [],
      nav_index: 0,
      type: [],
      type_index: 0,
      video: '',
      list: [],
      page: 1,
      page_length: 1,
      loading: false,
    }
  },
  components: {
    NavHeader,
    NavFooter,
    MyList,
    MyPagination
  },
  methods:{
    getNav () {
      var _this = this
      api.request({
        url: 'getProductClassify',
        data: {},
        success (res) {
          _this.nav = res.data.list
          _this.video = res.data.list[0].video
          _this.getProductType()
          // _this.getProductList()
        }
      })
    },
    clickNav (index) {
      if (index != this.nav_index) { 
        this.page = 1
        this.nav_index = index
        this.video = this.nav[index].video
        this.getProductType()
        // this.getProductList()
      }
    },
    clickType (index) {
      if (index != this.type_index) { 
        this.page = 1
        this.type_index = index
        this.getProductList()
      }
    },
    getProductType(){
      var _this = this
      api.request({
        method: 'post',
        url: 'getProductType',
        data: {
          classify_id: this.nav[this.nav_index].id
        },
        success (res) {
          _this.type = res.data.list
          _this.type_index = 0
          _this.getProductList()
        }
      })
    },
    clickPage ({page}) {
      if (page >= 1 && page <= this.page_length) {
        this.page = page
        this.getProductList()
      }
    },
    getProductList () {
      var _this = this
      api.request({
        method: 'post',
        url: 'getProductList',
        data: {
          page: this.page,
          classify_id: this.nav[this.nav_index].id,
          type_id: this.type[this.type_index].id
        },
        success (res) {
          var list = res.data.list,
              page = res.data.page
          _this.page_length = page.TotalPage
          _this.list = list
        }
      })
    },
  },
  mounted () { 
    this.getNav()
    var user_id = api.getItem('userId')
  },
}
</script>

<style scoped>
  .nav { 
    text-align: center;
    white-space: nowrap;
    overflow-x: auto;
    padding: 30px 0 20px;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 2px;
    width: 100%; }

  .nav-item { 
    line-height: 30px;
    padding: 0 10px; }
  .nav-item.active * { 
    border-bottom: 2px solid #000; }
  .nav-item:hover { 
    opacity: .7; }
  .nav-item img { 
    width: 30px;
    height: 30px;
    object-fit: contain; }


  video { 
    width: 100%;
    height: 50vh;
    object-fit: contain;
    display: block; }
</style>
