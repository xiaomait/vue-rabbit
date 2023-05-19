import service from '@/utils/http'

// 添加-收货地址
export function addAddressAPI(data) {
  return service({
    url: '/member/address',
    method: 'post',
    data,
  })
}
// 获取-收货地址
export function getAddressAPI() {
  return service({
    url: '/member/address',
    method: 'get',
  })
}
// 修改-收货地址---未适配
export function changeAddressAPI(id, data) {
  return service({
    url: `/member/address${id}`,
    method: 'PUT',
    data,
  })
}
// 删除-收货地址
export function delAddressAPI(id) {
  return service({
    url: `/member/address/${id}`,
    method: 'DELETE',
  })
}
