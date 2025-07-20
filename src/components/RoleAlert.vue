<template>
  <div v-if="showAlert" class="role-alert" :class="alertClass">
    <div class="alert-content">
      <div class="alert-icon">
        <i :class="alertIcon"></i>
      </div>
      <div class="alert-message">
        <h5 class="alert-title">{{ alertTitle }}</h5>
        <p class="alert-text">{{ alertMessage }}</p>
      </div>
      <button @click="closeAlert" class="alert-close">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="alert-actions" v-if="showActions">
      <button @click="goToCorrectInterface" class="btn btn-primary btn-sm">
        <i class="fas fa-arrow-right"></i>
        {{ actionButtonText }}
      </button>
      <button @click="logout" class="btn btn-outline-secondary btn-sm">
        <i class="fas fa-sign-out-alt"></i>
        Đăng xuất
      </button>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

export default {
  name: 'RoleAlert',
  props: {
    type: {
      type: String,
      default: 'warning', // warning, error, info
      validator: (value) => ['warning', 'error', 'info'].includes(value)
    },
    userType: {
      type: String,
      default: 'user' // user, admin
    },
    autoHide: {
      type: Boolean,
      default: false
    },
    hideDelay: {
      type: Number,
      default: 5000
    },
    showActions: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const router = useRouter()
    const { logout: authLogout, isAdmin } = useAuth()
    const showAlert = ref(true)
    
    const alertClass = computed(() => {
      return `alert-${props.type}`
    })
    
    const alertIcon = computed(() => {
      switch (props.type) {
        case 'error':
          return 'fas fa-exclamation-triangle'
        case 'info':
          return 'fas fa-info-circle'
        default:
          return 'fas fa-shield-alt'
      }
    })
    
    const alertTitle = computed(() => {
      if (props.userType === 'admin') {
        return 'Truy cập bị hạn chế'
      } else {
        return 'Không có quyền truy cập'
      }
    })
    
    const alertMessage = computed(() => {
      if (props.userType === 'admin') {
        return 'Bạn đang đăng nhập với quyền quản trị viên. Vui lòng sử dụng giao diện quản trị hoặc đăng xuất để truy cập giao diện người dùng.'
      } else {
        return 'Bạn không có quyền truy cập vào khu vực quản trị. Vui lòng đăng nhập với tài khoản quản trị viên.'
      }
    })
    
    const actionButtonText = computed(() => {
      if (props.userType === 'admin') {
        return 'Đi tới giao diện quản trị'
      } else {
        return 'Đăng nhập Admin'
      }
    })
    
    const closeAlert = () => {
      showAlert.value = false
    }
    
    const goToCorrectInterface = () => {
      if (props.userType === 'admin') {
        router.push({ name: 'dashboard' })
      } else {
        router.push('/admin/login')
      }
    }
    
    const logout = () => {
      authLogout()
    }
    
    // Auto hide alert
    if (props.autoHide) {
      setTimeout(() => {
        showAlert.value = false
      }, props.hideDelay)
    }
    
    return {
      showAlert,
      alertClass,
      alertIcon,
      alertTitle,
      alertMessage,
      actionButtonText,
      closeAlert,
      goToCorrectInterface,
      logout
    }
  }
}
</script>

<style scoped>
.role-alert {
  position: fixed;
  top: 20px;
  right: 20px;
  max-width: 400px;
  z-index: 9999;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.alert-warning {
  background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
  border-left: 5px solid #e17055;
  color: #2d3436;
}

.alert-error {
  background: linear-gradient(135deg, #ff7675 0%, #d63031 100%);
  border-left: 5px solid #a4161a;
  color: white;
}

.alert-info {
  background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
  border-left: 5px solid #2d3436;
  color: white;
}

.alert-content {
  display: flex;
  align-items: flex-start;
  padding: 15px;
  position: relative;
}

.alert-icon {
  margin-right: 12px;
  font-size: 1.5rem;
  margin-top: 2px;
}

.alert-message {
  flex: 1;
}

.alert-title {
  margin: 0 0 5px 0;
  font-weight: 600;
  font-size: 1.1rem;
}

.alert-text {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
  opacity: 0.9;
}

.alert-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  margin-left: 10px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.alert-close:hover {
  opacity: 1;
}

.alert-actions {
  padding: 0 15px 15px 15px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.btn-primary {
  background-color: #0984e3;
  color: white;
}

.btn-primary:hover {
  background-color: #74b9ff;
  transform: translateY(-1px);
}

.btn-outline-secondary {
  background-color: transparent;
  color: #2d3436;
  border: 1px solid #2d3436;
}

.alert-error .btn-outline-secondary {
  color: white;
  border-color: white;
}

.btn-outline-secondary:hover {
  background-color: rgba(45, 52, 54, 0.1);
  transform: translateY(-1px);
}

.alert-error .btn-outline-secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .role-alert {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
  
  .alert-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>