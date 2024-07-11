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
      path: '/restructuring1',
      name: 'restructuring1',
      component: () => import('../views/Restructuring1View.vue')
    }

  ]
})

export default router
