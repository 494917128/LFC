<template>
  <div class="container">
    <NavHeader />

    <div class="content main-content">
      <h1 class="content-title">{{myCollect?'我的收藏':'媒体'}}</h1>

      <div class="search-input">
        <input type="text" v-model="search_value" @keyup.enter="searchSubmit"><button type="submit" class="button" @click="searchSubmit"><i class="iconfont icon-search"></i></button>
      </div>

      <p class="search-text" v-if="show_search">为您找到“{{show_search}}”相关结果{{totalCount}}个</p>
      <p class="search-text" v-else-if="myCollect&&!list.length">您还未收藏任何媒体</p>

      <MyMedia :item="item" :index="index" @comment="showComment" @more="more" @moreTwo="more" @like="setMediaLike" @collect="setMediaCollect" @commentTwo="commentTwo" @commentThree="commentThree" @commentSubmit="commentSubmit" v-for="(item,index) in list" :key="index" />
      <MyPagination :pageLength="page_length" :page="page" @clickPage="clickPage" />

    </div>

    <NavFooter />
  </div>
</template>

<script>
import NavHeader from '@/components/NavHeader'
import NavFooter from '@/components/NavFooter'
import MyPagination from '@/components/MyPagination'
import MyMedia from '@/components/MyMedia'
export default {
  name: 'media',
  data () {
    return {
      image_url: api.globalData.image_url,
      user_id: '',
      myCollect: false, // 是否是我的收藏
      list: [],
      search_value: '',
      show_search: '', // 是否显示搜索内容
      totalCount: 0,
      page: 1,
      page_length: 1,
      loading: false,
    }
  },
  components: {
    NavHeader,
    NavFooter,
    MyPagination,
    MyMedia
  },
  methods:{
    showComment({index}){
      this.$set(this.list[index], 'show_comment', !this.list[index].show_comment) 
      this.getCommentList(index)
    },
    commentTwo({index,idx}){
      this.$set(this.list[index].comment.list[idx], 'show_comment', !this.list[index].comment.list[idx].show_comment) 
    },
    commentThree({index,idx,i}){
      this.$set(this.list[index].comment.list[idx].comment.list[i], 'show_comment', 
        !this.list[index].comment.list[idx].comment.list[i].show_comment) 
      this.$set(this.list[index].comment.list[idx].comment.list[i], 'comment_value', 
        '回复 @'+this.list[index].comment.list[idx].comment.list[i].name+' ：') 
    },
    more({id}){
      this.$router.href('mediaDetail?id='+id)
    },
    setMediaLike({media_id,comment_id,index,idx,i}){
      var _this = this
      api.request({
        method: 'post',
        url: 'setMediaLike',
        data: {
          media_id: media_id,
          comment_id: comment_id,
          user_id: this.user_id,
        },
        success (res) {
          var change
          if (res.data == 0) {
            change = -1
          } else {
            change = 1
          }

          if (i!=undefined) { // 三级
            _this.$set(_this.list[index].comment.list[idx].comment.list[i], 'like_length', _this.list[index].comment.list[idx].comment.list[i].like_length+change) 
            _this.$set(_this.list[index].comment.list[idx].comment.list[i], 'user_like', res.data) 
          } else if (idx!=undefined) { // 二级
            _this.$set(_this.list[index].comment.list[idx], 'like_length', _this.list[index].comment.list[idx].like_length+change) 
            _this.$set(_this.list[index].comment.list[idx], 'user_like', res.data) 
          } else { // 一级
            _this.$set(_this.list[index], 'like_length', _this.list[index].like_length+change)
            _this.$set(_this.list[index], 'user_like', res.data)
          }

        }
      })
    },
    setMediaCollect ({media_id,index}){
      var _this = this
      api.request({
        method: 'post',
        url: 'setMediaCollect',
        data: {
          media_id: media_id,
          user_id: this.user_id,
        },
        success (res) {
          if (res.data == 0) {
            alert('已从我的收藏中删除')
          } else {
            alert('成功添加至我的收藏')
          }
          _this.$set(_this.list[index], 'user_collect', res.data) 
        }
      })
    },
    // 评论
    commentSubmit({value,media_id,comment_id,index,idx,i}){
      var _this = this
      this.addMediaComment(value,media_id,comment_id,function(){
        _this.getCommentList(index)
        _this.$set(_this.list[index], 'comment_length', _this.list[index].comment_length+1)

        if (i!=undefined) { // 三级
          _this.$set(_this.list[index].comment.list[idx].comment.list[i], 'comment_value', '') 
          _this.$set(_this.list[index].comment.list[idx].comment.list[i], 'show_comment', false) 
        } else if (idx!=undefined) { // 二级
          _this.$set(_this.list[index].comment.list[idx], 'comment_value', '') 
          _this.$set(_this.list[index].comment.list[idx], 'user_like', false) 
        } else { // 一级
          _this.$set(_this.list[index], 'comment_value', '')
        } 
      })
    },
    addMediaComment(value,media_id='',comment_id='', callback){
      var _this = this
      api.request({
        method: 'post',
        url:'addMediaComment',
        data: {
          text: value,
          media_id: media_id,
          comment_id: comment_id,
          user_id: this.user_id,
        },
        success(res){
          callback && callback()
        }
      })
    },
    getCommentList (index) {
      var _this = this
      api.request({
        method: 'post',
        url:'getCommentList',
        data: {
          media_id: this.list[index].id,
          user_id: this.user_id,
        },
        success(res){
          _this.$set(_this.list[index], 'comment', res.data) 
        }
      })
    },
    searchSubmit () {
      this.show_search = this.search_value
      this.list = []
      this.page = 1,
      this.getMediaList()
    },
    getMediaList () {
      var _this = this
      api.request({
        method: 'post',
        url:'getMediaList',
        data: {
          page: this.page,
          search: this.search_value,
          user_id: this.user_id,
          myCollect: this.myCollect,
        },
        success(res){
          var list = res.data.list,
              page = res.data.page
          _this.totalCount = page.totalCount
          _this.page_length = page.TotalPage
          _this.list = list
        }
      })
    },
    clickPage ({page}) {
      if (page >= 1 && page <= this.page_length) {
        this.page = page
        this.getMediaList()
      }
    },

  },
  mounted () { 
    this.user_id = api.getItem('userId')
    this.myCollect = this.$route.params.type=='myCollect'
    this.getMediaList()
  },
}
</script>

<style scoped>
  .content { 
    position: relative; }
  .search-input { 
    position: absolute;
    top: 0;
    right: 40px;
    display: flex;
    justify-content: center;
    align-items: stretch;
    margin: 10px 0;
    font-size: 30px; }
  .search-text { 
    text-align: center;
    color: #999;
    line-height: 3;
    margin: 10px 0;
    width: 100%; }
  @media only screen and (max-width: 768px) { 
    .search-input { 
      position: relative;
      width: 100%;
      right: 0; } }


</style>
