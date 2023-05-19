import service from '@/utils/http'

// 获取banner
export function getBannerAPI(params = {}) {
  const { distributionSite = '1' } = params
  return service({
    url: '/home/banner',
    method: 'get',
    params: { distributionSite },
  })
}
// 获取新鲜好物
export function getNewAPI() {
  return service({
    url: '/home/new',
  })
}
// 获取人气推荐
export function getHotAPI() {
  return service({
    url: '/home/hot',
  })
}
// 获取热门品牌 ---未使用
export function getBrandAPI() {
  return service({
    url: '/home/brand',
  })
}
/**
 * @description: 获取所有商品模块
 * @param {*}
 * @return {*}
 */
export function getGoodsAPI() {
  return service({
    url: '/home/goods',
  })
}
