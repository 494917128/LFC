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
  name: 'about',
  data () {
    return {
      page_data: [{
        title: '关于',
        text: [
          '2018年，因为创始人Alli和Roger都是疯狂足球迷和生活热爱者，为了记录球员的庆祝手势和表达出一种对生活的态度，故以LIVE FOR COOL (LFC) 为概念，创作出一系列全新独立LABEL。LIVE FOF COOL就是一个平台，一个让A & R分享个人时尚与生活喜好的平台。透过LIVE FOR COOL，A & R期望每个人都能，「活出真我」与「过得开心」，一直酷酷的。希望所有人都能感受到球员们的热血和酷劲。<br />',
          'LIVE FOR COOL的产品系列贯彻A & R的简约风格，配合细节与舒适的物料，以网购形式让世界各地更多人都有机会分享。',
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
      type: 'about',
      success (res) {
        _this.page_data = res.data
      }
    })
  },
}
</script>

<style scoped>

</style>
