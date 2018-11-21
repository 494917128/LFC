<template>
  <div class="container">
    <NavHeader />

    <div class="content main-content">

      <h1 class="content-title">搜索</h1>

      <div class="search-input">
        <input type="text" v-model="search_value" @keyup.enter="searchSubmit"><button type="submit" class="button" @click="searchSubmit"><i class="iconfont icon-search"></i></button>
      </div>

      <p class="search-text" v-if="list.length">为您找到“{{show_search}}”相关结果{{totalCount}}个</p>

      <template v-if="list.length">
        <MyList :list="list" />
        <MyPagination :pageLength="page_length" :page="page" @clickPage="clickPage" />
      </template>

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
  name: 'search',
  data () {
    return {
      search_value: '',
      show_search: '',
      list: [],
      totalCount: 0,
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
    clickPage ({page}) {
      if (page >= 1 && page <= this.page_length) {
        this.page = page
        this.getProductList()
      }
    },
    searchSubmit () {
      if (this.search_value) {
        this.show_search = this.search_value
        this.list = []
        this.page = 1,
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
          search: this.show_search
        },
        success (res) {
          var list = res.data.list,
              page = res.data.page
          _this.page_length = page.TotalPage
          _this.list = list
          _this.totalCount = page.totalCount
        }
      })
    },
  },
  mounted () { 

  },
}
</script>

<style scoped>
  .search-input { 
    display: flex;
    justify-content: center;
    align-items: stretch;
    margin: 10px 0;
    font-size: 30px; }
  .search-text { 
    text-align: center;
    color: #999;
    line-height: 3;
    margin-top: 10px;
    width: 100%; }
</style>
