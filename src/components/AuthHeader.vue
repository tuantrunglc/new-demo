<template>
  <div class="auth-header">
    <div class="container-fluid">
      <div class="row align-items-center">
        <div class="col-md-6">
          <div class="auth-info">
            <span class="role-badge" :class="roleBadgeClass">
              <i :class="roleIcon"></i>
              {{ roleText }}
            </span>
            <span class="user-name">{{ userName }}</span>
          </div>
        </div>
        <div class="col-md-6 text-end">
          <div class="auth-actions">
            <button 
              v-if="canSwitchRole" 
              @click="showSwitchRole" 
              class="btn btn-outline-secondary btn-sm me-2"
              title="Chuyển đổi vai trò"
            >
              <i class="fas fa-exchange-alt"></i>
              Chuyển đổi
            </button>
            <button 
              @click="handleLogout" 
              class="btn btn-outline-danger btn-sm"
              title="Đăng xuất"
            >
              <i class="fas fa-sign-out-alt"></i>
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Switch Role Modal -->
    <div 
      v-if="showSwitchModal" 
      class="modal fade show d-block" 
      tabindex="-1" 
      style="background-color: rgba(0,0,0,0.5)"
    >
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Chuyển đổi vai trò</h5>
            <button 
              type="button" 
              class="btn-close" 
              @click="showSwitchModal = false"
            ></button>
          </div>
          <div class="modal-body">
            <p>Bạn muốn chuyển sang vai trò nào?</p>
            <div class="d-grid gap-2">
              <button 
                v-if="!isAdmin" 
                @click="switchToAdmin" 
                class="btn btn-primary"
              >
                <i class="fas fa-user-shield"></i>
                Quản trị viên
              </button>
              <button 
                v-if="!isUser" 
                @click="switchToUser" 
                class="btn btn-success"
              >
                <i class="fas fa-user"></i>
                Người dùng
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="showSwitchModal = false"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuth } from '../composables/useAuth'
import { computed, ref } from 'vue'
import Swal from 'sweetalert2'

export default {
  name: 'AuthHeader',
  setup() {
    const { 
      isAdmin, 
      isUser, 
      currentRole, 
      authType, 
      logout, 
      switchRole,
      userStore,
      adminStore 
    } = useAuth()
    
    const showSwitchModal = ref(false)
    
    const userName = computed(() => {
      if (isAdmin.value && adminStore.adminUser) {
        return adminStore.adminUser.name || adminStore.adminUser.username || 'Admin'
      }
      if (isUser.value && userStore.currentUser) {
        return userStore.fullName || userStore.currentUser.name || 'User'
      }
      return 'Unknown'
    })
    
    const roleText = computed(() => {
      switch (currentRole.value) {
        case 'admin':
          return 'Quản trị viên'
        case 'sub_admin':
          return 'Phó quản trị'
        case 'user':
        case 'customer':
          return 'Người dùng'
        default:
          return 'Không xác định'
      }
    })
    
    const roleBadgeClass = computed(() => {
      switch (currentRole.value) {
        case 'admin':
          return 'badge-admin'
        case 'sub_admin':
          return 'badge-subadmin'
        case 'user':
        case 'customer':
          return 'badge-user'
        default:
          return 'badge-unknown'
      }
    })
    
    const roleIcon = computed(() => {
      switch (currentRole.value) {
        case 'admin':
          return 'fas fa-crown'
        case 'sub_admin':
          return 'fas fa-user-shield'
        case 'user':
        case 'customer':
          return 'fas fa-user'
        default:
          return 'fas fa-question'
      }
    })
    
    const canSwitchRole = computed(() => {
      // Enable role switching if needed
      // For now, disable it for security
      return false
    })
    
    const handleLogout = async () => {
      const result = await Swal.fire({
        title: 'Xác nhận đăng xuất',
        text: 'Bạn có chắc chắn muốn đăng xuất?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Đăng xuất',
        cancelButtonText: 'Hủy'
      })
      
      if (result.isConfirmed) {
        logout(authType.value)
        
        Swal.fire({
          title: 'Đã đăng xuất',
          text: 'Bạn đã đăng xuất thành công',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        })
      }
    }
    
    const showSwitchRole = () => {
      showSwitchModal.value = true
    }
    
    const switchToAdmin = () => {
      showSwitchModal.value = false
      switchRole('admin')
    }
    
    const switchToUser = () => {
      showSwitchModal.value = false
      switchRole('user')
    }
    
    return {
      isAdmin,
      isUser,
      currentRole,
      authType,
      userName,
      roleText,
      roleBadgeClass,
      roleIcon,
      canSwitchRole,
      showSwitchModal,
      handleLogout,
      showSwitchRole,
      switchToAdmin,
      switchToUser
    }
  }
}
</script>

<style scoped>
.auth-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 10px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.auth-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.role-badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.badge-admin {
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  color: white;
}

.badge-subadmin {
  background: linear-gradient(45deg, #feca57, #ff9ff3);
  color: white;
}

.badge-user {
  background: linear-gradient(45deg, #48dbfb, #0abde3);
  color: white;
}

.badge-unknown {
  background: #6c757d;
  color: white;
}

.user-name {
  font-weight: 500;
  font-size: 1.1rem;
}

.auth-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.btn {
  border-radius: 20px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.btn-outline-secondary {
  border-color: rgba(255, 255, 255, 0.5);
  color: white;
}

.btn-outline-secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: white;
  color: white;
}

.btn-outline-danger {
  border-color: rgba(220, 53, 69, 0.8);
  color: #dc3545;
  background-color: rgba(255, 255, 255, 0.9);
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  border-color: #dc3545;
  color: white;
}

.modal-content {
  border-radius: 15px;
  border: none;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  border-bottom: 1px solid #dee2e6;
  border-radius: 15px 15px 0 0;
}

.modal-footer {
  border-top: 1px solid #dee2e6;
  border-radius: 0 0 15px 15px;
}

@media (max-width: 768px) {
  .auth-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .auth-actions {
    justify-content: flex-start;
    margin-top: 10px;
  }
  
  .role-badge {
    font-size: 0.8rem;
    padding: 4px 10px;
  }
  
  .user-name {
    font-size: 1rem;
  }
}
</style>