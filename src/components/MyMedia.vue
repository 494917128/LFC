<template>
  <div>
    <div class="item">
      <img src="@/images/wechat.jpg" class="photo">
      <div class="item-content">
        <div class="item-header">
          <h3 class="name">{{item.name}}</h3>
          <div class="time">{{item.add_time}}</div>
          <div class="text">{{item.text}}</div>
          <div class="images" v-if="item.images">
            <img :src="image_url+img" :class="item.images.length==1?'video':''" v-for="(img,idx) in item.images" :key="idx">
          </div>
          <video class="video" controls="" preload="none" v-if="item.video">
            <source id="mp4" :src="image_url+item.video">
          </video>
        </div>
        <div class="item-footer flexible">
          <a class="footer-nav" @click="$emit('collect', {media_id: item.id, index: index})">
            <i :class="['iconfont',item.user_collect?'icon-home_ico_like-':'icon-like']"></i>
            {{item.user_collect?'已收藏':'收藏'}}
          </a>
          <a :class="['footer-nav',item.show_comment?'active':'']" @click="$emit('comment', {index: index})">
            评论
            <span v-if="item.comment_length">({{item.comment_length}})</span>
          </a>
          <a class="footer-nav" @click="$emit('like', {media_id: item.id, index: index})">
            <i :class="['iconfont',item.user_like?'icon-home_ico_like-':'icon-like']"></i>
            点赞
            <span v-if="item.like_length">({{item.like_length}})</span>
          </a>
        </div>
        <div class="item-comment" v-if="item.show_comment">
          <div class="item-comment-publish flexible">
            <img src="@/images/wechat.jpg" class="photo">
            <input v-model="item.comment_value" type="text" @keyup.enter="$emit('commentSubmit', 
              {value: item.comment_value, media_id: item.id, index: index})" />
            <button class="btn justify-center" @click="$emit('commentSubmit', 
              {value: item.comment_value, media_id: item.id, index: index})">评论</button>
          </div>
          <template v-if="item.comment">
            <div class="item-comment-list item" v-for="(comment,idx) in item.comment.list" :key="idx">
              <img src="@/images/wechat.jpg" class="photo">
              <MyMediaItem :item="comment" @comment="$emit('commentTwo',{index:index, idx:idx})"  @like="$emit('like', {media_id: item.id, comment_id: comment.id, index: index, idx: idx})">
                <div class="item-comment-publish flexible" style="background-color: #fff;" v-if="comment.show_comment">
                  <input v-model="comment.comment_value" type="text" @keyup.enter="$emit('commentSubmit', 
                    {value: comment.comment_value, media_id: item.id, comment_id: comment.id, index: index, idx: idx})" />
                  <button class="btn justify-center" @click="$emit('commentSubmit', 
                    {value: comment.comment_value, media_id: item.id, comment_id: comment.id, index: index, idx: idx})">评论</button>
                </div>
                <div class="item-comment-comment-list" v-if="comment.comment.list.length">
                  <div class="item-comment-comment" v-for="(com,i) in comment.comment.list" :key="i">
                    <MyMediaItem :item="com" @comment="$emit('commentThree',{index:index, idx:idx, i:i})"  @like="$emit('like', {media_id: item.id, comment_id: com.id, index: index, idx: idx, i: i})" >
                      <div class="item-comment-publish flexible" style="background-color: #fff;" v-if="com.show_comment">
                        <input v-model="com.comment_value" type="text" @keyup.enter="$emit('commentSubmit', 
                          {value: com.comment_value, media_id: item.id, comment_id: comment.id, index: index, idx: idx, i: i})" />
                        <button class="btn justify-center" @click="$emit('commentSubmit', 
                          {value: com.comment_value, media_id: item.id, comment_id: comment.id, index: index, idx: idx, i: i})"">评论</button>
                      </div>
                    </MyMediaItem>
                  </div>
                  <a class="justify-center item-comment-more" v-if="comment.comment.page&&comment.comment.page.TotalPage>comment.comment.page.page" @click="$emit('moreTwo', {id: item.id, comment_id: comment.id, page: item.comment.page.page, idx: idx})">查看更多 > </a>
                </div>

              </MyMediaItem>
            </div>
            <a class="justify-center item-comment-more" v-if="item.comment.page&&item.comment.page.TotalPage>item.comment.page.page" @click="$emit('more', {id: item.id})">查看更多 > </a>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MyMediaItem from '@/components/MyMediaItem'
