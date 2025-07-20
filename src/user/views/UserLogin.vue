<template>
  <div class="login-container">
    <div class="container-fluid h-100">
      <div class="row h-100">
        <!-- Left side - Login Form -->
        <div class="col-md-6 d-flex align-items-center justify-content-center">
          <div class="login-form-wrapper">
            <div class="text-center mb-4">
              <h2 class="login-title">Đăng nhập</h2>
              <p class="text-muted">Chào mừng bạn quay trở lại!</p>
            </div>

            <form @submit.prevent="handleLogin" class="login-form">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fas fa-envelope"></i>
                  </span>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="loginForm.email"
                    :class="{ 'is-invalid': errors.email }"
                    placeholder="Nhập email của bạn"
                    required
                  >
                </div>
                <div v-if="errors.email" class="invalid-feedback">
                  {{ errors.email }}
                </div>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Mật khẩu</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fas fa-lock"></i>
                  </span>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control"
                    id="password"
                    v-model="loginForm.password"
                    :class="{ 'is-invalid': errors.password }"
                    placeholder="Nhập mật khẩu"
                    required
                  >
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="togglePassword"
                  >
                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
                <div v-if="errors.password" class="invalid-feedback">
                  {{ errors.password }}
                </div>
              </div>

              <div class="mb-3 d-flex justify-content-between align-items-center">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="rememberMe"
                    v-model="loginForm.rememberMe"
                  >
                  <label class="form-check-label" for="rememberMe">
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <a href="#" class="text-decoration-none" @click.prevent="showForgotPassword">
                  Quên mật khẩu?
                </a>
              </div>

              <div v-if="error" class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ error }}
              </div>

              <button
                type="submit"
                class="btn btn-primary w-100 mb-3"
                :disabled="loading"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="fas fa-sign-in-alt me-2"></i>
                {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
              </button>

              <div class="text-center">
                <span class="text-muted">Chưa có tài khoản? </span>
                <router-link to="/register" class="text-decoration-none">
                  Đăng ký ngay
                </router-link>
              </div>
            </form>

            <!-- Social Login -->
            <div class="social-login mt-4">
              <div class="divider">
                <span>Hoặc đăng nhập với</span>
              </div>
              <div class="row">
                <div class="col-6">
                  <button class="btn btn-outline-danger w-100" @click="loginWithGoogle">
                    <i class="fab fa-google me-2"></i>
                    Google
                  </button>
                </div>
                <div class="col-6">
                  <button class="btn btn-outline-primary w-100" @click="loginWithFacebook">
                    <i class="fab fa-facebook-f me-2"></i>
                    Facebook
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right side - Image/Branding -->
        <div class="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-primary-light">
          <div class="text-center text-white">
            <div class="login-illustration mb-4">
              <i class="fas fa-shopping-cart fa-5x mb-3"></i>
            </div>
            <h3>Chào mừng đến với EcoMan</h3>
            <p class="lead">Nền tảng thương mại điện tử hàng đầu Việt Nam</p>
            <ul class="list-unstyled mt-4">
              <li class="mb-2">
                <i class="fas fa-check-circle me-2"></i>
                Hàng ngàn sản phẩm chất lượng
              </li>
              <li class="mb-2">
                <i class="fas fa-check-circle me-2"></i>
                Giao hàng nhanh chóng
              </li>
              <li class="mb-2">
                <i class="fas fa-check-circle me-2"></i>
                Hỗ trợ 24/7
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <div class="modal fade" id="forgotPasswordModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Quên mật khẩu</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleForgotPassword">
              <div class="mb-3">
                <label for="resetEmail" class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="resetEmail"
                  v-model="resetEmail"
                  placeholder="Nhập email để khôi phục mật khẩu"
                  required
                >
              </div>
              <button type="submit" class="btn btn-primary w-100" :disabled="resetLoading">
                <span v-if="resetLoading" class="spinner-border spinner-border-sm me-2"></span>
                {{ resetLoading ? 'Đang gửi...' : 'Gửi link khôi phục' }}
              </button>
            </form>
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
import { Modal } from 'bootstrap'

export default {
  name: 'UserLogin',
  setup() {
    const toast = useToast()
    return { toast }
  },
  data() {
    return {
      loginForm: {
        email: '',
        password: '',
        rememberMe: false
      },
      resetEmail: '',
      showPassword: false,
      resetLoading: false,
      errors: {}
    }
  },
  computed: {
    ...mapState(useUserStore, ['loading', 'error'])
  },
  methods: {
    ...mapActions(useUserStore, ['login']),
    
    async handleLogin() {
      this.errors = {}
      
      // Basic validation
      if (!this.loginForm.email) {
        this.errors.email = 'Email là bắt buộc'
        return
      }
      
      if (!this.loginForm.password) {
        this.errors.password = 'Mật khẩu là bắt buộc'
        return
      }
      
      if (this.loginForm.password.length < 6) {
        this.errors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
        return
      }
      
      try {
        const success = await this.login(this.loginForm.email, this.loginForm.password)
        
        if (success) {
          // Show success message
          this.toast.success('Đăng nhập thành công!')
          
          // Redirect to intended page or home
          const redirectTo = this.$route.query.redirect || '/home'
          this.$router.push(redirectTo)
        }
      } catch (error) {
        console.error('Login error:', error)
      }
    },
    
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    
    showForgotPassword() {
      const modal = new Modal(document.getElementById('forgotPasswordModal'))
      modal.show()
    },
    
    async handleForgotPassword() {
      if (!this.resetEmail) {
        this.toast.error('Vui lòng nhập email')
        return
      }
      
      this.resetLoading = true
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.toast.success('Link khôi phục mật khẩu đã được gửi đến email của bạn!')
        
        // Close modal
        const modal = Modal.getInstance(document.getElementById('forgotPasswordModal'))
        modal.hide()
        
        this.resetEmail = ''
      } catch (error) {
        this.toast.error('Có lỗi xảy ra, vui lòng thử lại!')
      } finally {
        this.resetLoading = false
      }
    },
    
    async loginWithGoogle() {
      this.toast.info('Tính năng đăng nhập Google sẽ sớm được cập nhật!')
    },
    
    async loginWithFacebook() {
      this.toast.info('Tính năng đăng nhập Facebook sẽ sớm được cập nhật!')
    }
  },
  
  mounted() {
    // Auto focus on email input
    this.$nextTick(() => {
      document.getElementById('email')?.focus()
    })
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-form-wrapper {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
}

.login-title {
  color: #333;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.login-form .form-control {
  border-radius: 8px;
  border: 1px solid #e1e5e9;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
}

.login-form .form-control:focus {
  border-color: var(--primary-color, #ff6b35);
  box-shadow: 0 0 0 0.2rem rgba(255, 107, 53, 0.25);
}

.input-group-text {
  background-color: #f8f9fa;
  border-color: #e1e5e9;
  color: #6c757d;
}

.btn-primary {
  background-color: var(--primary-color, #ff6b35);
  border-color: var(--primary-color, #ff6b35);
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #e05e00;
  border-color: #e05e00;
  transform: translateY(-1px);
}

.bg-primary-light {
  background: linear-gradient(135deg, var(--primary-color, #ff6b35) 0%, #ff8c42 100%);
}

.login-illustration {
  opacity: 0.9;
}

.social-login .divider {
  text-align: center;
  margin: 1.5rem 0;
  position: relative;
}

.social-login .divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e1e5e9;
}

.social-login .divider span {
  background: white;
  padding: 0 1rem;
  color: #6c757d;
  font-size: 0.9rem;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-outline-primary:hover {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.form-check-input:checked {
  background-color: var(--primary-color, #ff6b35);
  border-color: var(--primary-color, #ff6b35);
}

.modal-content {
  border-radius: 15px;
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-header {
  border-bottom: 1px solid #e9ecef;
  padding: 1.5rem;
}

.modal-body {
  padding: 1.5rem;
}

@media (max-width: 768px) {
  .login-container {
    padding: 1rem;
  }
  
  .login-form-wrapper {
    padding: 1.5rem;
    margin: 1rem 0;
  }
}
</style>