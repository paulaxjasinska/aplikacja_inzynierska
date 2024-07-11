import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/credit',
      name: 'credit',
      component: () => import('../views/CreditView.vue')
    },
    {
      path: '/restructuring',
      name: 'restructuring',
      component: () => import('../views/RestructuringView.vue')
    }

  ]
})

export default router
