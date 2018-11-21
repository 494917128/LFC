<template>
  <div class="tag">
    <span>官方旗舰店</span>
  </div>
</template>

<script>
export default {
  name: 'MyTag',
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
  .tag{
    box-shadow: 0 5px 6px 4px rgba(0, 0, 0, 0.5);
    background-color: #000;
    width: 60px;
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
  }
  .tag span {
    font-size: 16px;
    width: 16px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #fff;
    display: block;
    position: relative;
  }
</style>
