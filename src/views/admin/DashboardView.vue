<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Dashboard</h1>
    
    <div v-if="loading" class="flex justify-center my-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
    
    <div v-else>
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-indigo-100 text-indigo-500">
              <i class="fas fa-users text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-gray-500 text-sm">Tổng người dùng</p>
              <p class="text-2xl font-semibold">{{ totalUsers }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-500">
              <i class="fas fa-store text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-gray-500 text-sm">Tổng người bán</p>
              <p class="text-2xl font-semibold">{{ totalSellers }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-500">
              <i class="fas fa-shopping-cart text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-gray-500 text-sm">Tổng đơn hàng</p>
              <p class="text-2xl font-semibold">{{ totalOrders }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 text-yellow-500">
              <i class="fas fa-money-bill-wave text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-gray-500 text-sm">Doanh thu hôm nay</p>
              <p class="text-2xl font-semibold">{{ formatCurrency(todayRevenue) }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Top Sellers -->
        <div class="bg-white rounded-lg shadow col-span-1">
          <div class="p-4 border-b">
            <h2 class="text-lg font-semibold">Top Sellers</h2>
          </div>
          <div class="p-4">
            <div v-for="(seller, index) in topSellers" :key="seller.id" 
                 class="flex items-center justify-between py-3 border-b last:border-0">
              <div class="flex items-center">
                <div class="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-800 font-bold">
                  {{ index + 1 }}
                </div>
                <div class="ml-3">
                  <p class="font-medium">{{ seller.name }}</p>
                  <p class="text-sm text-gray-500">{{ seller.orders }} đơn hàng</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-semibold">{{ formatCurrency(seller.sales) }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Orders Chart -->
        <div class="bg-white rounded-lg shadow col-span-1 lg:col-span-2">
          <div class="p-4 border-b">
            <h2 class="text-lg font-semibold">Đơn hàng theo ngày</h2>
          </div>
          <div class="p-4 h-80">
            <canvas ref="ordersChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useDashboardStore } from '../../stores/dashboardStore'
import Chart from 'chart.js/auto'

export default {
  name: 'DashboardView',
  setup() {
    const dashboardStore = useDashboardStore()
    const ordersChart = ref(null)
    let chart = null
    
    const loading = computed(() => dashboardStore.loading)
    const totalUsers = computed(() => dashboardStore.totalUsers)
    const totalSellers = computed(() => dashboardStore.totalSellers)
    const totalOrders = computed(() => dashboardStore.totalOrders)
    const todayRevenue = computed(() => dashboardStore.todayRevenue)
    const topSellers = computed(() => dashboardStore.topSellers)
    const ordersByDay = computed(() => dashboardStore.ordersByDay)
    
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(value)
    }
    
    const initChart = () => {
      if (!ordersByDay.value.length) return
      
      const ctx = ordersChart.value.getContext('2d')
      
      // Destroy existing chart if it exists
      if (chart) {
        chart.destroy()
      }
      
      chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ordersByDay.value.map(day => day.date),
          datasets: [
            {
              label: 'Số đơn hàng',
              data: ordersByDay.value.map(day => day.count),
              backgroundColor: 'rgba(99, 102, 241, 0.5)',
              borderColor: 'rgb(99, 102, 241)',
              borderWidth: 1
            },
            {
              label: 'Doanh thu (triệu VND)',
              data: ordersByDay.value.map(day => day.revenue / 1000000),
              backgroundColor: 'rgba(16, 185, 129, 0.5)',
              borderColor: 'rgb(16, 185, 129)',
              borderWidth: 1,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Số đơn hàng'
              }
            },
            y1: {
              beginAtZero: true,
              position: 'right',
              title: {
                display: true,
                text: 'Doanh thu (triệu VND)'
              },
              grid: {
                drawOnChartArea: false
              }
            }
          }
        }
      })
    }
    
    onMounted(async () => {
      await dashboardStore.fetchDashboardData()
      initChart()
    })
    
    return {
      loading,
      totalUsers,
      totalSellers,
      totalOrders,
      todayRevenue,
      topSellers,
      ordersByDay,
      ordersChart,
      formatCurrency
    }
  }
}
</script>