<template>
  <div class="admin-dashboard">
    <nav class="bg-indigo-700 text-white shadow-lg">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center py-3">
          <router-link class="text-xl font-bold flex items-center" to="/admin">
            <i class="fas fa-store mr-2"></i> ShopVN Admin
          </router-link>
          
          <button class="md:hidden focus:outline-none" type="button" @click="toggleMobileMenu">
            <i class="fas fa-bars text-xl"></i>
          </button>
          
          <div class="hidden md:flex items-center space-x-4">
            <div class="flex items-center space-x-1">
              <span class="text-white">
                <i class="fas fa-user-circle mr-1"></i> {{ currentUser?.fullName }}
              </span>
              <span class="text-xs px-2 py-1 bg-indigo-800 rounded-full">{{ currentUser?.role }}</span>
            </div>
            <button @click="handleLogout" class="px-3 py-1 bg-indigo-800 hover:bg-indigo-900 rounded text-sm">
              <i class="fas fa-sign-out-alt mr-1"></i> Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </nav>
    
    <div class="flex min-h-screen bg-gray-100">
      <!-- Sidebar -->
      <div class="w-64 bg-white shadow-md hidden md:block">
        <div class="p-4">
          <router-link 
            to="/admin/dashboard" 
            class="flex items-center p-2 rounded-lg mb-1"
            :class="{ 'bg-indigo-100 text-indigo-700': $route.name === 'dashboard', 'hover:bg-gray-100': $route.name !== 'dashboard' }"
          >
            <i class="fas fa-tachometer-alt w-6"></i>
            <span>Dashboard</span>
          </router-link>
          
          <router-link 
            to="/admin/users" 
            class="flex items-center p-2 rounded-lg mb-1"
            :class="{ 'bg-indigo-100 text-indigo-700': $route.name === 'userManagement', 'hover:bg-gray-100': $route.name !== 'userManagement' }"
          >
            <i class="fas fa-users w-6"></i>
            <span>Quản lý người dùng</span>
          </router-link>
          
          <router-link 
            to="/admin/products" 
            class="flex items-center p-2 rounded-lg mb-1"
            :class="{ 'bg-indigo-100 text-indigo-700': $route.name === 'productManagement', 'hover:bg-gray-100': $route.name !== 'productManagement' }"
          >
            <i class="fas fa-box w-6"></i>
            <span>Quản lý sản phẩm</span>
          </router-link>
          
          <router-link 
            to="/admin/orders" 
            class="flex items-center p-2 rounded-lg mb-1"
            :class="{ 'bg-indigo-100 text-indigo-700': $route.name === 'orderManagement', 'hover:bg-gray-100': $route.name !== 'orderManagement' }"
          >
            <i class="fas fa-shopping-cart w-6"></i>
            <span>Quản lý đơn hàng</span>
          </router-link>
          
          <router-link 
            v-if="isAdmin"
            to="/admin/spins" 
            class="flex items-center p-2 rounded-lg mb-1"
            :class="{ 'bg-indigo-100 text-indigo-700': $route.name === 'spinManagement', 'hover:bg-gray-100': $route.name !== 'spinManagement' }"
          >
            <i class="fas fa-dharmachakra w-6"></i>
            <span>Vòng quay may mắn</span>
          </router-link>
          
          <router-link 
            to="/admin/commissions" 
            class="flex items-center p-2 rounded-lg mb-1"
            :class="{ 'bg-indigo-100 text-indigo-700': $route.name === 'commissionManagement', 'hover:bg-gray-100': $route.name !== 'commissionManagement' }"
          >
            <i class="fas fa-money-bill-wave w-6"></i>
            <span>Quản lý hoa hồng</span>
          </router-link>
          
          <router-link 
            v-if="isAdmin"
            to="/admin/wallets" 
            class="flex items-center p-2 rounded-lg mb-1"
            :class="{ 'bg-indigo-100 text-indigo-700': $route.name === 'walletManagement', 'hover:bg-gray-100': $route.name !== 'walletManagement' }"
          >
            <i class="fas fa-wallet w-6"></i>
            <span>Quản lý ví người dùng</span>
          </router-link>
          
          <router-link 
            to="/admin/deposits" 
            class="flex items-center p-2 rounded-lg mb-1"
            :class="{ 'bg-indigo-100 text-indigo-700': $route.name === 'depositManagement', 'hover:bg-gray-100': $route.name !== 'depositManagement' }"
          >
            <i class="fas fa-money-check-alt w-6"></i>
            <span>Quản lý nạp tiền</span>
          </router-link>
          
          <router-link 
            to="/admin/categories" 
            class="flex items-center p-2 rounded-lg mb-1"
            :class="{ 'bg-indigo-100 text-indigo-700': $route.name === 'categoryManagement', 'hover:bg-gray-100': $route.name !== 'categoryManagement' }"
          >
            <i class="fas fa-layer-group w-6"></i>
            <span>Quản lý danh mục</span>
          </router-link>
          
          <router-link 
            to="/admin/banners" 
            class="flex items-center p-2 rounded-lg mb-1"
            :class="{ 'bg-indigo-100 text-indigo-700': $route.name === 'bannerManagement', 'hover:bg-gray-100': $route.name !== 'bannerManagement' }"
          >
            <i class="fas fa-images w-6"></i>
            <span>Quản lý Banner</span>
          </router-link>
          
          <router-link 
            v-if="isAdmin"
            to="/admin/banks" 
            class="flex items-center p-2 rounded-lg mb-1"
            :class="{ 'bg-indigo-100 text-indigo-700': $route.name === 'bankSettings', 'hover:bg-gray-100': $route.name !== 'bankSettings' }"
          >
            <i class="fas fa-university w-6"></i>
            <span>Cài đặt ngân hàng</span>
          </router-link>
          
          <router-link 
            v-if="isAdmin"
            to="/admin/settings" 
            class="flex items-center p-2 rounded-lg mb-1"
            :class="{ 'bg-indigo-100 text-indigo-700': $route.name === 'systemSettings', 'hover:bg-gray-100': $route.name !== 'systemSettings' }"
          >
            <i class="fas fa-cogs w-6"></i>
            <span>Cài đặt hệ thống</span>
          </router-link>

          <!-- Báo cáo & Thống kê -->
          <div class="mt-4 mb-2">
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Báo cáo & Thống kê</h3>
          </div>
          
          <router-link 
            to="/admin/transactions" 
            class="flex items-center p-2 rounded-lg mb-1"
            :class="{ 'bg-indigo-100 text-indigo-700': $route.name === 'transactionHistory', 'hover:bg-gray-100': $route.name !== 'transactionHistory' }"
          >
            <i class="fas fa-exchange-alt w-6"></i>
            <span>Lịch sử giao dịch</span>
          </router-link>
          
          <router-link 
            v-if="isAdmin"
            to="/admin/reports/financial" 
            class="flex items-center p-2 rounded-lg mb-1"
            :class="{ 'bg-indigo-100 text-indigo-700': $route.name === 'financialReports', 'hover:bg-gray-100': $route.name !== 'financialReports' }"
          >
            <i class="fas fa-chart-line w-6"></i>
            <span>Báo cáo tài chính</span>
          </router-link>
          
          <router-link 
            to="/admin/reports/deposits" 
            class="flex items-center p-2 rounded-lg mb-1"
            :class="{ 'bg-indigo-100 text-indigo-700': $route.name === 'depositStatistics', 'hover:bg-gray-100': $route.name !== 'depositStatistics' }"
          >
            <i class="fas fa-chart-bar w-6"></i>
            <span>Thống kê nạp tiền</span>
          </router-link>
        </div>
      </div>
      
      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="fixed inset-0 z-50 bg-gray-800 bg-opacity-50" @click="toggleMobileMenu">
        <div class="w-64 h-full bg-white shadow-lg" @click.stop>
          <div class="p-4 border-b flex justify-between items-center">
            <span class="font-bold">Menu</span>
            <button @click="toggleMobileMenu" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="p-4">
            <router-link 
              to="/admin/dashboard" 
              class="flex items-center p-2 rounded-lg mb-1"
              :class="{ 'bg-indigo-100 text-indigo-700': $route.name === 'dashboard', 'hover:bg-gray-100': $route.name !== 'dashboard' }"
              @click="toggleMobileMenu"
            >
              <i class="fas fa-tachometer-alt w-6"></i>
              <span>Dashboard</span>
            </router-link>
            
            <router-link 
              to="/admin/users" 
              class="flex items-center p-2 rounded-lg mb-1"
              :class="{ 'bg-indigo-100 text-indigo-700': $route.name === 'userManagement', 'hover:bg-gray-100': $route.name !== 'userManagement' }"
              @click="toggleMobileMenu"
            >
              <i class="fas fa-users w-6"></i>
              <span>Quản lý người dùng</span>
            </router-link>
            
            <router-link 
              to="/admin/products" 
              class="flex items-center p-2 rounded-lg mb-1"
              :class="{ 'bg-indigo-100 text-indigo-700': $route.name === 'productManagement', 'hover:bg-gray-100': $route.name !== 'productManagement' }"
              @click="toggleMobileMenu"
            >
              <i class="fas fa-box w-6"></i>
              <span>Quản lý sản phẩm</span>
            </router-link>
            
            <router-link 
              to="/admin/orders" 
              class="flex items-center p-2 rounded-lg mb-1"
              :class="{ 'bg-indigo-100 text-indigo-700': $route.name === 'orderManagement', 'hover:bg-gray-100': $route.name !== 'orderManagement' }"
              @click="toggleMobileMenu"
            >
              <i class="fas fa-shopping-cart w-6"></i>
              <span>Quản lý đơn hàng</span>
            </router-link>
            
            <router-link 
              v-if="isAdmin"
              to="/admin/spins" 
              class="flex items-center p-2 rounded-lg mb-1"
              :class="{ 'bg-indigo-100 text-indigo-700': $route.name === 'spinManagement', 'hover:bg-gray-100': $route.name !== 'spinManagement' }"
              @click="toggleMobileMenu"
            >
              <i class="fas fa-dharmachakra w-6"></i>
              <span>Vòng quay may mắn</span>
            </router-link>
            
            <router-link 
              to="/admin/commissions" 
              class="flex items-center p-2 rounded-lg mb-1"
              :class="{ 'bg-indigo-100 text-indigo-700': $route.name === 'commissionManagement', 'hover:bg-gray-100': $route.name !== 'commissionManagement' }"
              @click="toggleMobileMenu"
            >
              <i class="fas fa-money-bill-wave w-6"></i>
              <span>Quản lý hoa hồng</span>
            </router-link>
            
            <router-link 
              v-if="isAdmin"
              to="/admin/wallets" 
              class="flex items-center p-2 rounded-lg mb-1"
              :class="{ 'bg-indigo-100 text-indigo-700': $route.name === 'walletManagement', 'hover:bg-gray-100': $route.name !== 'walletManagement' }"
              @click="toggleMobileMenu"
            >
              <i class="fas fa-wallet w-6"></i>
              <span>Quản lý ví người dùng</span>
            </router-link>
            
            <router-link 
              to="/admin/deposits" 
              class="flex items-center p-2 rounded-lg mb-1"
              :class="{ 'bg-indigo-100 text-indigo-700': $route.name === 'depositManagement', 'hover:bg-gray-100': $route.name !== 'depositManagement' }"
              @click="toggleMobileMenu"
            >
              <i class="fas fa-money-check-alt w-6"></i>
              <span>Quản lý nạp tiền</span>
            </router-link>
            
            <router-link 
              to="/admin/categories" 
              class="flex items-center p-2 rounded-lg mb-1"
              :class="{ 'bg-indigo-100 text-indigo-700': $route.name === 'categoryManagement', 'hover:bg-gray-100': $route.name !== 'categoryManagement' }"
              @click="toggleMobileMenu"
            >
              <i class="fas fa-layer-group w-6"></i>
              <span>Quản lý danh mục</span>
            </router-link>
            
            <router-link 
              to="/admin/banners" 
              class="flex items-center p-2 rounded-lg mb-1"
              :class="{ 'bg-indigo-100 text-indigo-700': $route.name === 'bannerManagement', 'hover:bg-gray-100': $route.name !== 'bannerManagement' }"
              @click="toggleMobileMenu"
            >
              <i class="fas fa-images w-6"></i>
              <span>Quản lý Banner</span>
            </router-link>
            
            <router-link 
              v-if="isAdmin"
              to="/admin/banks" 
              class="flex items-center p-2 rounded-lg mb-1"
              :class="{ 'bg-indigo-100 text-indigo-700': $route.name === 'bankSettings', 'hover:bg-gray-100': $route.name !== 'bankSettings' }"
              @click="toggleMobileMenu"
            >
              <i class="fas fa-university w-6"></i>
              <span>Cài đặt ngân hàng</span>
            </router-link>
            
            <router-link 
              v-if="isAdmin"
              to="/admin/settings" 
              class="flex items-center p-2 rounded-lg mb-1"
              :class="{ 'bg-indigo-100 text-indigo-700': $route.name === 'systemSettings', 'hover:bg-gray-100': $route.name !== 'systemSettings' }"
              @click="toggleMobileMenu"
            >
              <i class="fas fa-cogs w-6"></i>
              <span>Cài đặt hệ thống</span>
            </router-link>

            <!-- Báo cáo & Thống kê Mobile -->
            <div class="mt-4 mb-2">
              <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Báo cáo & Thống kê</h3>
            </div>
            
            <router-link 
              to="/admin/transactions" 
              class="flex items-center p-2 rounded-lg mb-1"
              :class="{ 'bg-indigo-100 text-indigo-700': $route.name === 'transactionHistory', 'hover:bg-gray-100': $route.name !== 'transactionHistory' }"
              @click="toggleMobileMenu"
            >
              <i class="fas fa-exchange-alt w-6"></i>
              <span>Lịch sử giao dịch</span>
            </router-link>
            
            <router-link 
              v-if="isAdmin"
              to="/admin/reports/financial" 
              class="flex items-center p-2 rounded-lg mb-1"
              :class="{ 'bg-indigo-100 text-indigo-700': $route.name === 'financialReports', 'hover:bg-gray-100': $route.name !== 'financialReports' }"
              @click="toggleMobileMenu"
            >
              <i class="fas fa-chart-line w-6"></i>
              <span>Báo cáo tài chính</span>
            </router-link>
            
            <router-link 
              to="/admin/reports/deposits" 
              class="flex items-center p-2 rounded-lg mb-1"
              :class="{ 'bg-indigo-100 text-indigo-700': $route.name === 'depositStatistics', 'hover:bg-gray-100': $route.name !== 'depositStatistics' }"
              @click="toggleMobileMenu"
            >
              <i class="fas fa-chart-bar w-6"></i>
              <span>Thống kê nạp tiền</span>
            </router-link>
            
            <div class="mt-4 pt-4 border-t">
              <div class="flex items-center mb-2">
                <i class="fas fa-user-circle mr-2"></i>
                <span>{{ currentUser?.fullName }}</span>
              </div>
              <button @click="handleLogout" class="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded">
                <i class="fas fa-sign-out-alt mr-1"></i> Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Main content -->
      <div class="flex-1 p-6">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

