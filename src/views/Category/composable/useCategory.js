// 封装分类业务
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { getCategoryAPI } from '@/api/category'

export function useCategory() {
  const categoryData = ref({})
  const route = useRoute()
  async function getCategory(id = route.params.id) {
    const res = await getCategoryAPI(id)
    categoryData.value = res.result
  }
  onMounted(() => {
    getCategory()
  })
  // 解决路由缓冲问题
  onBeforeRouteUpdate((to) => {
    getCategory(to.params.id)
    // console.log(to.params.id, '出口')
  })
  return {
    categoryData,
  }
}
