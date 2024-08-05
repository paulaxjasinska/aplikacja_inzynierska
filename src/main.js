import './assets/main.css'
import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import VTooltip from 'tooltip';


import { createApp } from 'vue'
import App from './views/AppView.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.use(Vue3Toastify,{autoClose:5000})
app.mount('#app')
app.directive('tooltip', VTooltip);
