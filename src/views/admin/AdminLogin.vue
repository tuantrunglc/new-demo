<template>
  <div class="admin-login">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow mt-5">
            <div class="card-body p-5">
              <h2 class="text-center mb-4">Admin Login</h2>
              
              <div v-if="error" class="alert alert-danger">
                {{ error }}
              </div>
              
              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label for="username" class="form-label">Tên đăng nhập</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="username" 
                    v-model="username" 
                    required
                  >
                </div>
                
                <div class="mb-4">
                  <label for="password" class="form-label">Mật khẩu</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="password" 
                    v-model="password" 
                    required
                  >
                </div>
                
                <button 
                  type="submit" 
                  class="btn btn-primary w-100" 
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Đăng nhập
                </button>
              </form>
              
              <div class="mt-4 text-center">
                <router-link to="/" class="text-decoration-none">
                  <i class="fas fa-arrow-left me-1"></i> Quay lại trang chủ
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '../../stores/adminStore'

export default {
  name: 'AdminLogin',
  setup() {
    const router = useRouter()
    const adminStore = useAdminStore()
    
    const username = ref('')
    const password = ref('')
    
    const loading = computed(() => adminStore.loading)
    const error = computed(() => adminStore.error)
    
    const handleLogin = async () => {
      const success = await adminStore.login(username.value, password.value)
      if (success) {
        router.push('/admin')
      }
    }
    
    return {
      username,
      password,
      handleLogin,
      loading,
      error
    }
  }
}
</script>

<style scoped>
.admin-login {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 40px 0;
}
</style>