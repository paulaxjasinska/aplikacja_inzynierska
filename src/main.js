import './assets/main.css'
import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import Tooltip from 'primevue/tooltip';

import { createApp } from 'vue'
import App from './views/AppView.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.use(Vue3Toastify,{autoClose:5000})
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {darkModeSelector: 'none'}
    }
});
app.directive('tooltip', Tooltip);
app.mount('#app')

