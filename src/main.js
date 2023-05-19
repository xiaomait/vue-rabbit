import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 引入懒加载
import VueLazyload from 'vue-lazyload'
import App from './App.vue'
import router from './router'
import '@/assets/styles/common.scss'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
// pinia数据持久化
pinia.use(piniaPluginPersistedstate)

app.mount('#app')
app.use(VueLazyload, {
  preLoad: 1.3,
  loading: '/src/assets/images/load.gif',
  attempt: 1,
  // the default is ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend']
  listenEvents: ['scroll'],
})