export default {
  name: 'AdminDashboard',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const mobileMenuOpen = ref(false)
    
    const currentUser = computed(() => userStore.currentUser)
    const isAdmin = computed(() => userStore.isAdmin)
    
    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value
    }
    
    const handleLogout = () => {
      userStore.logout()
      router.push('/admin/login')
    }
    
    return {
      currentUser,
      isAdmin,
      mobileMenuOpen,
      toggleMobileMenu,
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

/* Sidebar styles */
.admin-dashboard .w-64 {
  width: 16rem !important;
}

.admin-dashboard .bg-indigo-700 {
  background-color: #4338ca !important;
}

.admin-dashboard .text-white {
  color: #ffffff !important;
}

.admin-dashboard .shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
}

.admin-dashboard .bg-white {
  background-color: #ffffff !important;
}

.admin-dashboard .shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
}

.admin-dashboard .bg-indigo-100 {
  background-color: #e0e7ff !important;
}

.admin-dashboard .text-indigo-700 {
  color: #4338ca !important;
}

.admin-dashboard .hover\:bg-gray-100:hover {
  background-color: #f3f4f6 !important;
}

.admin-dashboard .bg-gray-100 {
  background-color: #f3f4f6 !important;
}

/* Make sure Font Awesome icons are visible */
.admin-dashboard i.fas {
  display: inline-block !important;
  width: 1.25em !important;
  text-align: center !important;
}

