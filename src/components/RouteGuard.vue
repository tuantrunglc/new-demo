<template>
  <div v-if="hasAccess">
    <slot />
  </div>
  <div v-else>
    <AccessDenied :userType="currentUserType" />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import AccessDenied from './AccessDenied.vue'

export default {
  name: 'RouteGuard',
  components: {
    AccessDenied
  },
  props: {
    requiredRole: {
      type: [String, Array],
      default: null
    },
    allowedRoles: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const route = useRoute()
    const { currentRole, isAdmin, isUser, checkAccess } = useAuth()
    
    const currentUserType = computed(() => {
      if (isAdmin.value) return 'admin'
      if (isUser.value) return 'user'
      return 'guest'
    })
    
    const hasAccess = computed(() => {
      // If no role requirements specified, allow access
      if (!props.requiredRole && props.allowedRoles.length === 0) {
        return true
      }
      
      // Check specific required role
      if (props.requiredRole) {
        if (Array.isArray(props.requiredRole)) {
          return props.requiredRole.includes(currentRole.value)
        }
        return currentRole.value === props.requiredRole
      }
      
      // Check allowed roles
      if (props.allowedRoles.length > 0) {
        return props.allowedRoles.includes(currentRole.value)
      }
      
      // Default: check route-based access
      return checkAccess(route.path)
    })
    
    return {
      hasAccess,
      currentUserType
    }
  }
}
</script>