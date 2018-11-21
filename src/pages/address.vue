<template>
  <div class="container">
    <NavHeader />

    <div class="content main-content">
      <h1 class="content-title">收货地址</h1>

      <div class="address-info">
        <a @click="$router.back()" class="text">返回个人信息</a>
        <a @click="add" class="address-btn button">添加地址</a>
      </div>

      <AddressEdit v-if="add_address" type="add" style="margin-bottom: 40px;" @close="closeAdd"
      @submit="addSubmit" />

      <div class="address-list">

        <div class="address-item" v-for="(item,index) in address" :key="index">
          <AddressEdit v-if="item.edit" :data="item" type="edit" @close="close(index)" @submit="editSubmit(arguments[0], index)" />
          <template v-else>
            <h4 class="address-title">{{item.consignee}}{{item.is_default ? '（默认）' : ''}}</h4>
            <p>{{item.prov}}，{{item.city}}，{{item.district}}</p>
            <p>{{item.address}}</p>
            <p>{{item.zipcode}}</p>
            <p>{{item.tel}}</p>
            <div class="address-actions">
              <a @click="edit(index)">编辑</a>
              <a @click="deleteAddress(item.id)">删除</a>
            </div>
          </template>
        </div>
      </div>

    </div>

    <MyPagination :pageLength="page_length" :page="page" @clickPage="clickPage" />

    <NavFooter />

  </div>
</template>

<script>
import NavHeader from '@/components/NavHeader'
import NavFooter from '@/components/NavFooter'
import AddressEdit from '@/components/AddressEdit'
import MyModal from '@/components/MyModal'
import MyPagination from '@/components/MyPagination'
export default {
  name: 'Address',
  data () {
    return {
      user_id: '',
      address: [],
      add_address: false,
      page: 1,
      page_length: 1,
      loading: false,
    }
  },
  components: {
    NavHeader,
    NavFooter,
    AddressEdit,
    MyModal,
    MyPagination
  },
  methods:{
    resetDefine () {
      var address = this.address
      address.map((item,index)=>{
        item.is_define = 0
      })
    },
    add () {
      this.add_address = !this.add_address
    },
    closeAdd () {
      this.add_address = false
    },
    edit (index) {
      this.$set(this.address[index], 'edit', true) 
    },
    close (index) {
      this.$set(this.address[index], 'edit', false) 
    },
    deleteAddress (id) {
      var _this = this
      if (confirm('您确定要删除该地址吗？')) {
        api.request({
          url: 'deleteAddress',
          data: {
            address_id: id
          },
          success (res) {
            alert(res.msg)
            _this.getAddress()
          }
        })
      }
    },
    addSubmit (data) {
      var _this = this
      data.user_id = this.user_id
      api.request({
        url: 'setAddress',
        data: data,
        success (res) {
          _this.page = 1
          _this.getAddress()
          _this.closeAdd()
        }
      })
    },
    editSubmit (data, index) {
      var _this = this
      if (data.is_define) {
        this.resetDefine()
        this.$set(this.address[index], 'is_define', 1) 
      }
      data.address_id = this.address[index].id
      data.user_id = this.user_id
      api.request({
        url: 'setAddress',
        data: data,
        success (res) {
          _this.address[index] = data
          _this.getAddress()
          _this.close(index)
          alert('修改完成')
        }
      })
    },
    getAddress () {
      var _this   = this
      api.request({
        url: 'getAddress',
        data: {
          page: this.page,
          user_id: this.user_id
        },
        success (res) {
          var list = res.data.list,
              page = res.data.page
          list.map((item,index)=>{
            item.edit = false
            return item
          })
          _this.address = list
          _this.page_length = page.TotalPage
          console.log(list)
        }
      })
    },
    clickPage ({page}) {
      if (page >= 1 && page <= this.page_length) {
        this.page = page
        this.getAddress()
      }
    },
  },
  mounted () { 
    this.user_id = api.getItem('userId')
    this.getAddress()
  },
}
</script>

<style scoped>
  .content { 
    display: flex;
    flex-direction: column; }
  .content .content-title { 
    width: 100%; }

  .address-info { 
    display: flex;
    flex-direction: column;
    justify-content:　flex-start;
    margin-bottom: 40px;
    align-items: flex-start; }
  .address-info .text {
    display: block; 
    margin-bottom: 10px; }
  @media only screen and (max-width: 768px) { 
    .address-info { 
      width: 100%;
      margin: 20px 0 40px; } }

  .address-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap; }
  .address-list .address-item { 
    width: calc(50% - 20px);
    box-sizing: border-box;
    background: rgba(0,0,0,0.05);
    padding: 20px;
    margin-bottom: 40px; }
  @media only screen and (max-width: 768px) { 
    .address-list .address-item { 
      width: 100%; } }
  .address-title { 
    color: #000000;
    font-weight: bold;
    font-size: 18px;
    line-height: 1.2em;
    margin-bottom: 10px; }
  .address-item .address-actions { 
    margin: 10px 0; }
  .address-item .address-actions a { 
    padding-right: 15px; }


  .address-btn { 
    background: #ffffff;
    color: #000000;
    border: 1px solid #000000;
    margin-top: 10px; }
  .address-btn:hover { 
    background: #000000;
    color: #ffffff;
    border-color: #000000; }
</style>
