import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import CreditView from '../views/CreditView.vue';

createApp(HomeView).use(Vue3Toastify).mount('#app')

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
      component: () => import('../views/RestructuringView.vue'),
      props: route => ({ paymentType: route.query.paymentType,
        paymentMethod: route.query.paymentMethod,
        lata: route.query.lata,
        kwotaglowna: route.query.kwotaglowna,
        stopa: route.query.stopa, })
    }


  ]
})

export default router
