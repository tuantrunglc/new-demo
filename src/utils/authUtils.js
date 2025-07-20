// Authentication utility functions

/**
 * Check if user is authenticated
 */
export const isUserAuthenticated = () => {
  return !!localStorage.getItem('userToken')
}

/**
 * Check if admin is authenticated
 */
export const isAdminAuthenticated = () => {
  return !!localStorage.getItem('adminToken')
}

/**
 * Get current user role
 */
export const getCurrentUserRole = () => {
  const userToken = localStorage.getItem('userToken')
  const adminToken = localStorage.getItem('adminToken')
  
  if (adminToken) {
    const adminUserStr = localStorage.getItem('adminUser')
    if (adminUserStr) {
      try {
        const adminUser = JSON.parse(adminUserStr)
        return adminUser.role || null
      } catch (e) {
        console.error('Error parsing adminUser:', e)
        return null
      }
    }
    return null
  }
  
  if (userToken) {
    const currentUserStr = localStorage.getItem('currentUser')
    if (currentUserStr) {
      try {
        const currentUser = JSON.parse(currentUserStr)
        return currentUser.role || null
      } catch (e) {
        console.error('Error parsing currentUser:', e)
        return null
      }
    }
    return null
  }
  
  return null
}

/**
 * Check if current user is admin
 */
export const isCurrentUserAdmin = () => {
  const role = getCurrentUserRole()
  // Use correct role names from backend: admin, subadmin, user
  return ['admin', 'subadmin'].includes(role)
}

/**
 * Check if current user is regular user
 */
export const isCurrentUserRegular = () => {
  const role = getCurrentUserRole()
  // Use correct role names from backend: user (customer is not a separate role)
  return role === 'user'
}

/**
 * Check if route is admin route
 */
export const isAdminRoute = (path) => {
  return path.startsWith('/admin')
}

/**
 * Check if route is user route
 */
export const isUserRoute = (path) => {
  return !path.startsWith('/admin')
}

/**
 * Get appropriate login route based on route type
 */
export const getLoginRoute = (routePath) => {
  if (isAdminRoute(routePath)) {
    return '/admin/login'
  }
  return '/login'
}

/**
 * Get appropriate home route based on user role
 */
export const getHomeRoute = (userRole = null) => {
  const role = userRole || getCurrentUserRole()
  
  if (['admin', 'subadmin'].includes(role)) {
    return '/admin/dashboard'
  }
  
  return '/home'
}

/**
 * Check if current user is subadmin specifically
 */
export const isCurrentUserSubAdmin = () => {
  const role = getCurrentUserRole()
  return role === 'subadmin'
}

/**
 * Check if current user is super admin (admin only, not subadmin)
 */
export const isCurrentUserSuperAdmin = () => {
  const role = getCurrentUserRole()
  return role === 'admin'
}

/**
 * Get user permissions based on role
 */
export const getUserPermissions = () => {
  const role = getCurrentUserRole()
  
  const permissions = {
    canAccessAdmin: ['admin', 'subadmin'].includes(role),
    canAccessUser: role === 'user',
    canManageUsers: ['admin', 'subadmin'].includes(role),
    canManageProducts: ['admin', 'subadmin'].includes(role),
    canManageOrders: ['admin', 'subadmin'].includes(role),
    canManageDeposits: ['admin', 'subadmin'].includes(role),
    canManageCommissions: ['admin', 'subadmin'].includes(role),
    canManageSpins: role === 'admin', // Only super admin
    canManageWallets: role === 'admin', // Only super admin
    canManageSettings: role === 'admin', // Only super admin
    canManageBanks: role === 'admin', // Only super admin
    canViewReports: ['admin', 'subadmin'].includes(role),
    canViewFinancialReports: role === 'admin' // Only super admin
  }
  
  return permissions
}

/**
 * Clear all authentication data
 */
export const clearAllAuth = () => {
  localStorage.removeItem('userToken')
  localStorage.removeItem('currentUser')
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminUser')
}

/**
 * Clear user authentication data only
 */
export const clearUserAuth = () => {
  localStorage.removeItem('userToken')
  localStorage.removeItem('currentUser')
}

/**
 * Clear admin authentication data only
 */
export const clearAdminAuth = () => {
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminUser')
}

/**
 * Check if user has permission to access route
 */
export const hasRoutePermission = (routePath, userRole = null) => {
  const role = userRole || getCurrentUserRole()
  
  if (isAdminRoute(routePath)) {
    return ['admin', 'subadmin'].includes(role)
  } else {
    return role === 'user'
  }
}

/**
 * Validate authentication tokens
 */
export const validateAuthTokens = () => {
  const userToken = localStorage.getItem('userToken')
  const adminToken = localStorage.getItem('adminToken')
  const currentUser = localStorage.getItem('currentUser')
  const adminUser = localStorage.getItem('adminUser')
  
  // Check if tokens exist but user data is missing
  if (userToken && !currentUser) {
    clearUserAuth()
    return false
  }
  
  if (adminToken && !adminUser) {
    clearAdminAuth()
    return false
  }
  
  return true
}

/**
 * Get current authentication context
 */
export const getAuthContext = () => {
  validateAuthTokens()
  
  const userToken = localStorage.getItem('userToken')
  const adminToken = localStorage.getItem('adminToken')
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || 'null')
  
  return {
    isUserAuthenticated: !!userToken,
    isAdminAuthenticated: !!adminToken,
    currentUser,
    adminUser,
    activeRole: getCurrentUserRole(),
    permissions: getUserPermissions()
  }
}

/**
 * Get redirect route for unauthorized access
 */
export const getUnauthorizedRedirect = (attemptedRoute) => {
  if (isAdminRoute(attemptedRoute)) {
    return '/admin/access-denied'
  } else {
    return '/access-denied'
  }
}