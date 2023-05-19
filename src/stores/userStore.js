// 管理用户数据
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useCartStore } from './cartStore'
import { mergeCartAPI } from '@/api/cart'
import { loginAPI } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const cartStore = useCartStore()
  // 用户的数据
  const userInfo = ref({})
  const getUserInfo = async ({ account, password }) => {
    const res = await loginAPI({ account, password })
    userInfo.value = res.result
    // 合并购物车的操作
    await mergeCartAPI(cartStore.cartList.map((item) => {
      return {
        skuId: item.skuId,
        selected: item.selected,
        count: item.count,
      }
    }))
    cartStore.updateCartListAPI()
  }
  // 退出时清楚用户信息
  const clearUserInfo = () => {
    userInfo.value = {}
    cartStore.clearCart()
  }
  return {
    userInfo,
    getUserInfo,
    clearUserInfo,
  }
}, {
  persist: true,
})
