import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/userStore'
import router from '@/router'

// 1. 创建axios对象
const service = axios.create({
  baseURL: 'https://pcapi-xiaotuxian-front-devtest.itheima.net/',
  timeout: 3000,
})

// 2. 请求拦截器
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    const token = userStore.userInfo.token
    if (token)
      config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => {
    Promise.reject(error)
  },
)

// 3. 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 判断code码
    return response.data
  },
  (error) => {
    ElMessage.warning(error.response.data.message)
    // 401 token失效处理
    const userStore = useUserStore()
    if (error.response.status === 401)
      userStore.clearUserInfo()
    router.replace('/login')
    return Promise.reject(error)
  },
)

export default service