/* Basic layout styles */
.admin-dashboard .flex {
  display: flex !important;
}

.admin-dashboard .items-center {
  align-items: center !important;
}

.admin-dashboard .justify-between {
  justify-content: space-between !important;
}

.admin-dashboard .container {
  width: 100% !important;
  margin-left: auto !important;
  margin-right: auto !important;
}

.admin-dashboard .px-4 {
  padding-left: 1rem !important;
  padding-right: 1rem !important;
}

.admin-dashboard .py-3 {
  padding-top: 0.75rem !important;
  padding-bottom: 0.75rem !important;
}

.admin-dashboard .p-4 {
  padding: 1rem !important;
}

.admin-dashboard .p-6 {
  padding: 1.5rem !important;
}

.admin-dashboard .p-2 {
  padding: 0.5rem !important;
}

.admin-dashboard .mb-1 {
  margin-bottom: 0.25rem !important;
}

.admin-dashboard .mr-2 {
  margin-right: 0.5rem !important;
}

.admin-dashboard .space-x-4 > * + * {
  margin-left: 1rem !important;
}

.admin-dashboard .space-x-1 > * + * {
  margin-left: 0.25rem !important;
}

.admin-dashboard .text-xl {
  font-size: 1.25rem !important;
  line-height: 1.75rem !important;
}

