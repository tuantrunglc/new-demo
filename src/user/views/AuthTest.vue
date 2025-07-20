<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h4>Test Authentication</h4>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h5>Test Login</h5>
                <p>Sử dụng các tài khoản test sau:</p>
                <ul>
                  <li><strong>Email:</strong> test@example.com <br><strong>Password:</strong> 123456</li>
                  <li><strong>Email:</strong> nguyenvana@example.com <br><strong>Password:</strong> 123456</li>
                  <li><strong>Email:</strong> phamthid@example.com <br><strong>Password:</strong> 123456</li>
                </ul>
                <router-link to="/login" class="btn btn-primary">
                  <i class="fas fa-sign-in-alt me-2"></i>
                  Đi đến trang đăng nhập
                </router-link>
              </div>
              <div class="col-md-6">
                <h5>Test Register</h5>
                <p>Tạo tài khoản mới với thông tin của bạn</p>
                <router-link to="/register" class="btn btn-success">
                  <i class="fas fa-user-plus me-2"></i>
                  Đi đến trang đăng ký
                </router-link>
              </div>
            </div>
            
            <hr class="my-4">
            
            <div v-if="isAuthenticated" class="alert alert-success">
              <h5><i class="fas fa-check-circle me-2"></i>Đã đăng nhập thành công!</h5>
              <p><strong>Tên:</strong> {{ fullName }}</p>
              <p><strong>Email:</strong> {{ currentUser?.email }}</p>
              <p><strong>Role:</strong> {{ currentUser?.role }}</p>
              <button @click="handleLogout" class="btn btn-danger">
                <i class="fas fa-sign-out-alt me-2"></i>
                Đăng xuất
              </button>
            </div>
            
            <div v-else class="alert alert-info">
              <h5><i class="fas fa-info-circle me-2"></i>Chưa đăng nhập</h5>
              <p>Vui lòng đăng nhập để sử dụng đầy đủ tính năng</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../../stores/userStore'
import { mapState, mapActions } from 'pinia'
import { useToast } from 'vue-toastification'

export default {
  name: 'AuthTest',
  setup() {
    const toast = useToast()
    return { toast }
  },
  computed: {
    ...mapState(useUserStore, ['isAuthenticated', 'currentUser', 'fullName'])
  },
  methods: {
    ...mapActions(useUserStore, ['logout']),
    
    async handleLogout() {
      try {
        this.logout()
        this.toast.success('Đăng xuất thành công!')
      } catch (error) {
        console.error('Logout error:', error)
        this.toast.error('Có lỗi xảy ra khi đăng xuất!')
      }
    }
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 10px;
}

.card-header {
  background: linear-gradient(135deg, var(--primary-color, #ff6b35) 0%, #ff8c42 100%);
  color: white;
  border-radius: 10px 10px 0 0 !important;
}

.btn {
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 500;
}

.alert {
  border-radius: 8px;
  border: none;
}
</style>