/**
 * Authentication Validator
 * Utility to validate and test authentication logic
 */

import {
  isUserAuthenticated,
  isAdminAuthenticated,
  getCurrentUserRole,
  isCurrentUserAdmin,
  isCurrentUserRegular,
  isCurrentUserSubAdmin,
  isCurrentUserSuperAdmin,
  getUserPermissions,
  getAuthContext,
  validateAuthTokens
} from './authUtils'

/**
 * Validate authentication state consistency
 */
export const validateAuthState = () => {
  const errors = []
  const warnings = []
  
  try {
    // Check token consistency
    const userToken = localStorage.getItem('userToken')
    const adminToken = localStorage.getItem('adminToken')
    const currentUser = localStorage.getItem('currentUser')
    const adminUser = localStorage.getItem('adminUser')
    
    // Token vs User data consistency
    if (userToken && !currentUser) {
      errors.push('User token exists but user data is missing')
    }
    
    if (adminToken && !adminUser) {
      errors.push('Admin token exists but admin user data is missing')
    }
    
    if (!userToken && currentUser) {
      warnings.push('User data exists but token is missing')
    }
    
    if (!adminToken && adminUser) {
      warnings.push('Admin data exists but token is missing')
    }
    
    // Role consistency checks
    const currentRole = getCurrentUserRole()
    if (currentRole) {
      const validRoles = ['user', 'admin', 'subadmin']
      if (!validRoles.includes(currentRole)) {
        errors.push(`Invalid role detected: ${currentRole}`)
      }
      
      // Check role vs authentication state consistency
      if (currentRole === 'user' && !isUserAuthenticated()) {
        errors.push('User role detected but not authenticated as user')
      }
      
      if (['admin', 'subadmin'].includes(currentRole) && !isAdminAuthenticated()) {
        errors.push('Admin/Subadmin role detected but not authenticated as admin')
      }
    }
    
    // Dual authentication check
    if (isUserAuthenticated() && isAdminAuthenticated()) {
      warnings.push('Both user and admin tokens exist - this may cause conflicts')
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      authState: getAuthContext()
    }
  } catch (error) {
    return {
      isValid: false,
      errors: [`Validation error: ${error.message}`],
      warnings: [],
      authState: null
    }
  }
}

/**
 * Test role-based permissions
 */
export const testRolePermissions = (testRole) => {
  // Temporarily set role for testing
  const originalUser = localStorage.getItem('currentUser')
  const originalAdminUser = localStorage.getItem('adminUser')
  
  try {
    // Mock user data for testing
    if (testRole === 'user') {
      localStorage.setItem('userToken', 'test-token')
      localStorage.setItem('currentUser', JSON.stringify({ role: 'user', name: 'Test User' }))
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminUser')
    } else if (['admin', 'subadmin'].includes(testRole)) {
      localStorage.setItem('adminToken', 'test-admin-token')
      localStorage.setItem('adminUser', JSON.stringify({ role: testRole, name: `Test ${testRole}` }))
      localStorage.removeItem('userToken')
      localStorage.removeItem('currentUser')
    }
    
    const permissions = getUserPermissions()
    const authContext = getAuthContext()
    
    return {
      role: testRole,
      permissions,
      authContext,
      checks: {
        isAdmin: isCurrentUserAdmin(),
        isUser: isCurrentUserRegular(),
        isSubAdmin: isCurrentUserSubAdmin(),
        isSuperAdmin: isCurrentUserSuperAdmin()
      }
    }
  } finally {
    // Restore original state
    if (originalUser) {
      localStorage.setItem('currentUser', originalUser)
    } else {
      localStorage.removeItem('currentUser')
    }
    
    if (originalAdminUser) {
      localStorage.setItem('adminUser', originalAdminUser)
    } else {
      localStorage.removeItem('adminUser')
    }
  }
}

/**
 * Generate authentication report
 */
export const generateAuthReport = () => {
  const validation = validateAuthState()
  const currentRole = getCurrentUserRole()
  
  const report = {
    timestamp: new Date().toISOString(),
    validation,
    currentState: {
      role: currentRole,
      isUserAuth: isUserAuthenticated(),
      isAdminAuth: isAdminAuthenticated(),
      permissions: getUserPermissions()
    },
    roleTests: {}
  }
  
  // Test all roles
  const testRoles = ['user', 'admin', 'subadmin']
  testRoles.forEach(role => {
    report.roleTests[role] = testRolePermissions(role)
  })
  
  return report
}

/**
 * Debug authentication issues
 */
export const debugAuth = () => {
  console.group('🔍 Authentication Debug Report')
  
  const report = generateAuthReport()
  
  console.log('📊 Current State:', report.currentState)
  console.log('✅ Validation:', report.validation)
  
  if (report.validation.errors.length > 0) {
    console.error('❌ Errors:', report.validation.errors)
  }
  
  if (report.validation.warnings.length > 0) {
    console.warn('⚠️ Warnings:', report.validation.warnings)
  }
  
  console.log('🧪 Role Tests:', report.roleTests)
  
  console.groupEnd()
  
  return report
}

/**
 * Clean up authentication state
 */
export const cleanupAuthState = () => {
  localStorage.removeItem('userToken')
  localStorage.removeItem('currentUser')
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminUser')
  
  console.log('🧹 Authentication state cleaned up')
}

// Export for global access in development
if (process.env.NODE_ENV === 'development') {
  window.authValidator = {
    validate: validateAuthState,
    test: testRolePermissions,
    report: generateAuthReport,
    debug: debugAuth,
    cleanup: cleanupAuthState
  }
}