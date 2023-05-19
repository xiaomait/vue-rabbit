import service from '@/utils/http'

/*
params: {
    orderState:0,
  page:1,
  pageSize:2
}
*/
// 获取我的订单
export function getUserOrder(params) {
  return service({
    url: '/member/order',
    method: 'GET',
    params,
  })
}
