import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Import Bootstrap and Font Awesome
import 'bootstrap/dist/css/bootstrap.min.css'
import * as bootstrap from 'bootstrap'
import '@fortawesome/fontawesome-free/css/all.min.css'

// Make bootstrap available globally
window.bootstrap = bootstrap

// Import global CSS
import './assets/styles/main.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
