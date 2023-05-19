import service from '@/utils/http'

// 添加购物车
export function insertCartAPI({ skuId, count }) {
  return service({
    url: '/member/cart',
    method: 'POST',
    data: {
      skuId,
      count,
    },
  })
}
// 获取-购物车列表
export function findNewCartListAPI() {
  return service({
    url: '/member/cart',
    method: 'get',
  })
}
// 删除-购物车商品
export function delCartAPI(ids) {
  return service({
    url: '/member/cart',
    method: 'DELETE',
    data: {
      ids,
    },
  })
}
// 合并购物车
export function mergeCartAPI(data) {
  return service({
    url: '/member/cart/merge',
    method: 'POST',
    data,
  })
}
// 修改-购物车商品
// 请求体传递什么参数就只更新某个字段的值
export function changeCartAPI(id, data) {
  return service({
    url: `/member/cart/${id}`,
    method: 'PUT',
    data,
  })
}
// 修改-购物车全选/取消
export function selectedCartAPI(data) {
  return service({
    url: '/member/cart/selected',
    method: 'PUT',
    data,
  })
}