.admin-dashboard .text-xs {
  font-size: 0.75rem !important;
  line-height: 1rem !important;
}

.admin-dashboard .font-bold {
  font-weight: 700 !important;
}

.admin-dashboard .rounded-full {
  border-radius: 9999px !important;
}

.admin-dashboard .rounded {
  border-radius: 0.25rem !important;
}

.admin-dashboard .rounded-lg {
  border-radius: 0.5rem !important;
}

.admin-dashboard .min-h-screen {
  min-height: 100vh !important;
}

.admin-dashboard .w-6 {
  width: 1.5rem !important;
}

.admin-dashboard .h-full {
  height: 100% !important;
}

.admin-dashboard .inset-0 {
  top: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  left: 0 !important;
}

.admin-dashboard .z-50 {
  z-index: 50 !important;
}

.admin-dashboard .bg-opacity-50 {
  --tw-bg-opacity: 0.5 !important;
}

.admin-dashboard .border-b {
  border-bottom-width: 1px !important;
}

.admin-dashboard .border-t {
  border-top-width: 1px !important;
}

.admin-dashboard .mt-4 {
  margin-top: 1rem !important;
}

.admin-dashboard .pt-4 {
  padding-top: 1rem !important;
}

.admin-dashboard .mb-2 {
  margin-bottom: 0.5rem !important;
}

.admin-dashboard .w-full {
  width: 100% !important;
}

.admin-dashboard .px-3 {
  padding-left: 0.75rem !important;
  padding-right: 0.75rem !important;
}

.admin-dashboard .py-2 {
  padding-top: 0.5rem !important;
  padding-bottom: 0.5rem !important;
}

.admin-dashboard .py-1 {
  padding-top: 0.25rem !important;
  padding-bottom: 0.25rem !important;
}

.admin-dashboard .text-sm {
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
}

.admin-dashboard .flex-1 {
  flex: 1 1 0% !important;
}

.admin-dashboard .fixed {
  position: fixed !important;
}

@media (min-width: 768px) {
  .admin-dashboard .md\:block {
    display: block !important;
  }
  
  .admin-dashboard .md\:flex {
    display: flex !important;
  }
  
  .admin-dashboard .md\:hidden {
    display: none !important;
  }
}
</style>