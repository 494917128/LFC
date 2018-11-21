<template>
  <div class="main-content my-content">
    <h1 class="content-title">{{pageData.title}}</h1>
    <div class="content-text" v-html="item" v-for="(item,index) in pageData.text" :key="index"></div>
  </div>
</template>

<script>
export default {
  name: 'MyContent',
  props: ['pageData'], // white的时候白色文字，默认黑色
  data () {
    return {

    }
  },
  methods:{

  },
  mounted () { 
   
  },
}
</script>

<style scoped>
  .my-content{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center; }

  .my-content .content-text { 
    max-width: 580px;
    line-height: 1.6;
    text-align: center;
    font-size: 15px;
    margin-bottom: 20px; }
  .my-content .content-text strong{
    font-weight: bold; }
</style>
