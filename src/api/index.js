import service from '@/utils/http';

export function getService(){
  return service({
    url:'/api/service',
    method:'get'
  })
}