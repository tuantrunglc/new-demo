<template>
  <div class="register-container">
    <div class="container-fluid h-100">
      <div class="row h-100">
        <!-- Left side - Image/Branding -->
        <div class="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-primary-light">
          <div class="text-center text-white">
            <div class="register-illustration mb-4">
              <i class="fas fa-user-plus fa-5x mb-3"></i>
            </div>
            <h3>Tham gia cộng đồng EcoMan</h3>
            <p class="lead">Khám phá hàng ngàn sản phẩm tuyệt vời</p>
            <ul class="list-unstyled mt-4">
              <li class="mb-2">
                <i class="fas fa-gift me-2"></i>
                Ưu đãi đặc biệt cho thành viên mới
              </li>
              <li class="mb-2">
                <i class="fas fa-ticket-alt me-2"></i>
                Nhận thêm ưu đãi với mã giới thiệu Sub Admin
              </li>
              <li class="mb-2">
                <i class="fas fa-shipping-fast me-2"></i>
                Miễn phí vận chuyển đơn đầu tiên
              </li>
              <li class="mb-2">
                <i class="fas fa-star me-2"></i>
                Tích điểm thưởng với mỗi giao dịch
              </li>
            </ul>
          </div>
        </div>

        <!-- Right side - Register Form -->
        <div class="col-md-6 d-flex align-items-center justify-content-center">
          <div class="register-form-wrapper">
            <div class="text-center mb-4">
              <h2 class="register-title">Đăng ký tài khoản</h2>
              <p class="text-muted">Tạo tài khoản để bắt đầu mua sắm!</p>
            </div>

            <form @submit.prevent="handleRegister" class="register-form">
              <div class="mb-3">
                <label for="name" class="form-label">Họ và tên</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fas fa-user"></i>
                  </span>
                  <input
                    type="text"
                    class="form-control"
                    id="name"
                    v-model="registerForm.name"
                    :class="{ 'is-invalid': errors.name }"
                    placeholder="Nhập họ và tên đầy đủ"
                    required
                  >
                </div>
                <div v-if="errors.name" class="invalid-feedback">
                  {{ errors.name }}
                </div>
              </div>

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
                    v-model="registerForm.email"
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
                <label for="phone" class="form-label">Số điện thoại</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fas fa-phone"></i>
                  </span>
                  <input
                    type="tel"
                    class="form-control"
                    id="phone"
                    v-model="registerForm.phone"
                    :class="{ 'is-invalid': errors.phone }"
                    placeholder="Nhập số điện thoại"
                    required
                  >
                </div>
                <div v-if="errors.phone" class="invalid-feedback">
                  {{ errors.phone }}
                </div>
              </div>

              <div class="mb-3">
                <label for="subAdminCode" class="form-label">
                  Mã giới thiệu Sub Admin 
                  <span class="text-muted">(Tùy chọn)</span>
                </label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fas fa-ticket-alt"></i>
                  </span>
                  <input
                    type="text"
                    class="form-control"
                    id="subAdminCode"
                    v-model="registerForm.sub_admin_code"
                    :class="{ 'is-invalid': errors.sub_admin_code }"
                    placeholder="Nhập mã giới thiệu (nếu có)"
                    @input="formatSubAdminCode"
                    maxlength="10"
                  >
                </div>
                <div v-if="errors.sub_admin_code" class="invalid-feedback">
                  {{ errors.sub_admin_code }}
                </div>
                <small class="form-text text-muted">
                  <i class="fas fa-info-circle me-1"></i>
                  Nhập mã giới thiệu từ Sub Admin để nhận ưu đãi đặc biệt
                </small>
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
                    v-model="registerForm.password"
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
                <div class="password-strength mt-1">
                  <div class="progress" style="height: 4px;">
                    <div 
                      class="progress-bar" 
                      :class="passwordStrengthClass"
                      :style="{ width: passwordStrengthWidth }"
                    ></div>
                  </div>
                  <small class="text-muted">{{ passwordStrengthText }}</small>
                </div>
              </div>

              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Xác nhận mật khẩu</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fas fa-lock"></i>
                  </span>
                  <input
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="form-control"
                    id="confirmPassword"
                    v-model="registerForm.password_confirmation"
                    :class="{ 'is-invalid': errors.password_confirmation }"
                    placeholder="Nhập lại mật khẩu"
                    required
                  >
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="toggleConfirmPassword"
                  >
                    <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
                <div v-if="errors.password_confirmation" class="invalid-feedback">
                  {{ errors.password_confirmation }}
                </div>
              </div>



              <div class="mb-3">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="agreeTerms"
                    v-model="registerForm.agreeTerms"
                    :class="{ 'is-invalid': errors.agreeTerms }"
                    required
                  >
                  <label class="form-check-label" for="agreeTerms">
                    Tôi đồng ý với 
                    <a href="#" @click.prevent="showTerms" class="text-decoration-none">
                      Điều khoản sử dụng
                    </a> 
                    và 
                    <a href="#" @click.prevent="showPrivacy" class="text-decoration-none">
                      Chính sách bảo mật
                    </a>
                  </label>
                  <div v-if="errors.agreeTerms" class="invalid-feedback">
                    {{ errors.agreeTerms }}
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="newsletter"
                    v-model="registerForm.newsletter"
                  >
                  <label class="form-check-label" for="newsletter">
                    Nhận thông báo về ưu đãi và sản phẩm mới qua email
                  </label>
                </div>
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
                <i v-else class="fas fa-user-plus me-2"></i>
                {{ loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản' }}
              </button>

              <div class="text-center">
                <span class="text-muted">Đã có tài khoản? </span>
                <router-link to="/login" class="text-decoration-none">
                  Đăng nhập ngay
                </router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Terms Modal -->
    <div class="modal fade" id="termsModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Điều khoản sử dụng</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <h6>1. Chấp nhận điều khoản</h6>
            <p>Bằng việc sử dụng dịch vụ của EcoMan, bạn đồng ý tuân thủ các điều khoản và điều kiện này.</p>
            
            <h6>2. Tài khoản người dùng</h6>
            <p>Bạn có trách nhiệm bảo mật thông tin tài khoản và mật khẩu của mình.</p>
            
            <h6>3. Quyền và nghĩa vụ</h6>
            <p>Người dùng có quyền sử dụng dịch vụ theo đúng mục đích và tuân thủ pháp luật.</p>
            
            <h6>4. Chính sách hoàn trả</h6>
            <p>Sản phẩm có thể được hoàn trả trong vòng 7 ngày kể từ ngày nhận hàng.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Privacy Modal -->
    <div class="modal fade" id="privacyModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Chính sách bảo mật</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <h6>1. Thu thập thông tin</h6>
            <p>Chúng tôi thu thập thông tin cần thiết để cung cấp dịch vụ tốt nhất cho bạn.</p>
            
            <h6>2. Sử dụng thông tin</h6>
            <p>Thông tin của bạn được sử dụng để xử lý đơn hàng và cải thiện dịch vụ.</p>
            
            <h6>3. Bảo vệ thông tin</h6>
            <p>Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn bằng các biện pháp bảo mật hiện đại.</p>
            
            <h6>4. Chia sẻ thông tin</h6>
            <p>Thông tin của bạn sẽ không được chia sẻ với bên thứ ba mà không có sự đồng ý.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
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
  name: 'UserRegister',
  setup() {
    const toast = useToast()
    return { toast }
  },
  data() {
    return {
      registerForm: {
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        sub_admin_code: '',
        agreeTerms: false,
        newsletter: false
      },
      showPassword: false,
      showConfirmPassword: false,
      errors: {}
    }
  },
  computed: {
    ...mapState(useUserStore, ['loading', 'error']),
    
    passwordStrength() {
      const password = this.registerForm.password
      if (!password) return 0
      
      let strength = 0
      if (password.length >= 8) strength++
      if (/[a-z]/.test(password)) strength++
      if (/[A-Z]/.test(password)) strength++
      if (/[0-9]/.test(password)) strength++
      if (/[^A-Za-z0-9]/.test(password)) strength++
      
      return strength
    },
    
    passwordStrengthClass() {
      const strength = this.passwordStrength
      if (strength <= 1) return 'bg-danger'
      if (strength <= 2) return 'bg-warning'
      if (strength <= 3) return 'bg-info'
      return 'bg-success'
    },
    
    passwordStrengthWidth() {
      return `${(this.passwordStrength / 5) * 100}%`
    },
    
    passwordStrengthText() {
      const strength = this.passwordStrength
      if (strength <= 1) return 'Yếu'
      if (strength <= 2) return 'Trung bình'
      if (strength <= 3) return 'Khá'
      return 'Mạnh'
    }
  },
  methods: {
    ...mapActions(useUserStore, ['register']),
    
    async handleRegister() {
      this.errors = {}
      
      // Validation
      if (!this.registerForm.name.trim()) {
        this.errors.name = 'Họ và tên là bắt buộc'
      } else if (this.registerForm.name.trim().length < 2) {
        this.errors.name = 'Họ và tên phải có ít nhất 2 ký tự'
      }
      
      if (!this.registerForm.email) {
        this.errors.email = 'Email là bắt buộc'
      } else if (!/\S+@\S+\.\S+/.test(this.registerForm.email)) {
        this.errors.email = 'Email không hợp lệ'
      }
      
      if (!this.registerForm.phone) {
        this.errors.phone = 'Số điện thoại là bắt buộc'
      } else if (!/^[0-9]{10,11}$/.test(this.registerForm.phone.replace(/\s/g, ''))) {
        this.errors.phone = 'Số điện thoại không hợp lệ (10-11 số)'
      }
      
      if (!this.registerForm.password) {
        this.errors.password = 'Mật khẩu là bắt buộc'
      } else if (this.registerForm.password.length < 6) {
        this.errors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
      }
      
      if (!this.registerForm.password_confirmation) {
        this.errors.password_confirmation = 'Xác nhận mật khẩu là bắt buộc'
      } else if (this.registerForm.password !== this.registerForm.password_confirmation) {
        this.errors.password_confirmation = 'Mật khẩu xác nhận không khớp'
      }
      
      // Validate sub admin code format if provided
      if (this.registerForm.sub_admin_code && this.registerForm.sub_admin_code.trim()) {
        const codePattern = /^SA[0-9]{3,}$/i
        if (!codePattern.test(this.registerForm.sub_admin_code.trim())) {
          this.errors.sub_admin_code = 'Mã giới thiệu không đúng định dạng (VD: SA001)'
        }
      }
      
      if (!this.registerForm.agreeTerms) {
        this.errors.agreeTerms = 'Bạn phải đồng ý với điều khoản sử dụng'
      }
      
      // If there are errors, don't submit
      if (Object.keys(this.errors).length > 0) {
        return
      }
      
      try {
        // Prepare data for API
        const registerData = {
          name: this.registerForm.name.trim(),
          email: this.registerForm.email.trim(),
          password: this.registerForm.password,
          password_confirmation: this.registerForm.password_confirmation,
          phone: this.registerForm.phone.trim()
        }

        // Add sub_admin_code only if provided
        if (this.registerForm.sub_admin_code && this.registerForm.sub_admin_code.trim()) {
          registerData.sub_admin_code = this.registerForm.sub_admin_code.trim().toUpperCase()
        }

        const success = await this.register(registerData)
        
        if (success) {
          this.toast.success('Đăng ký thành công! Chào mừng bạn đến với EcoMan!')
          
          // Show special message if sub admin code was used
          if (registerData.sub_admin_code) {
            setTimeout(() => {
              this.toast.info('🎉 Bạn đã được liên kết với Sub Admin! Hãy kiểm tra ưu đãi đặc biệt.')
            }, 1500)
          }
          
          this.$router.push('/home')
        }
      } catch (error) {
        console.error('Register error:', error)
        
        // Handle specific API errors
        if (error.response && error.response.data && error.response.data.errors) {
          this.errors = error.response.data.errors
        }
      }
    },
    
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword
    },
    
    showTerms() {
      const modal = new Modal(document.getElementById('termsModal'))
      modal.show()
    },
    
    showPrivacy() {
      const modal = new Modal(document.getElementById('privacyModal'))
      modal.show()
    },

    // Format sub admin code as user types
    formatSubAdminCode() {
      if (this.registerForm.sub_admin_code) {
        this.registerForm.sub_admin_code = this.registerForm.sub_admin_code.toUpperCase()
      }
    }
  },
  
  mounted() {
    // Auto focus on name input
    this.$nextTick(() => {
      document.getElementById('name')?.focus()
    })
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-form-wrapper {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  margin: 2rem 0;
}

.register-title {
  color: #333;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.register-form .form-control {
  border-radius: 8px;
  border: 1px solid #e1e5e9;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
}

.register-form .form-control:focus {
  border-color: var(--primary-color, #ff6b35);
  box-shadow: 0 0 0 0.2rem rgba(255, 107, 53, 0.25);
}

.input-group-text {
  background-color: #f8f9fa;
  border-color: #e1e5e9;
  color: #6c757d;
}

/* Sub Admin Code Field Styling */
#subAdminCode {
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.5px;
}

#subAdminCode:focus {
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

#subAdminCode + .input-group-text {
  background-color: #e8f5e8;
  border-color: #28a745;
  color: #28a745;
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

.register-illustration {
  opacity: 0.9;
}

.form-check-input:checked {
  background-color: var(--primary-color, #ff6b35);
  border-color: var(--primary-color, #ff6b35);
}

.password-strength .progress {
  border-radius: 2px;
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
  max-height: 400px;
  overflow-y: auto;
}

.modal-body h6 {
  color: var(--primary-color, #ff6b35);
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.modal-body h6:first-child {
  margin-top: 0;
}

@media (max-width: 768px) {
  .register-container {
    padding: 1rem;
  }
  
  .register-form-wrapper {
    padding: 1.5rem;
    margin: 1rem 0;
  }
}
</style>