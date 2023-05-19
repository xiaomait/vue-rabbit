import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useUserStore } from './userStore'
import { changeCartAPI, delCartAPI, findNewCartListAPI, insertCartAPI, selectedCartAPI } from '@/api/cart'

export const useCartStore = defineStore('cart', () => {
  const userStore = useUserStore()
  const isLogin = computed(() =>
    userStore.userInfo.token,
  )
  const cartList = ref([])
  // 获取最新购物车列表
  const updateCartListAPI = async () => {
    const res = await findNewCartListAPI()
    cartList.value = res.result
    // console.log(cartList.value)
  }
  // 添加购物车操作
  const addCart = async (goods) => {
    const { skuId, count } = goods
    // 登陆后的逻辑
    if (isLogin.value) {
      // console.log('登陆后的逻辑')
      await insertCartAPI({ skuId, count })
      updateCartListAPI()
    }
    else {
      const item = cartList.value.find(item => item.skuId === goods.skuId)
      if (item)
        item.count++
      else
        cartList.value.push(goods)
    }
  }
  // 删除购物车操作
  const delCart = async (skuId) => {
    if (isLogin.value) {
      await delCartAPI([skuId])
      updateCartListAPI()
    }
    else {
      // findIndex方法
      const idx = cartList.value.findIndex(item => skuId === item.skuId)
      cartList.value.splice(idx, 1)
      // filter方法
      // const newCart = cartList.value.filter(item => item.skuId !== skuId)
      // cartList.value = newCart
    }
  }
  // 清除购物车
  const clearCart = () => {
    cartList.value = []
  }
  // 云端增加数量方法
  const cartCount = async (skuId, count) => {
    const data = {
      count,
    }
    // console.log(skuId, data)
    await changeCartAPI(skuId, data)
    await updateCartListAPI()
  }
  // 购物车单选框操作
  const singleCheck = async (skuId, selected) => {
    if (isLogin.value) {
      const data = {
        selected,
      }
      // console.log(data, skuId, selected, '登陆之后的单选框操作')
      await changeCartAPI(skuId, data)
      await updateCartListAPI()
    }
    else {
      const item = cartList.value.find(item => item.skuId === skuId)
      item.selected = selected
    }
  }
  // 购物车全选功能
  const allCheck = async (selected) => {
    if (isLogin.value) {
      const ids = cartList.value.map(item => item.skuId)
      const data = {
        selected,
        ids,
      }
      // console.log(data)
      await selectedCartAPI(data)
      await updateCartListAPI()
    }
    else {
      // 把cartList中的每一项的selected都设置为当前的全选框状态
      cartList.value.forEach(item => item.selected = selected)
    }
  }
  // 是否全选计算属性
  const isAll = computed(() => cartList.value.every(item => item.selected))

  // 总数量 所有count之和
  const allCount = computed(() => cartList.value.reduce((a, c) => a + c.count, 0))
  // 总价格 所有项的count*price之和
  const allPrice = computed(() => cartList.value.reduce((a, c) => a + c.count * c.price, 0))
  // 3. 已选择数量
  const selectedCount = computed(() => cartList.value.filter(item => item.selected).reduce((a, c) => a + c.count, 0))
  // 4. 已选择商品价钱合计
  const selectedPrice = computed(() => cartList.value.filter(item => item.selected).reduce((a, c) => a + c.count * c.price, 0))
  return {
    cartList,
    addCart,
    delCart,
    allCount,
    allPrice,
    singleCheck,
    allCheck,
    isAll,
    selectedCount,
    selectedPrice,
    clearCart,
    updateCartListAPI,
    cartCount,
  }
}, {
  persist: true,
})
