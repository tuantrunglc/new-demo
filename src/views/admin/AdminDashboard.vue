<template>
  <div class="admin-dashboard">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/admin">
          <i class="fas fa-store me-2"></i> ShopVN Admin
        </router-link>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNavbar">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="adminNavbar">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" :class="{ active: $route.name === 'userManagement' }" to="/admin/users">
                <i class="fas fa-users me-1"></i> Quản lý người dùng
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :class="{ active: $route.name === 'orderManagement' }" to="/admin/orders">
                <i class="fas fa-shopping-cart me-1"></i> Quản lý đơn hàng
              </router-link>
            </li>
          </ul>
          
          <div class="d-flex align-items-center">
            <span class="text-white me-3">
              <i class="fas fa-user-circle me-1"></i> {{ adminUser?.fullName }}
            </span>
            <button @click="handleLogout" class="btn btn-outline-light btn-sm">
              <i class="fas fa-sign-out-alt me-1"></i> Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </nav>
    
    <div class="container-fluid py-4">
      <router-view />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '../../stores/adminStore'

export default {
  name: 'AdminDashboard',
  setup() {
    const router = useRouter()
    const adminStore = useAdminStore()
    
    const adminUser = computed(() => adminStore.adminUser)
    
    const handleLogout = () => {
      adminStore.logout()
      router.push('/admin/login')
    }
    
    return {
      adminUser,
      handleLogout
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background-color: #f8f9fa;
}
</style>