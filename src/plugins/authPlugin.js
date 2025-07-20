// Authentication plugin for Vue app
import { useUserStore } from '../stores/userStore'
import { useAdminStore } from '../stores/adminStore'
import { 
  isUserAuthenticated, 
  isAdminAuthenticated,
  getCurrentUserRole 
} from '../utils/authUtils'

export default {
  install(app) {
    // Initialize authentication state on app start
    app.config.globalProperties.$initAuth = () => {
      const userStore = useUserStore()
      const adminStore = useAdminStore()
      
      // Update user store state
      if (isUserAuthenticated()) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
        if (currentUser) {
          userStore.isAuthenticated = true
          userStore.currentUser = currentUser
        }
      }
      
      // Update admin store state
      if (isAdminAuthenticated()) {
        const adminUser = JSON.parse(localStorage.getItem('adminUser') || 'null')
        if (adminUser) {
          adminStore.isAuthenticated = true
          adminStore.adminUser = adminUser
        }
      }
    }
    
    // Global method to check authentication
    app.config.globalProperties.$isAuthenticated = () => {
      return isUserAuthenticated() || isAdminAuthenticated()
    }
    
    // Global method to get current role
    app.config.globalProperties.$getCurrentRole = () => {
      return getCurrentUserRole()
    }
    
    // Global method to check if user is admin
    app.config.globalProperties.$isAdmin = () => {
      const role = getCurrentUserRole()
      return ['admin', 'sub_admin'].includes(role)
    }
    
    // Global method to check if user is regular user
    app.config.globalProperties.$isUser = () => {
      const role = getCurrentUserRole()
      return ['user', 'customer'].includes(role)
    }
    
    // Listen for storage changes to sync auth state across tabs
    window.addEventListener('storage', (e) => {
      if (['userToken', 'currentUser', 'adminToken', 'adminUser'].includes(e.key)) {
        app.config.globalProperties.$initAuth()
      }
    })
    
    // Initialize on plugin install
    app.config.globalProperties.$initAuth()
  }
}