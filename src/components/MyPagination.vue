<template>
  <div class="pagination" v-if="pageLength>1">
    <a :class="['pagination-item',page==1?'disable':'']" @click="$emit('clickPage',{page: page-1})"><</a>

    <a :class="['pagination-item', index+1==page?'active':'']" v-for="(item,index) in pageLength" :key="index" v-if="showPage(page, index)" @click="$emit('clickPage',{page: index+1})">{{index+1}}</a>

    <a :class="['pagination-item',page==pageLength?'disable':'']" @click="$emit('clickPage',{page: page+1})">></a>
  </div>

</template>

<script>
export default {
  name: 'MyList',
  props: ['page', 'pageLength'],
  data () {
    return {
      image_url: api.globalData.image_url
    }
  },
  methods:{
    showPage (page, index) {
      if (page < 4) {
        return index <= 5
      } else if (page > this.pageLength - 3) {
        return index >= this.pageLength - 6
      } else {
        return index <= page + 2 && index >= page - 3
      }
    }
  },
  mounted () { 
   
  },
}
</script>

<style scoped>

    /*============================================================================
    .pagination
  ==============================================================================*/
  .pagination { 
    margin-top: 20px;
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
