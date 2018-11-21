<template>
<div>
  qq
</div>
</template>

<script>
import NavHeader from '@/components/NavHeader'
export default {
  name: 'index',
  data () {
    return {

    }
  },
  components: {
    NavHeader,
  },
  methods:{

  },
  mounted () { 
    var userId = api.getItem('userId')

  },
}
</script>

<style>
  .tag { 
    display: none; }
</style>

<style scoped>
  .index-container{
    height: 100vh;
    width: 100%;
    overflow: hidden;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .index-container .banner-content {
    width: 100%;
    text-align: center;
    position: relative; }
  .index-container h3 {
    opacity: 0.4;
    color: #fff;
    font-size: 240px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 5px;
    user-select: none;
    z-index: 0;
    position: relative; }
  @media (max-width: 1024px) {
    .index-container h3 {
      font-size: 170px; } }
  @media (max-width: 768px) {
    .index-container h3 {
      font-size: 125px; } }
  @media (max-width: 480px) {
    .index-container h3 {
      font-size: 77px; } }
  .index-container .btn {
    z-index: 1;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 45px;
    margin: 0 auto;
    max-width: 215px; }
  @media (max-width: 1024px) {
    .index-container .btn {
      position: relative;
      bottom: 0; } }
</style>
