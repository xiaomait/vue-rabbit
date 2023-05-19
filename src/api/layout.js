import service from '@/utils/http'

export function getCategoryAPI() {
  return service({
    url: '/home/category/head',
    method: 'get',
  })
}
