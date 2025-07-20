<template>
  <ul class="nav">
    <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        Categories
      </a>
      <ul class="dropdown-menu">
        <li v-for="category in categories" :key="category.id">
          <a class="dropdown-item" :href="category.link">{{ category.name }}</a>
        </li>
      </ul>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#">Today's Deals</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#">New Arrivals</a>
    </li>
    
    <!-- User Authentication Section -->
    <li v-if="!isAuthenticated" class="nav-item">
      <router-link class="nav-link" to="/login">
        <i class="fas fa-sign-in-alt me-1"></i> Đăng nhập
      </router-link>
    </li>
    <li v-if="!isAuthenticated" class="nav-item">
      <router-link class="nav-link" to="/register">
        <i class="fas fa-user-plus me-1"></i> Đăng ký
      </router-link>
    </li>
    
    <!-- Authenticated User Menu -->
    <li v-if="isAuthenticated" class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="fas fa-user me-1"></i> 
        <span>{{ fullName || 'Tài khoản' }}</span>
      </a>
      <ul class="dropdown-menu dropdown-menu-end">
        <li class="dropdown-header">
          <div class="d-flex align-items-center">
            <div class="user-avatar me-2">
              <i class="fas fa-user-circle fa-2x text-primary"></i>
            </div>
            <div>
              <div class="fw-bold">{{ fullName }}</div>
              <small class="text-muted">{{ currentUser?.email }}</small>
            </div>
          </div>
        </li>
        <li><hr class="dropdown-divider"></li>
        <li>
          <router-link class="dropdown-item" to="/profile">
            <i class="fas fa-user-circle me-2"></i> Hồ sơ cá nhân
          </router-link>
        </li>
        <li>
          <router-link class="dropdown-item" to="/wallet">
            <i class="fas fa-wallet me-2"></i> Ví của tôi
          </router-link>
        </li>
        <li>
          <router-link class="dropdown-item" to="/deposit">
            <i class="fas fa-plus-circle me-2 text-success"></i> Nạp tiền
          </router-link>
        </li>
        <li>
          <router-link class="dropdown-item" to="/withdrawal">
            <i class="fas fa-money-bill-wave me-2"></i> Rút tiền
          </router-link>
        </li>
        <li>
          <router-link class="dropdown-item" to="/bank-account">
            <i class="fas fa-university me-2"></i> Tài khoản ngân hàng
          </router-link>
        </li>
        <li>
          <router-link class="dropdown-item" to="/orders">
            <i class="fas fa-shopping-bag me-2"></i> Đơn hàng
          </router-link>
        </li>
        <li><hr class="dropdown-divider"></li>
        <li>
          <a class="dropdown-item" href="#" @click.prevent="showSettings">
            <i class="fas fa-cog me-2"></i> Cài đặt
          </a>
        </li>
        <li>
          <a class="dropdown-item text-danger" href="#" @click.prevent="handleLogout">
            <i class="fas fa-sign-out-alt me-2"></i> Đăng xuất
          </a>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
import { categories } from '../../data/categories';
import { useUserStore } from '../../../stores/userStore';
import { mapState, mapActions } from 'pinia';
import { useToast } from 'vue-toastification';

export default {
  name: 'NavLinks',
  setup() {
    const toast = useToast()
    return { toast }
  },
  data() {
    return {
      categories: categories
    }
  },
  computed: {
    ...mapState(useUserStore, ['isAuthenticated', 'currentUser', 'fullName'])
  },
  methods: {
    ...mapActions(useUserStore, ['logout']),
    
    async handleLogout() {
      try {
        this.logout();
        this.toast.success('Đăng xuất thành công!');
        this.$router.push('/');
      } catch (error) {
        console.error('Logout error:', error);
        this.toast.error('Có lỗi xảy ra khi đăng xuất!');
      }
    },
    
    showSettings() {
      this.toast.info('Tính năng cài đặt sẽ sớm được cập nhật!');
    }
  }
}
</script>

<style scoped>
.nav-link {
  color: var(--dark-color);
  font-weight: 500;
}

.nav-link:hover {
  color: var(--primary-color);
}

.dropdown-header {
  padding: 0.75rem 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.user-avatar {
  flex-shrink: 0;
}

.dropdown-item {
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  transform: translateX(2px);
}

.dropdown-item.text-danger:hover {
  background-color: #f8d7da;
  color: #721c24 !important;
}

.dropdown-menu {
  min-width: 250px;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  border: none;
  border-radius: 0.5rem;
}

.dropdown-divider {
  margin: 0.5rem 0;
}
</style>