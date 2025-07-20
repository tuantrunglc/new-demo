import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Import Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Import Font Awesome
import '@fortawesome/fontawesome-free/css/all.min.css'

// Import Toast
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"

// Import global CSS (includes Tailwind)
import './assets/styles/main.css'

// Import auth plugin
import authPlugin from './plugins/authPlugin'

// Import role directive
import roleDirective from './directives/roleDirective'

// Toast options
const toastOptions = {
  position: "top-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false
}

// Create app
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(Toast, toastOptions)
app.use(authPlugin)

// Register role directive
app.directive('role', roleDirective.directive)

app.mount('#app')
