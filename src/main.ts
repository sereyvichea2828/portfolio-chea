import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Prevent browser from restoring stale scroll coordinates before DOM & Lenis layout settle
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Guarantee initial route resolution is 100% complete before mounting App.vue
// This prevents START_LOCATION ('/' with undefined meta) from causing false key transitions
router.isReady().then(() => {
  app.mount('#app')
})

