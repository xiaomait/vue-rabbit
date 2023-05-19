import service from '@/utils/http'

// 所有和用户相关的接口函数
export function loginAPI({ account, password }) {
  return service({
    url: '/login',
    method: 'POST',
    data: {
      account,
      password,
    },
  })
}
// 注册接口
export function registerAPI(data) {
  return service({
    url: '/register',
    method: 'POST',
    data,
  })
}
// 发送验证码接口
export function sendCodeAPI({ mobile }) {
  return service({
    url: '/register/code',
    method: 'GET',
    params: {
      mobile,
    },
  })
}
// 猜你喜欢接口
export function getLikeListAPI({ limit = 4 }) {
  return service({
    url: '/goods/relevant',
    params: {
      limit,
    },
  })
}
