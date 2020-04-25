import {ADD_COUNTER, ADD_TO_CART} from './mutations-types'

export default {
  addCart(context, payload) {
    return new Promise((resolve, reject) => {
      // console.log(payload);
      // 1.查找之前数组是否有该商品
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
      // 2.判断oldProiduct
      if (oldProduct) {
        context.commit(ADD_COUNTER, oldProduct)
        resolve('商品+1');
      }else {
        payload.count = 1
        context.commit(ADD_TO_CART, payload)
        resolve('添加商品');
      }
    })
  }
}
