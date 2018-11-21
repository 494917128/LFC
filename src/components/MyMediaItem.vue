<template>
    <div class="item-content">
      <div class="item-header">
        <div class="text"><span class="name">{{item.name}}</span>：{{item.text}}</div>
        <div class="align-justify">
          <div class="time">{{item.add_time}}</div>
          <div class="item-footer flexible">
            <a class="footer-nav" @click="$emit('comment')">回复</a>
            <a class="footer-nav" @click="$emit('like')">
              <i :class="['iconfont',item.user_like?'icon-home_ico_like-':'icon-like']"></i>
              点赞
              <span v-if="item.like_length">({{item.like_length}})</span>
            </a>
          </div>
        </div>
      </div>
      <slot></slot>
    </div>
</template>

<script>
export default {
  name: 'MyMediaItem',
  props: ['item'],
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

  .item-content { 
    flex: 1; }
  .item-content .item-header .name { 
    font-size: 24px;
    line-height: 36px; }
  .item-content .item-header .time, .item-content .item-header .text { 
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

  @media only screen and (max-width: 768px) { 
    .item-comment { 
      margin-left: -80px; } }
</style>
