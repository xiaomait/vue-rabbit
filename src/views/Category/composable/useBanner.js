// 封装banner轮播图
import { onMounted, ref } from 'vue'
import { getBannerAPI } from '@/api/home'

export function useBanner() {
  const bannerList = ref([])
  async function getBanner() {
    const res = await getBannerAPI({ distributionSite: '2' })
    bannerList.value = res.result
  }
  onMounted(() => {
    getBanner()
  })
  return { bannerList }
}