export default {
  name: 'MyMedia',
  props: ['item', 'index'],
  data () {
    return {
      image_url: api.globalData.image_url
    }
  },
  components: { 
    MyMediaItem
  },
  methods:{

  },
  mounted () { 
   
  },
}
</script>

<style scoped>
  .item { 
    margin-bottom: 20px;
    box-shadow: 0 0 2px rgba(0,0,0,0.2);
    border-radius: 2px;
    padding: 20px 20px 10px;
    display: flex;
    overflow: hidden; }
  .photo { 
    width: 60px;
    height: 60px;
    margin-right: 20px;
    border-radius: 50%; }
  @media only screen and (max-width: 768px) { 
    .photo { 
      height: 50px;
      width: 50px;
      margin-right: 10px; } }

  .item-content { 
    flex: 1; }
  .item-content .item-header .name { 
    font-size: 24px;
    line-height: 36px; }
  .item-content .item-header .time, .item-content .item-header .text { 
    width: 90%;
    font-size: 15px;
    line-height: 24px;
    padding-bottom: 2px; }
  .item-content .item-header .images { 
    display: flex;
    flex-wrap: wrap;
    width: 90%;
    margin: 6px 0; }
  .item-content .item-header .images img { 
    width: 150px;
    height: 150px;
    object-fit: cover;
    margin: 2px;
    border: 1px solid rgba(0, 0, 0, .05); }
  .item-content .item-header .video { 
    width: 80%;
    margin: 6px 0; }

  .item-content .item-body { 
    margin: 5px -20px -4px -100px;
    padding: 4px 20px 1px 100px;
    box-sizing: border-box;
    background-color: #f2f2f5; }
  @media only screen and (max-width: 768px) { 
    .item-content .item-header .name { 
      font-size: 20px;
      line-height: 30px; }
    .item-content .item-header .time, .item-content .item-header .text { 
      font-size: 14px;
      line-height: 20px; }
    .item-content .item-body { 
      margin-right: -80px;
      padding-right: 80px; }
    .item-content .item-header .images { 
      width: 100%; }
    .item-content .item-header .video { 
      width: 100%; } }


  .item-footer { 
    align-items: center;
    justify-content: flex-end; }
  .footer-nav { 
    padding: 4px 20px;
    position: relative; }
  .footer-nav.active { 
    font-weight: bold; }
  .footer-nav:after { 
    content: "";
    position: absolute;
    top: 20%;
    bottom: 20%;
    right: -1px;
    width: 1px;
    background-color: #dcdcdc; }
  .footer-nav:last-child:after { 
    content: none; }


  .item-comment { 
    margin-top: 10px;
    margin-left: -100px;
    margin-right: -20px;
    margin-bottom: -10px;
    background-color: #F2F2F2; }
  .item-comment .item-comment-publish { 
    padding: 16px 20px;
    border-bottom: 1px solid #dcdcdc; }
  .item-comment .item-comment-publish .photo { 
    width: 40px;
    height: 40px;
    margin-right: 20px;
    border-radius: 5px; }
  .item-comment .item-comment-publish input { 
    height: 30px;
    padding: 0 10px;
    flex: 1; }
  .item-comment .item-comment-publish .btn { 
    min-width: 0;
    height: 30px;
    box-sizing: border-box;
    padding: 0 20px;
    margin-left: 20px;
    flex-shrink: 0; }

  .item-comment .item-comment-nav { 
    padding: 10px 0 }

  .item-comment .item-comment-list { 
    margin-bottom: 0;
    box-shadow: 0 0 0 ;
    padding: 20px 0 10px;
    margin: 0 20px;
    border: none;
    border-radius: 0;
    border-top: 1px solid #dcdcdc; }
  .item-comment .item-comment-list .time { 
    color: #999; }
  .item-comment .item-comment-list .name { 
    color: #666;
    font-weight: bold;
    font-size: 16px; }

  .item-comment .item-comment-more { 
    border-top: 1px solid #dcdcdc;
    margin-top: 5px;
    height: 36px; }

  .item-comment-comment-list { 
    padding: 10px 0;
    background-color: #EAEAEA; }
  .item-comment-comment { 
    border-top: 1px solid #dcdcdc;
    padding: 0 15px; }
  .item-comment-comment:first-child { 
    border-top: none; }

  @media only screen and (max-width: 768px) { 
    .item-comment { 
      margin-left: -80px; } }
</style>
