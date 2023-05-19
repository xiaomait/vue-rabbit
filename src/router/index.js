import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../views/Layout/index.vue'),
      children: [
        {
          path: '', name: 'Home', component: () => import('../views/Home/index.vue'),
        },
        {
          path: '/category/:id', name: 'Category', component: () => import('../views/Category/index.vue'),
        },
        {
          path: '/category/sub/:id', name: 'SubCategory', component: () => import('../views/SubCategory/index.vue'),
        },
        {
          path: '/detail/:id', name: 'Detail', component: () => import('../views/Detail/index.vue'),
        },
        {
          path: '/cartlist/', name: 'CartList', component: () => import('../views/CartList/index.vue'),
        },
        {
          path: '/checkout', name: 'Checkout', component: () => import('../views/Checkout/index.vue'),
        },
        {
          path: '/pay', name: 'Pay', component: () => import('../views/Pay/index.vue'),
        },
        {
          path: '/paycallback', name: 'PayBack', component: () => import('../views/PayBack/index.vue'),
        },
        {
          path: '/member',
          name: 'Member',
          component: () => import('../views/Member/index.vue'),
          children: [
            {
              path: 'user',
              component: () => import('../views/Member/components/MemberUser.vue'),
            },
            {
              path: 'order',
              component: () => import('../views/Member/components/MemberOrder.vue'),
            },
          ],
        },
      ],
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login/index.vue'),
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/Register/index.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
