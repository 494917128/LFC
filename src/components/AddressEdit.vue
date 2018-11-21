<template>
  <div class="address-edit">
    <h4 class="address-title">添加地址</h4>
    <div class="input-view">
      <label>联系人</label>
      <input type="text" :value="data.consignee" @input="inputData($event.target.value, 'consignee')">
    </div>
    <div class="input-view">
      <label>省</label>
      <select v-model="prov">
        <option v-for="option in arr" :value="option.name">
          {{ option.name }}
        </option>
      </select>
    </div>
    <div class="input-view">
      <label>市</label>
      <select v-model="city">
        <option v-for="option in cityArr" :value="option.name">
          {{ option.name }}
        </option>
      </select>
    </div>
    <div class="input-view" v-if="district">
      <label>区</label>
      <select v-model="district">
        <option v-for="option in districtArr" :value="option.name">
          {{ option.name }}
        </option>
      </select>
    </div>
    <div class="input-view">
      <label>详细地址</label>
      <input type="text" :value="data.address" @input="inputData($event.target.value, 'address')">
    </div>
    <div class="input-view">
      <label>邮编</label>
      <input type="text" :value="data.zipcode" @input="inputData($event.target.value, 'zipcode')">
    </div>
    <div class="input-view">
      <label>联系人电话</label>
      <input type="text" :value="data.tel" @input="inputData($event.target.value, 'tel')">
    </div>
    <div class="input-view">
      <label>
        <input type="checkbox" :checked="data.is_default" @input="inputData($event.target.checked?1:0, 'is_default')">
        设置为默认
      </label>
    </div>
    <div class="input-view">
      <input class="btn" type="button" :value="type=='add'?'添加地址':'修改地址'" @click="$emit('submit',return_data)">
    </div>
    <a @click="$emit('close')">关闭</a>
  </div>
</template>

<script>
import arrAll from '@/js/region.js'
export default {
  name: 'AddressEdit',
  props: {
    data: {
      type: Object,
      default: function () {
        return { }
      }
    },
    type: String
  },
  data () {
    return {
      return_data: { },
      arr: arrAll,
      prov: '北京',
      city: '北京',
      district: '东城区',
      cityArr: [],
      districtArr: []
    }
  },
  methods:{
    inputData (val, name) {
      console.log(val)
      this.return_data[name] = val
      console.log(this.return_data)
    },
    updateCity: function () {
      for (var i in this.arr) {
        var obj = this.arr[i];
        if (obj.name == this.prov) {
          this.cityArr = obj.sub;
          break;
        }
      }
      this.city = this.cityArr[1].name;
    },
    updateDistrict: function () {
      for (var i in this.cityArr) {
        var obj = this.cityArr[i];
        if (obj.name == this.city) {
          this.districtArr = obj.sub;
          break;
        }
      }
      if(this.districtArr && this.districtArr.length > 0 && this.districtArr[1].name) {
        this.district = this.districtArr[1].name;
      } else {
        this.district = '';
      }
    }
  },
  mounted () { 
    // 设置默认三级地址
    this.data.prov = this.data.prov || '北京'
    this.data.city = this.data.city || '北京'
    this.data.district = this.data.district || '东城区'
    // 更新数据
    this.return_data = this.data
    this.prov = this.data.prov
    this.city = this.data.city
    this.district = this.data.district
  },
  beforeMount: function () {
    this.updateCity();
    this.updateDistrict();
  },
  watch: {
    prov: function () {
      this.updateCity();
      this.updateDistrict();
    },
    city: function () {
      this.updateDistrict();
    }
  }
}
</script>

<style scoped>
  .address-title { 
    color: #000000;
    font-weight: bold;
    font-size: 18px;
    line-height: 1.2em;
    margin-bottom: 10px; }

  .address-edit { 
    margin-left: auto;
    margin-right: auto;
    width: 420px;
    max-width: 100%; }
  .address-edit .input-view { 
    margin-bottom: 20px;
    display: flex;
    flex-direction: column; }
  .address-edit .input-view label { 
    line-height: 1.6;
    margin-bottom: 4px; }
  .address-edit .btn { 
    width: 50%; }
</style>
