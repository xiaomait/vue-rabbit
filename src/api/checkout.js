import service from '@/utils/http'

// 生成-订单(结算页)
export function getCheckInfoAPI() {
  return service({
    url: '/member/order/pre',
    method: 'get',
  })
}
// 提交-订单
export function createOrderAPI(data) {
  return service({
    url: '/member/order',
    method: 'post',
    data,
  })
}

/* 添加-收货地址 未适配
export function getCheckAPI() {
  return service({
    url: '/member/order/pre',
    method: 'get',
  })
}
*/
