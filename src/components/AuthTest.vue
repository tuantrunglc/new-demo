<template>
  <div class="auth-test-container">
    <div class="card">
      <div class="card-header">
        <h5>🔍 Authentication Test</h5>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <h6>Current State</h6>
            <table class="table table-sm">
              <tr>
                <td>Current Role:</td>
                <td><span class="badge" :class="getRoleBadge(currentRole)">{{ currentRole || 'None' }}</span></td>
              </tr>
              <tr>
                <td>User Token:</td>
                <td><span class="badge" :class="userToken ? 'bg-success' : 'bg-secondary'">{{ userToken ? 'Yes' : 'No' }}</span></td>
              </tr>
              <tr>
                <td>Admin Token:</td>
                <td><span class="badge" :class="adminToken ? 'bg-success' : 'bg-secondary'">{{ adminToken ? 'Yes' : 'No' }}</span></td>
              </tr>
              <tr>
                <td>Is Admin:</td>
                <td><span class="badge" :class="isAdmin ? 'bg-success' : 'bg-secondary'">{{ isAdmin ? 'Yes' : 'No' }}</span></td>
              </tr>
              <tr>
                <td>Is User Auth:</td>
                <td><span class="badge" :class="isUserAuth ? 'bg-success' : 'bg-secondary'">{{ isUserAuth ? 'Yes' : 'No' }}</span></td>
              </tr>
              <tr>
                <td>Is Admin Auth:</td>
                <td><span class="badge" :class="isAdminAuth ? 'bg-success' : 'bg-secondary'">{{ isAdminAuth ? 'Yes' : 'No' }}</span></td>
              </tr>
            </table>
          </div>
          
          <div class="col-md-6">
            <h6>Route Info</h6>
            <table class="table table-sm">
              <tr>
                <td>Current Path:</td>
                <td><code>{{ $route.path }}</code></td>
              </tr>
              <tr>
                <td>Is Admin Route:</td>
                <td><span class="badge" :class="isAdminRoutePath ? 'bg-primary' : 'bg-secondary'">{{ isAdminRoutePath ? 'Yes' : 'No' }}</span></td>
              </tr>
              <tr>
                <td>Route Name:</td>
                <td><code>{{ $route.name }}</code></td>
              </tr>
            </table>
          </div>
        </div>
        
        <div class="row mt-3">
          <div class="col-12">
            <h6>Raw Data</h6>
            <div class="accordion" id="rawDataAccordion">
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#rawData">
                    Show Raw localStorage Data
                  </button>
                </h2>
                <div id="rawData" class="accordion-collapse collapse">
                  <div class="accordion-body">
                    <pre>{{ JSON.stringify(rawData, null, 2) }}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="row mt-3">
          <div class="col-12">
            <div class="btn-group" role="group">
              <button @click="refreshData" class="btn btn-primary btn-sm">Refresh Data</button>
              <button @click="runDebug" class="btn btn-info btn-sm">Run Debug</button>
              <button @click="clearAuth" class="btn btn-warning btn-sm">Clear Auth</button>
              <button @click="testNavigation" class="btn btn-secondary btn-sm">Test Navigation</button>
            </div>
          </div>
        </div>
        
        <div v-if="debugResults.length > 0" class="mt-3">
          <h6>Debug Results</h6>
          <div class="alert alert-info">
            <ul class="mb-0">
              <li v-for="result in debugResults" :key="result">{{ result }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  getCurrentUserRole,
  isCurrentUserAdmin,
  isUserAuthenticated,
  isAdminAuthenticated,
  isAdminRoute
} from '../utils/authUtils'

