import service from '@/utils/http'

// 生成-订单(结算页)
export function getOrderAPI(id) {
  return service({
    url: `/member/order/${id}`,
    method: 'get',
  })
}
// 获取-订单详情(以及支付结果)
