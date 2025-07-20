<template>
  <div class="access-denied-container">
    <div class="access-denied-content">
      <div class="icon-container">
        <i class="fas fa-ban text-danger"></i>
      </div>
      <h2 class="title">Truy cập bị từ chối</h2>
      <p class="message">{{ message }}</p>
      <div class="actions">
        <button @click="goBack" class="btn btn-secondary me-2">
          <i class="fas fa-arrow-left"></i> Quay lại
        </button>
        <button @click="goHome" class="btn btn-primary">
          <i class="fas fa-home"></i> Về trang chủ
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccessDenied',
  props: {
    userType: {
      type: String,
      default: 'user'
    }
  },
  computed: {
    message() {
      if (this.userType === 'admin') {
        return 'Bạn không có quyền truy cập vào khu vực người dùng. Vui lòng sử dụng giao diện quản trị.'
      } else {
        return 'Bạn không có quyền truy cập vào khu vực quản trị. Vui lòng đăng nhập với tài khoản admin.'
      }
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    goHome() {
      if (this.userType === 'admin') {
        this.$router.push({ name: 'dashboard' })
      } else {
        this.$router.push({ name: 'home' })
      }
    }
  }
}
</script>

<style scoped>
.access-denied-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.access-denied-content {
  background: white;
  border-radius: 15px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.icon-container {
  margin-bottom: 20px;
}

.icon-container i {
  font-size: 4rem;
}

.title {
  color: #333;
  margin-bottom: 15px;
  font-weight: 600;
}

.message {
  color: #666;
  margin-bottom: 30px;
  line-height: 1.6;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

@media (max-width: 768px) {
  .access-denied-content {
    padding: 30px 20px;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>