export default {
  name: 'AuthTest',
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    const currentRole = ref(null)
    const userToken = ref(false)
    const adminToken = ref(false)
    const isAdmin = ref(false)
    const isUserAuth = ref(false)
    const isAdminAuth = ref(false)
    const debugResults = ref([])
    
    const rawData = computed(() => ({
      userToken: localStorage.getItem('userToken'),
      adminToken: localStorage.getItem('adminToken'),
      currentUser: localStorage.getItem('currentUser'),
      adminUser: localStorage.getItem('adminUser')
    }))
    
    const isAdminRoutePath = computed(() => {
      return isAdminRoute(route.path)
    })
    
    const getRoleBadge = (role) => {
      switch (role) {
        case 'admin': return 'bg-danger'
        case 'subadmin': return 'bg-warning'
        case 'user': return 'bg-primary'
        default: return 'bg-secondary'
      }
    }
    
    const refreshData = () => {
      currentRole.value = getCurrentUserRole()
      userToken.value = !!localStorage.getItem('userToken')
      adminToken.value = !!localStorage.getItem('adminToken')
      isAdmin.value = isCurrentUserAdmin()
      isUserAuth.value = isUserAuthenticated()
      isAdminAuth.value = isAdminAuthenticated()
      
      console.log('🔄 Auth data refreshed:', {
        currentRole: currentRole.value,
        userToken: userToken.value,
        adminToken: adminToken.value,
        isAdmin: isAdmin.value,
        isUserAuth: isUserAuth.value,
        isAdminAuth: isAdminAuth.value
      })
    }
    
    const runDebug = () => {
      debugResults.value = []
      
      // Check for common issues
      if (adminToken.value && !rawData.value.adminUser) {
        debugResults.value.push('❌ Admin token exists but adminUser data is missing')
      }
      
      if (userToken.value && !rawData.value.currentUser) {
        debugResults.value.push('❌ User token exists but currentUser data is missing')
      }
      
      if (adminToken.value && rawData.value.adminUser) {
        try {
          const adminUser = JSON.parse(rawData.value.adminUser)
          if (!adminUser.role) {
            debugResults.value.push('❌ Admin user exists but role is missing')
          } else if (!['admin', 'subadmin'].includes(adminUser.role)) {
            debugResults.value.push(`❌ Invalid admin role: ${adminUser.role}`)
          } else {
            debugResults.value.push(`✅ Admin role is valid: ${adminUser.role}`)
          }
        } catch (e) {
          debugResults.value.push('❌ Error parsing adminUser data')
        }
      }
      
      if (isAdminRoutePath.value && !isAdmin.value) {
        debugResults.value.push('❌ On admin route but isCurrentUserAdmin() returns false')
      }
      
      if (isAdminRoutePath.value && isAdmin.value) {
        debugResults.value.push('✅ On admin route and user has admin privileges')
      }
      
      if (debugResults.value.length === 0) {
        debugResults.value.push('✅ No issues detected')
      }
    }
    
    const clearAuth = () => {
      if (confirm('Clear all authentication data?')) {
        localStorage.removeItem('userToken')
        localStorage.removeItem('adminToken')
        localStorage.removeItem('currentUser')
        localStorage.removeItem('adminUser')
        refreshData()
        debugResults.value = ['🧹 Authentication data cleared']
      }
    }
    
    const testNavigation = () => {
      console.log('🧪 Testing navigation...')
      console.log('Current route:', route.path)
      console.log('Is admin route:', isAdminRoutePath.value)
      console.log('Should allow access:', isAdmin.value && isAdminAuth.value)
      
      if (isAdminRoutePath.value) {
        debugResults.value.push(`🧪 Navigation test: Admin route access ${isAdmin.value && isAdminAuth.value ? 'ALLOWED' : 'DENIED'}`)
      } else {
        debugResults.value.push(`🧪 Navigation test: User route access ${isUserAuth.value ? 'ALLOWED' : 'DENIED'}`)
      }
    }
    
    onMounted(() => {
      refreshData()
      runDebug()
    })
    
    return {
      currentRole,
      userToken,
      adminToken,
      isAdmin,
      isUserAuth,
      isAdminAuth,
      isAdminRoutePath,
      rawData,
      debugResults,
      getRoleBadge,
      refreshData,
      runDebug,
      clearAuth,
      testNavigation
    }
  }
}
</script>

<style scoped>
.auth-test-container {
  margin: 20px 0;
}

.table td {
  padding: 0.25rem 0.5rem;
}

pre {
  font-size: 12px;
  max-height: 300px;
  overflow: auto;
}

.badge {
  font-size: 0.75em;
}
</style>