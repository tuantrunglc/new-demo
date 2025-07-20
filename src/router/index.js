import { createRouter, createWebHistory } from 'vue-router'
import adminRoutes from '../admin/router'
import userRoutes from '../user/router'
import { useToast } from 'vue-toastification'
import {
  isUserAuthenticated,
  isAdminAuthenticated,
  isCurrentUserAdmin,
  isAdminRoute,
  validateAuthTokens,
  getCurrentUserRole
} from '../utils/authUtils'

const routes = [
  ...userRoutes,
  ...adminRoutes
]

const router = createRouter({
  history: createWebHistory('/'),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const toast = useToast()
  
  // Validate authentication tokens before proceeding
  validateAuthTokens()
  
  const currentRole = getCurrentUserRole()
  const isAdmin = isCurrentUserAdmin()
  const isUserAuth = isUserAuthenticated()
  const isAdminAuth = isAdminAuthenticated()
  
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🛣️ Router Guard:', {
      to: to.path,
      currentRole,
      isAdmin,
      isUserAuth,
      isAdminAuth,
      isAdminRoute: isAdminRoute(to.path)
    })
  }
  
  // Skip access control for specific pages
  const skipPages = ['access-denied', 'admin-access-denied', 'adminLogin', 'user-login', 'landing']
  if (skipPages.includes(to.name)) {
    next()
    return
  }
  
  // Admin routes protection
  if (isAdminRoute(to.path)) {
    console.log('🔒 Checking admin route access...')
    
    if (!isAdminAuth) {
      console.log('❌ No admin token')
      toast.warning('Vui lòng đăng nhập với tài khoản quản trị viên')
      next('/admin/login')
      return
    }
    
    if (!isAdmin) {
      console.log('❌ Not admin role:', currentRole)
      toast.error('Bạn không có quyền truy cập vào khu vực quản trị')
      next({ name: 'access-denied' })
      return
    }
    
    console.log('✅ Admin access granted')
  } else {
    // User routes protection
    if (to.meta.requiresAuth && !isUserAuth) {
      toast.info('Vui lòng đăng nhập để tiếp tục')
      next({
        name: 'user-login',
        query: { redirect: to.fullPath }
      })
      return
    }
    
    // Prevent admin from accessing user routes (except public pages)
    if (isAdminAuth && isAdmin && to.meta.requiresAuth) {
      toast.warning('Bạn đang đăng nhập với quyền quản trị viên. Vui lòng sử dụng giao diện quản trị.')
      next({ name: 'admin-access-denied' })
      return
    }
  }
  
  // Guest pages (login/register)
  if (to.meta.requiresGuest) {
    if (isAdminRoute(to.path) && isAdminAuth) {
      toast.info('Bạn đã đăng nhập rồi')
      next({ name: 'dashboard' })
      return
    }
    
    if (!isAdminRoute(to.path) && isUserAuth) {
      toast.info('Bạn đã đăng nhập rồi')
      next({ name: 'home' })
      return
    }
  }
  
  next()
})

export default router