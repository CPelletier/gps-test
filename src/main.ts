import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

import router from './router'

const app = createApp(App).use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})

app.use(createPinia())
app.use(router)

app.mount('#app')
