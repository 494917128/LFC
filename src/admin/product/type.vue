<template>
  <div class="type-container">
    <form @submit.prevent="submit" ref="form">
      <input type="text" hidden :value="admin_id">
      <div>标签名</div>
      <input type="text" :value="form_data.classify_name">
      <div>标签显示视频</div>
      <input type="file" accept="video/*" name="video"  >
      <input type="submit" value="提交">
    </form>
  </div>
</template>

<script>
export default {
  name: 'type',
  data () {
    return {
      admin_id: '',
      form_data: {}
    }
  },
  methods:{
    submit(e) {
      var _this = this
      api.request({
        method: 'post',
        url: 'uploadVideo',
        data: new FormData(this.$refs.form),
        success(res){
          console.log(res)
          _this.upload(res.data.video)
        },
      })
    },
    upload(video){
      var data = this.form_data
      data.admin_id = this.admin_id
      data.classify_video = video
      api.request({
        method: 'post',
        url: 'addProductClassify',
        data: data,
        success(res){
          alert('上传成功')
        },
      })
    }
  },
  mounted () { 
    this.admin_id = api.getItem("adminId");
  },
}
</script>

<style scoped>
.type-container{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;  
}
</style>
