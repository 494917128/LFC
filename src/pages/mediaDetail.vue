<template>
  <div class="container">
    <NavHeader />

    <div class="content main-content">
      <h1 class="content-title">媒体详情</h1>

      <MyMedia :item="data" :index="0" @comment="" @more="more" @moreTwo="getCommentTwo" @like="setMediaLike" @collect="setMediaCollect" @commentTwo="commentTwo" @commentThree="commentThree" @commentSubmit="commentSubmit" />

    </div>

    <NavFooter />
  </div>
</template>

<script>
import NavHeader from '@/components/NavHeader'
import NavFooter from '@/components/NavFooter'
import MyMedia from '@/components/MyMedia'
export default {
  name: 'mediaDetail',
  data () {
    return {
      image_url: api.globalData.image_url,
      media_id: '',
      user_id: '',
      data: {},
      page: 1,
      page_length: 1,
      loading: false,
    }
  },
  components: {
    NavHeader,
    NavFooter,
    MyMedia
  },
  methods:{
    commentTwo({index,idx}){
      this.$set(this.data.comment.list[idx], 'show_comment', !this.data.comment.list[idx].show_comment) 
    },
    commentThree({index,idx,i}){
      this.$set(this.data.comment.list[idx].comment.list[i], 'show_comment', 
        !this.data.comment.list[idx].comment.list[i].show_comment) 
      this.$set(this.data.comment.list[idx].comment.list[i], 'comment_value', 
        '回复 @'+this.data.comment.list[idx].comment.list[i].name+' ：') 
    },
    // 加载更多一级评论
    more(){
      this.page += 1
      this.getCommentList()
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
            _this.$set(_this.data.comment.list[idx].comment.list[i], 'like_length', _this.data.comment.list[idx].comment.list[i].like_length+change) 
            _this.$set(_this.data.comment.list[idx].comment.list[i], 'user_like', res.data) 
          } else if (idx!=undefined) { // 二级
            _this.$set(_this.data.comment.list[idx], 'like_length', _this.data.comment.list[idx].like_length+change) 
            _this.$set(_this.data.comment.list[idx], 'user_like', res.data) 
          } else { // 一级
            _this.$set(_this.data, 'like_length', _this.data.like_length+change)
            _this.$set(_this.data, 'user_like', res.data)
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
          _this.$set(_this.data, 'user_collect', res.data) 
        }
      })
    },
    // 评论
    commentSubmit({value,media_id,comment_id,index,idx,i}){
      var _this = this
      this.addMediaComment(value,media_id,comment_id,function(){
        _this.page = 1
        _this.$set(_this.data, 'comment', []) 

        _this.getCommentList()
        _this.$set(_this.data, 'comment_length', _this.data.comment_length+1)

        if (i!=undefined) { // 三级
          _this.$set(_this.data.comment.list[idx].comment.list[i], 'comment_value', '') 
          _this.$set(_this.data.comment.list[idx].comment.list[i], 'show_comment', false) 
        } else if (idx!=undefined) { // 二级
          _this.$set(_this.data.comment.list[idx], 'comment_value', '') 
          _this.$set(_this.data.comment.list[idx], 'user_like', false) 
        } else { // 一级
          _this.$set(_this.data, 'comment_value', '')
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
    // 加载更多二级评论
    getCommentTwo ({id,comment_id,page,idx}) {
      var _this = this
      api.request({
        method: 'post',
        url:'getCommentTwo',
        data: {
          page: Number(page)+1,
          media_id: id,
          comment_id: comment_id,
          user_id: this.user_id,
        },
        success(res){
          var page = res.data.page
          var comment = _this.data.comment.list[idx].comment.list || []
          
          comment.push(...res.data.list)
          _this.$set(_this.data.comment.list[idx].comment, 'list', comment) 
          _this.$set(_this.data.comment.list[idx].comment, 'page', page) 
        }
      })
    },
    getCommentList () {
      var _this = this
      api.request({
        method: 'post',
        url:'getCommentList',
        data: {
          page: this.page,
          media_id: this.media_id,
          user_id: this.user_id,
        },
        success(res){
          var page = res.data.page
          if (page.page == 1){
            _this.$set(_this.data, 'comment', {}) 
          }

          var comment = _this.data.comment.list || []

          comment.push(...res.data.list)
          _this.$set(_this.data.comment, 'list', comment) 
          _this.$set(_this.data.comment, 'page', page) 
        }
      })
    },
    getMediaDetail () {
      var _this = this
      api.request({
        method: 'post',
        url:'getMediaDetail',
        data: {
          media_id: this.media_id,
          user_id: this.user_id
        },
        success(res){
          res.data.show_comment = true
          _this.data = res.data
          _this.getCommentList()
        }
      })
    }
  },
  mounted () { 
    this.media_id = this.$route.params.id || ''
    this.user_id = api.getItem('userId')
    this.getMediaDetail()
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
