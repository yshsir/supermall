<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button class="check-button" :is-checked="isSelcetAll" @click.native="checkClick" />
      <span>全选</span>
    </div>

    <div class="total-price">合计：{{totalPrice}}</div>

    <div class="calculate" @click="toastClick">去计算：({{checkLength}})</div>
  </div>
</template>

<script>
  import CheckButton from "components/content/checkButton/CheckButton";
  import {mapGetters} from 'vuex'
  export default {
    name: "CartBottomBar",
    components: {
      CheckButton
    },
    methods: {
      checkClick() {
        // console.log('*****');
        if (this.isSelcetAll) {//为全选
          this.cartList.forEach(item => item.checked = false)//变成全不选
        }else {//出现不选
          this.cartList.forEach(item => item.checked = true)//便成为全选
        }
      },
      toastClick() {
        if (!this.isSelcetAll){
          this.$toast.show('请选择商品')
        }
      }
    },
    computed: {
      ...mapGetters(['cartList']),
      totalPrice() {
        return '￥' + this.cartList.filter(item => {
          return item.checked
        }).reduce((PreValue, item) => {
          return PreValue + item.price * item.count
        }, 0)
      },
      checkLength() {
        return this.cartList.filter(item => item.checked).length
      },
      isSelcetAll() {
        if(this.cartList.length === 0){return false}
        //找出商品没有被选中的个数,在进行对个数的判断
        // return !(this.cartList.filter(item => !item.checked).length)

        // return !this.cartList.find(item => !item.checked)

        for(let item of this.cartList) {
          if(!item.checked) {
            return false
          }
        }
        return true
      },
    }
  }
</script>
<style scoped>
  .bottom-bar {
    position: relative;
    display: flex;
    font-size: 15px;
    line-height: 40px;
    height: 40px;

    background-color: #eee;
  }
  .check-content {
    display: flex;
    width: 60px;
    align-items: center;
    margin-left: 10px;
  }
  .check-button {
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }
  .total-price {
    margin-left: 10px;
    flex: 1;
  }
  .calculate {
    width: 90px;
    text-align: center;
    background-color: #f13e3a;
    color: #fff;
  }
</style>
