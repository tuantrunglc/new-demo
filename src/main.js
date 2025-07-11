import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Import Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Import Font Awesome
import '@fortawesome/fontawesome-free/css/all.min.css'

// Import global CSS (includes Tailwind)
import './assets/styles/main.css'

// Create app
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
