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
  name: 'contact',
  data () {
    return {
      page_data: [
        { title: '联系我们', text: ['<br>'] },
        { title: '客服', text: ['电话：18964845365（同微信）'] },
        { title: '营业时间', text: ['周一到周日：9am-5pm'] },
        { title: '地址', text: ['浙江省杭州市萧山区宁围街道盈一佳苑18幢2单元1702室'] },
      ]
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
      type: 'contact',
      success (res) {
        _this.page_data = res.data
      }
    })
  },
}
</script>

<style scoped>

</style>
