import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import './assets/normalize.css'
import './assets/global.css'
import './assets/tailwind.css'

createApp(App)
.use(router)
.mount('#app')
