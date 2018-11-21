<template>
  <div class="container">
    <NavHeader />

    <MyContent class="content" :pageData='item' v-for="(item,index) in page_data" :key="index" />

    <NavFooter />
  </div>
</template>

<script>
import NavHeader from '@/components/NavHeader'
import NavFooter from '@/components/NavFooter'
import MyContent from '@/components/MyContent'

export default {
  name: 'returns',
  data () {
    return {
      page_data: [{
        title: '退换',
        text: [
          '七天内可换码换色，质量问题可退',
          '不论退换货，寄来运费由买家承担，寄回运费由卖家承担',
          '配饰类物品不接受退换',
          '任何不确定的问题，可以与客服进行联系',
          '工作时间<br />\
          周一到周日：9am-5pm'
        ],
      }]
    }
  },
  components: {
    NavHeader,
    NavFooter,
    MyContent
  },
  methods:{

  },
  mounted () { 
    var _this = this
    api.getContent({
      _this: this,
      type: 'returns',
      success (res) {
        _this.page_data = res.data
      }
    })
  },
}
</script>

<style scoped>


</style>
