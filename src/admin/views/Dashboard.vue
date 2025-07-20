<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-600">Tổng quan hệ thống</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600">
              <i class="fas fa-users text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Tổng người dùng</p>
              <p class="text-2xl font-bold text-gray-900">{{ dashboard?.users_count || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600">
              <i class="fas fa-box text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
              <p class="text-2xl font-bold text-gray-900">{{ dashboard?.products_count || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <i class="fas fa-shopping-cart text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
              <p class="text-2xl font-bold text-gray-900">{{ dashboard?.orders_count || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 text-purple-600">
              <i class="fas fa-dollar-sign text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Doanh thu</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(dashboard?.total_revenue || 0) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Sales Chart -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Doanh thu theo tháng</h3>
          <div class="h-64 flex items-center justify-center text-gray-500">
            <div v-if="dashboard?.monthly_sales">
              <canvas ref="salesChart" width="400" height="200"></canvas>
            </div>
            <div v-else>
              <i class="fas fa-chart-line text-4xl mb-2"></i>
              <p>Chưa có dữ liệu</p>
            </div>
          </div>
        </div>

        <!-- User Growth Chart -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Tăng trưởng người dùng</h3>
          <div class="h-64 flex items-center justify-center text-gray-500">
            <div v-if="dashboard?.user_growth">
              <canvas ref="userChart" width="400" height="200"></canvas>
            </div>
            <div v-else>
              <i class="fas fa-chart-area text-4xl mb-2"></i>
              <p>Chưa có dữ liệu</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Orders -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Đơn hàng gần đây</h3>
          </div>
          <div class="p-6">
            <div v-if="dashboard?.recent_orders && dashboard.recent_orders.length > 0">
              <div v-for="order in dashboard.recent_orders" :key="order.id" class="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <p class="font-medium text-gray-900">#{{ order.id }}</p>
                  <p class="text-sm text-gray-600">{{ order.user?.name || 'N/A' }}</p>
                </div>
                <div class="text-right">
                  <p class="font-medium text-gray-900">{{ formatCurrency(order.total) }}</p>
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" :class="getOrderStatusClass(order.status)">
                    {{ getOrderStatusText(order.status) }}
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              <i class="fas fa-shopping-cart text-3xl mb-2"></i>
              <p>Chưa có đơn hàng nào</p>
            </div>
          </div>
        </div>

        <!-- Recent Users -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Người dùng mới</h3>
          </div>
          <div class="p-6">
            <div v-if="dashboard?.recent_users && dashboard.recent_users.length > 0">
              <div v-for="user in dashboard.recent_users" :key="user.id" class="flex items-center py-3 border-b border-gray-100 last:border-b-0">
                <div class="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span class="text-indigo-700 font-medium">{{ getInitials(user.name) }}</span>
                </div>
                <div class="ml-3 flex-1">
                  <p class="font-medium text-gray-900">{{ user.name }}</p>
                  <p class="text-sm text-gray-600">{{ user.email }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-600">{{ formatDate(user.created_at) }}</p>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              <i class="fas fa-users text-3xl mb-2"></i>
              <p>Chưa có người dùng mới</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mt-8 bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <router-link to="/admin/users" class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <i class="fas fa-users text-2xl text-blue-600 mb-2"></i>
            <span class="text-sm font-medium text-gray-900">Quản lý người dùng</span>
          </router-link>
          
          <router-link to="/admin/products" class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <i class="fas fa-box text-2xl text-green-600 mb-2"></i>
            <span class="text-sm font-medium text-gray-900">Quản lý sản phẩm</span>
          </router-link>
          
          <router-link to="/admin/orders" class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <i class="fas fa-shopping-cart text-2xl text-yellow-600 mb-2"></i>
            <span class="text-sm font-medium text-gray-900">Quản lý đơn hàng</span>
          </router-link>
          
          <router-link to="/admin/reports" class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <i class="fas fa-chart-bar text-2xl text-purple-600 mb-2"></i>
            <span class="text-sm font-medium text-gray-900">Báo cáo</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useAdminStore } from '../stores/adminStore'
import Chart from 'chart.js/auto'

export default {
  name: 'AdminDashboard',
  setup() {
    const adminStore = useAdminStore()
    const salesChart = ref(null)
    const userChart = ref(null)
    
    const loading = computed(() => adminStore.loading)
    const dashboard = computed(() => adminStore.dashboard)
    
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(value)
    }
    
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('vi-VN')
    }
    
    const getInitials = (name) => {
      if (!name) return '?'
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    }
    
    const getOrderStatusClass = (status) => {
      switch (status) {
        case 'pending':
          return 'bg-yellow-100 text-yellow-800'
        case 'processing':
          return 'bg-blue-100 text-blue-800'
        case 'shipped':
          return 'bg-purple-100 text-purple-800'
        case 'delivered':
          return 'bg-green-100 text-green-800'
        case 'cancelled':
          return 'bg-red-100 text-red-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }
    
    const getOrderStatusText = (status) => {
      switch (status) {
        case 'pending':
          return 'Chờ xử lý'
        case 'processing':
          return 'Đang xử lý'
        case 'shipped':
          return 'Đã gửi'
        case 'delivered':
          return 'Đã giao'
        case 'cancelled':
          return 'Đã hủy'
        default:
          return status
      }
    }
    
    const initCharts = async () => {
      await nextTick()
      
      if (dashboard.value?.monthly_sales && salesChart.value) {
        const ctx = salesChart.value.getContext('2d')
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: dashboard.value.monthly_sales.map(item => `Tháng ${item.month}`),
            datasets: [{
              label: 'Doanh thu',
              data: dashboard.value.monthly_sales.map(item => item.revenue),
              borderColor: 'rgb(99, 102, 241)',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                      notation: 'compact'
                    }).format(value)
                  }
                }
              }
            }
          }
        })
      }
      
      if (dashboard.value?.user_growth && userChart.value) {
        const ctx = userChart.value.getContext('2d')
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: dashboard.value.user_growth.map(item => `Tháng ${item.month}`),
            datasets: [{
              label: 'Người dùng mới',
              data: dashboard.value.user_growth.map(item => item.users),
              backgroundColor: 'rgba(34, 197, 94, 0.8)',
              borderColor: 'rgb(34, 197, 94)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        })
      }
    }
    
    onMounted(async () => {
      await adminStore.fetchDashboard()
      await initCharts()
    })
    
    return {
      loading,
      dashboard,
      salesChart,
      userChart,
      formatCurrency,
      formatDate,
      getInitials,
      getOrderStatusClass,
      getOrderStatusText
    }
  }
}
</script>

<style scoped>
.transition-colors {
  transition: background-color 0.2s ease;
}
</style>