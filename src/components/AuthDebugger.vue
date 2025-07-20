<template>
  <div v-if="isDevelopment" class="auth-debugger">
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">🔍 Auth Debugger</h5>
        <button @click="toggleDebugger" class="btn btn-sm btn-outline-secondary">
          {{ isExpanded ? 'Hide' : 'Show' }}
        </button>
      </div>
      
      <div v-if="isExpanded" class="card-body">
        <!-- Current State -->
        <div class="mb-3">
          <h6>Current Authentication State</h6>
          <div class="row">
            <div class="col-md-6">
              <small class="text-muted">Role:</small>
              <span class="badge" :class="getRoleBadgeClass(authState.activeRole)">
                {{ authState.activeRole || 'None' }}
              </span>
            </div>
            <div class="col-md-6">
              <small class="text-muted">Auth Type:</small>
              <span class="badge badge-info">
                {{ getAuthType() }}
              </span>
            </div>
          </div>
        </div>

        <!-- Validation Results -->
        <div class="mb-3">
          <h6>Validation</h6>
          <div v-if="validation.errors.length > 0" class="alert alert-danger py-2">
            <strong>Errors:</strong>
            <ul class="mb-0 mt-1">
              <li v-for="error in validation.errors" :key="error">{{ error }}</li>
            </ul>
          </div>
          <div v-if="validation.warnings.length > 0" class="alert alert-warning py-2">
            <strong>Warnings:</strong>
            <ul class="mb-0 mt-1">
              <li v-for="warning in validation.warnings" :key="warning">{{ warning }}</li>
            </ul>
          </div>
          <div v-if="validation.isValid && validation.warnings.length === 0" class="alert alert-success py-2">
            ✅ Authentication state is valid
          </div>
        </div>

        <!-- Permissions -->
        <div class="mb-3">
          <h6>Current Permissions</h6>
          <div class="row">
            <div class="col-md-6">
              <div class="permission-list">
                <div v-for="(value, key) in authState.permissions" :key="key" class="permission-item">
                  <span class="permission-name">{{ formatPermissionName(key) }}:</span>
                  <span class="badge" :class="value ? 'badge-success' : 'badge-secondary'">
                    {{ value ? 'Yes' : 'No' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="mb-3">
          <h6>Debug Actions</h6>
          <div class="btn-group btn-group-sm" role="group">
            <button @click="runValidation" class="btn btn-outline-primary">
              Validate
            </button>
            <button @click="generateReport" class="btn btn-outline-info">
              Generate Report
            </button>
            <button @click="cleanupAuth" class="btn btn-outline-warning">
              Cleanup Auth
            </button>
          </div>
        </div>

        <!-- Role Testing -->
        <div class="mb-3">
          <h6>Test Roles</h6>
          <div class="btn-group btn-group-sm" role="group">
            <button 
              v-for="role in testRoles" 
              :key="role"
              @click="testRole(role)" 
              class="btn btn-outline-secondary"
            >
              Test {{ role }}
            </button>
          </div>
        </div>

        <!-- Raw Data -->
        <div class="mb-3">
          <h6>Raw Authentication Data</h6>
          <div class="accordion" id="rawDataAccordion">
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button 
                  class="accordion-button collapsed" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target="#rawDataCollapse"
                >
                  Show Raw Data
                </button>
              </h2>
              <div id="rawDataCollapse" class="accordion-collapse collapse">
                <div class="accordion-body">
                  <pre class="raw-data">{{ JSON.stringify(rawData, null, 2) }}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { 
  validateAuthState, 
  generateAuthReport, 
  testRolePermissions,
  cleanupAuthState,
  debugAuth
} from '../utils/authValidator'
import { getAuthContext } from '../utils/authUtils'

export default {
  name: 'AuthDebugger',
  setup() {
    const isExpanded = ref(false)
    const validation = ref({ isValid: true, errors: [], warnings: [] })
    const authState = ref({})
    const rawData = ref({})
    
    const isDevelopment = computed(() => process.env.NODE_ENV === 'development')
    const testRoles = ['user', 'admin', 'subadmin']
    
    const toggleDebugger = () => {
      isExpanded.value = !isExpanded.value
      if (isExpanded.value) {
        runValidation()
      }
    }
    
    const runValidation = () => {
      const result = validateAuthState()
      validation.value = result
      authState.value = result.authState || {}
      updateRawData()
    }
    
    const updateRawData = () => {
      rawData.value = {
        localStorage: {
          userToken: localStorage.getItem('userToken'),
          adminToken: localStorage.getItem('adminToken'),
          currentUser: localStorage.getItem('currentUser'),
          adminUser: localStorage.getItem('adminUser')
        },
        authState: authState.value,
        validation: validation.value
      }
    }
    
    const getRoleBadgeClass = (role) => {
      switch (role) {
        case 'admin': return 'badge-danger'
        case 'subadmin': return 'badge-warning'
        case 'user': return 'badge-primary'
        default: return 'badge-secondary'
      }
    }
    
    const getAuthType = () => {
      if (authState.value.isAdminAuthenticated) return 'Admin'
      if (authState.value.isUserAuthenticated) return 'User'
      return 'None'
    }
    
    const formatPermissionName = (key) => {
      return key.replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .replace(/can /i, '')
    }
    
    const generateReport = () => {
      const report = generateAuthReport()
      console.log('📊 Authentication Report:', report)
      alert('Report generated! Check console for details.')
    }
    
    const testRole = (role) => {
      const result = testRolePermissions(role)
      console.log(`🧪 Testing role: ${role}`, result)
      alert(`Role test completed! Check console for details.`)
    }
    
    const cleanupAuth = () => {
      if (confirm('Are you sure you want to cleanup all authentication data?')) {
        cleanupAuthState()
        runValidation()
        alert('Authentication data cleaned up!')
      }
    }
    
    onMounted(() => {
      if (isDevelopment.value) {
        runValidation()
      }
    })
    
    return {
      isDevelopment,
      isExpanded,
      validation,
      authState,
      rawData,
      testRoles,
      toggleDebugger,
      runValidation,
      getRoleBadgeClass,
      getAuthType,
      formatPermissionName,
      generateReport,
      testRole,
      cleanupAuth
    }
  }
}
</script>

<style scoped>
.auth-debugger {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 400px;
  z-index: 9999;
  font-size: 12px;
}

.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #dee2e6;
}

.permission-list {
  max-height: 200px;
  overflow-y: auto;
}

.permission-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 0;
  border-bottom: 1px solid #f8f9fa;
}

.permission-name {
  font-size: 11px;
  color: #6c757d;
}

.raw-data {
  font-size: 10px;
  max-height: 300px;
  overflow: auto;
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
}

.badge {
  font-size: 10px;
}

.btn-sm {
  font-size: 11px;
  padding: 2px 8px;
}

.alert {
  font-size: 11px;
}

.badge-success {
  background-color: #28a745;
}

.badge-secondary {
  background-color: #6c757d;
}

.badge-danger {
  background-color: #dc3545;
}

.badge-warning {
  background-color: #ffc107;
  color: #212529;
}

.badge-primary {
  background-color: #007bff;
}

.badge-info {
  background-color: #17a2b8;
}
</style>