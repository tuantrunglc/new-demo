<template>
  <div v-if="showDebug" class="auth-debug-simple">
    <div class="debug-panel">
      <h6>🔍 Auth Debug</h6>
      <div class="debug-info">
        <div><strong>Current Role:</strong> {{ currentRole || 'None' }}</div>
        <div><strong>User Token:</strong> {{ userToken ? 'Yes' : 'No' }}</div>
        <div><strong>Admin Token:</strong> {{ adminToken ? 'Yes' : 'No' }}</div>
        <div><strong>Is Admin:</strong> {{ isAdmin ? 'Yes' : 'No' }}</div>
        <div><strong>Is User Auth:</strong> {{ isUserAuth ? 'Yes' : 'No' }}</div>
        <div><strong>Is Admin Auth:</strong> {{ isAdminAuth ? 'Yes' : 'No' }}</div>
        <div><strong>Current Path:</strong> {{ $route.path }}</div>
        <div><strong>Is Admin Route:</strong> {{ isAdminRoutePath ? 'Yes' : 'No' }}</div>
      </div>
      <div class="debug-actions">
        <button @click="refreshData" class="btn btn-sm btn-primary">Refresh</button>
        <button @click="clearAuth" class="btn btn-sm btn-warning">Clear Auth</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  getCurrentUserRole,
  isCurrentUserAdmin,
  isUserAuthenticated,
  isAdminAuthenticated,
  isAdminRoute
} from '../utils/authUtils'

export default {
  name: 'AuthDebugSimple',
  setup() {
    const route = useRoute()
    const showDebug = ref(process.env.NODE_ENV === 'development')
    
    const currentRole = ref(null)
    const userToken = ref(false)
    const adminToken = ref(false)
    const isAdmin = ref(false)
    const isUserAuth = ref(false)
    const isAdminAuth = ref(false)
    
    const isAdminRoutePath = computed(() => {
      return isAdminRoute(route.path)
    })
    
    const refreshData = () => {
      currentRole.value = getCurrentUserRole()
      userToken.value = !!localStorage.getItem('userToken')
      adminToken.value = !!localStorage.getItem('adminToken')
      isAdmin.value = isCurrentUserAdmin()
      isUserAuth.value = isUserAuthenticated()
      isAdminAuth.value = isAdminAuthenticated()
      
      console.log('🔍 Auth Debug Data:', {
        currentRole: currentRole.value,
        userToken: userToken.value,
        adminToken: adminToken.value,
        isAdmin: isAdmin.value,
        isUserAuth: isUserAuth.value,
        isAdminAuth: isAdminAuth.value,
        currentPath: route.path,
        isAdminRoute: isAdminRoutePath.value,
        localStorage: {
          userToken: localStorage.getItem('userToken'),
          adminToken: localStorage.getItem('adminToken'),
          currentUser: localStorage.getItem('currentUser'),
          adminUser: localStorage.getItem('adminUser')
        }
      })
    }
    
    const clearAuth = () => {
      if (confirm('Clear all authentication data?')) {
        localStorage.removeItem('userToken')
        localStorage.removeItem('adminToken')
        localStorage.removeItem('currentUser')
        localStorage.removeItem('adminUser')
        refreshData()
      }
    }
    
    onMounted(() => {
      refreshData()
    })
    
    return {
      showDebug,
      currentRole,
      userToken,
      adminToken,
      isAdmin,
      isUserAuth,
      isAdminAuth,
      isAdminRoutePath,
      refreshData,
      clearAuth
    }
  }
}
</script>

<style scoped>
.auth-debug-simple {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 9999;
}

.debug-panel {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  min-width: 300px;
  font-size: 12px;
}

.debug-info {
  margin: 10px 0;
}

.debug-info div {
  margin: 5px 0;
  padding: 2px 0;
  border-bottom: 1px solid #f0f0f0;
}

.debug-actions {
  margin-top: 10px;
  display: flex;
  gap: 5px;
}

.btn {
  padding: 4px 8px;
  font-size: 11px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}
</style>