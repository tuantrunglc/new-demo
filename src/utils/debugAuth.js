/**
 * Debug Authentication Issues
 * Run this in browser console to debug auth problems
 */

export const debugAuthIssues = () => {
  console.group('🔍 Authentication Debug Report')
  
  // Get raw localStorage data
  const userToken = localStorage.getItem('userToken')
  const adminToken = localStorage.getItem('adminToken')
  const currentUserStr = localStorage.getItem('currentUser')
  const adminUserStr = localStorage.getItem('adminUser')
  
  console.log('📦 Raw localStorage data:')
  console.log('userToken:', userToken)
  console.log('adminToken:', adminToken)
  console.log('currentUser:', currentUserStr)
  console.log('adminUser:', adminUserStr)
  
  // Parse user data
  let currentUser = null
  let adminUser = null
  
  try {
    if (currentUserStr) {
      currentUser = JSON.parse(currentUserStr)
      console.log('👤 Parsed currentUser:', currentUser)
    }
  } catch (e) {
    console.error('❌ Error parsing currentUser:', e)
  }
  
  try {
    if (adminUserStr) {
      adminUser = JSON.parse(adminUserStr)
      console.log('👨‍💼 Parsed adminUser:', adminUser)
    }
  } catch (e) {
    console.error('❌ Error parsing adminUser:', e)
  }
  
  // Import and test auth functions
  import('./authUtils.js').then(authUtils => {
    console.log('🧪 Testing auth functions:')
    
    const getCurrentUserRole = authUtils.getCurrentUserRole()
    const isUserAuthenticated = authUtils.isUserAuthenticated()
    const isAdminAuthenticated = authUtils.isAdminAuthenticated()
    const isCurrentUserAdmin = authUtils.isCurrentUserAdmin()
    const isCurrentUserRegular = authUtils.isCurrentUserRegular()
    
    console.log('getCurrentUserRole():', getCurrentUserRole)
    console.log('isUserAuthenticated():', isUserAuthenticated)
    console.log('isAdminAuthenticated():', isAdminAuthenticated)
    console.log('isCurrentUserAdmin():', isCurrentUserAdmin)
    console.log('isCurrentUserRegular():', isCurrentUserRegular)
    
    // Test route checking
    const currentPath = window.location.pathname
    const isAdminRoute = authUtils.isAdminRoute(currentPath)
    
    console.log('🛣️ Route info:')
    console.log('Current path:', currentPath)
    console.log('Is admin route:', isAdminRoute)
    
    // Identify issues
    console.log('🔍 Issue Analysis:')
    
    if (adminToken && !adminUser) {
      console.error('❌ ISSUE: Admin token exists but adminUser data is missing')
    }
    
    if (userToken && !currentUser) {
      console.error('❌ ISSUE: User token exists but currentUser data is missing')
    }
    
    if (adminUser && !adminUser.role) {
      console.error('❌ ISSUE: Admin user exists but role is missing')
    }
    
    if (currentUser && !currentUser.role) {
      console.error('❌ ISSUE: Current user exists but role is missing')
    }
    
    if (adminToken && adminUser && !['admin', 'subadmin'].includes(adminUser.role)) {
      console.error('❌ ISSUE: Invalid admin role:', adminUser.role)
    }
    
    if (userToken && currentUser && currentUser.role !== 'user') {
      console.error('❌ ISSUE: Invalid user role:', currentUser.role)
    }
    
    // Recommendations
    console.log('💡 Recommendations:')
    
    if (adminToken && adminUser && ['admin', 'subadmin'].includes(adminUser.role)) {
      console.log('✅ Admin authentication looks good')
      if (isAdminRoute && !isCurrentUserAdmin) {
        console.error('❌ CRITICAL: Admin is authenticated but isCurrentUserAdmin() returns false')
        console.log('This suggests a bug in isCurrentUserAdmin() function')
      }
    }
    
    if (userToken && currentUser && currentUser.role === 'user') {
      console.log('✅ User authentication looks good')
    }
    
    console.groupEnd()
  }).catch(error => {
    console.error('Error importing authUtils:', error)
    console.groupEnd()
  })
}

// Auto-run in development
if (process.env.NODE_ENV === 'development') {
  window.debugAuth = debugAuthIssues
  console.log('🔧 Debug function available: window.debugAuth()')
}

export default debugAuthIssues