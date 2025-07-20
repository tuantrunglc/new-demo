// Role-based directive for showing/hiding elements
import { getCurrentUserRole } from '../utils/authUtils'

export default {
  name: 'role',
  directive: {
    mounted(el, binding) {
      checkRole(el, binding)
    },
    updated(el, binding) {
      checkRole(el, binding)
    }
  }
}

function checkRole(el, binding) {
  const currentRole = getCurrentUserRole()
  const requiredRoles = Array.isArray(binding.value) ? binding.value : [binding.value]
  
  // Check if current user has required role
  const hasRole = requiredRoles.includes(currentRole)
  
  // Handle different modifiers
  if (binding.modifiers.hide) {
    // v-role.hide - hide element if user has role
    el.style.display = hasRole ? 'none' : ''
  } else if (binding.modifiers.disable) {
    // v-role.disable - disable element if user doesn't have role
    el.disabled = !hasRole
    if (!hasRole) {
      el.classList.add('disabled')
      el.style.opacity = '0.5'
      el.style.cursor = 'not-allowed'
    } else {
      el.classList.remove('disabled')
      el.style.opacity = ''
      el.style.cursor = ''
    }
  } else {
    // Default: show/hide element based on role
    el.style.display = hasRole ? '' : 'none'
  }
}

// Usage examples:
// v-role="'admin'" - show only for admin
// v-role="['admin', 'subadmin']" - show for admin or subadmin
// v-role.hide="'user'" - hide for regular users
// v-role.disable="'admin'" - disable for non-admin users