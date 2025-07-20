import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { useAdminStore } from '../stores/adminStore'
import {
  isUserAuthenticated,
  isAdminAuthenticated,
  getCurrentUserRole,
  isCurrentUserAdmin,
  isCurrentUserRegular,
  getHomeRoute,
  clearAllAuth
} from '../utils/authUtils'

export function useAuth() {
  const router = useRouter()
  const userStore = useUserStore()
  const adminStore = useAdminStore()
  
  // Reactive authentication state
  const isUserAuth = ref(isUserAuthenticated())
  const isAdminAuth = ref(isAdminAuthenticated())
  const currentRole = ref(getCurrentUserRole())
  
  // Computed properties
  const isAuthenticated = computed(() => isUserAuth.value || isAdminAuth.value)
  const isAdmin = computed(() => isCurrentUserAdmin())
  const isUser = computed(() => isCurrentUserRegular())
  const authType = computed(() => {
    if (isAdminAuth.value) return 'admin'
    if (isUserAuth.value) return 'user'
    return null
  })
  
  // Watch for changes in localStorage
  const updateAuthState = () => {
    isUserAuth.value = isUserAuthenticated()
    isAdminAuth.value = isAdminAuthenticated()
    currentRole.value = getCurrentUserRole()
  }
  
  // Listen for storage changes
  window.addEventListener('storage', updateAuthState)
  
  // Methods
  const login = async (credentials, type = 'user') => {
    try {
      let result = false
      
      if (type === 'admin') {
        result = await adminStore.login(credentials.username, credentials.password)
      } else {
        result = await userStore.login(credentials.email, credentials.password)
      }
      
      if (result) {
        updateAuthState()
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }
  
  const logout = (type = null) => {
    if (type === 'admin' || (!type && isAdminAuth.value)) {
      adminStore.logout()
    }
    
    if (type === 'user' || (!type && isUserAuth.value)) {
      userStore.logout()
    }
    
    if (!type) {
      clearAllAuth()
    }
    
    updateAuthState()
    
    // Redirect to appropriate page
    if (type === 'admin' || isAdmin.value) {
      router.push('/admin/login')
    } else {
      router.push('/login')
    }
  }
  
  const redirectToHome = () => {
    const homeRoute = getHomeRoute(currentRole.value)
    router.push(homeRoute)
  }
  
  const checkAccess = (routePath) => {
    if (routePath.startsWith('/admin')) {
      return isAdmin.value
    } else {
      return isUser.value
    }
  }
  
  const switchRole = async (newRole) => {
    // This would be used if a user can switch between roles
    // For now, just logout and redirect to appropriate login
    logout()
    
    if (newRole === 'admin') {
      router.push('/admin/login')
    } else {
      router.push('/login')
    }
  }
  
  // Cleanup
  const cleanup = () => {
    window.removeEventListener('storage', updateAuthState)
  }
  
  return {
    // State
    isUserAuth,
    isAdminAuth,
    currentRole,
    isAuthenticated,
    isAdmin,
    isUser,
    authType,
    
    // Methods
    login,
    logout,
    redirectToHome,
    checkAccess,
    switchRole,
    updateAuthState,
    cleanup,
    
    // Stores
    userStore,
    adminStore
  }
}