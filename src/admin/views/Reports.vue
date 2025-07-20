<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Báo cáo</h1>
      <p class="text-gray-600">Thống kê và phân tích dữ liệu hệ thống</p>
    </div>

    <!-- Date Range Filter -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
          <input 
            type="date" 
            v-model="dateRange.start"
            class="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
          <input 
            type="date" 
            v-model="dateRange.end"
            class="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Loại báo cáo</label>
          <select 
            v-model="reportType"
            class="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="sales">Doanh thu</option>
            <option value="users">Người dùng</option>
            <option value="products">Sản phẩm</option>
            <option value="orders">Đơn hàng</option>
          </select>
        </div>
        <div class="flex items-end">
          <button 
            @click="generateReport"
            :disabled="loading"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            <i class="fas fa-chart-bar mr-2"></i>
            {{ loading ? 'Đang tạo...' : 'Tạo báo cáo' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Reports Content -->
    <div v-else-if="reports" class="space-y-6">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600">
              <i class="fas fa-dollar-sign text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Tổng doanh thu</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(reports.total_revenue || 0) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600">
              <i class="fas fa-shopping-cart text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
              <p class="text-2xl font-bold text-gray-900">{{ reports.total_orders || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 text-purple-600">
              <i class="fas fa-users text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Người dùng mới</p>
              <p class="text-2xl font-bold text-gray-900">{{ reports.new_users || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <i class="fas fa-box text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Sản phẩm mới</p>
              <p class="text-2xl font-bold text-gray-900">{{ reports.new_products || 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Revenue Chart -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Biểu đồ doanh thu</h3>
          <div class="h-64">
            <canvas ref="revenueChart" v-if="reports.revenue_chart"></canvas>
            <div v-else class="flex items-center justify-center h-full text-gray-500">
              <div class="text-center">
                <i class="fas fa-chart-line text-4xl mb-2"></i>
                <p>Không có dữ liệu</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Orders Chart -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Biểu đồ đơn hàng</h3>
          <div class="h-64">
            <canvas ref="ordersChart" v-if="reports.orders_chart"></canvas>
            <div v-else class="flex items-center justify-center h-full text-gray-500">
              <div class="text-center">
                <i class="fas fa-chart-bar text-4xl mb-2"></i>
                <p>Không có dữ liệu</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Products -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Sản phẩm bán chạy</h3>
        </div>
        <div class="p-6">
          <div v-if="reports.top_products && reports.top_products.length > 0">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số lượng bán
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doanh thu
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tỷ lệ
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="product in reports.top_products" :key="product.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <img 
                          :src="getProductImage(product)" 
                          :alt="product.name"
                          class="h-10 w-10 rounded-lg object-cover"
                        >
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                          <div class="text-sm text-gray-500">{{ product.category?.name }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ product.total_sold || 0 }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ formatCurrency(product.total_revenue || 0) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            class="bg-indigo-600 h-2 rounded-full" 
                            :style="{ width: `${(product.total_sold / reports.top_products[0].total_sold) * 100}%` }"
                          ></div>
                        </div>
                        <span class="text-sm text-gray-600">
                          {{ Math.round((product.total_sold / reports.top_products[0].total_sold) * 100) }}%
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            <i class="fas fa-box text-3xl mb-2"></i>
            <p>Không có dữ liệu sản phẩm</p>
          </div>
        </div>
      </div>

      <!-- Export Options -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Xuất báo cáo</h3>
        <div class="flex flex-wrap gap-4">
          <button 
            @click="exportReport('pdf')"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <i class="fas fa-file-pdf mr-2"></i>
            Xuất PDF
          </button>
          <button 
            @click="exportReport('excel')"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <i class="fas fa-file-excel mr-2"></i>
            Xuất Excel
          </button>
          <button 
            @click="exportReport('csv')"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <i class="fas fa-file-csv mr-2"></i>
            Xuất CSV
          </button>
        </div>
      </div>
    </div>

    <!-- No Data State -->
    <div v-else class="text-center py-12">
      <i class="fas fa-chart-bar text-6xl text-gray-300 mb-4"></i>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Chưa có báo cáo</h3>
      <p class="text-gray-600">Chọn khoảng thời gian và tạo báo cáo để xem dữ liệu</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useAdminStore } from '../stores/adminStore'
import { useToast } from 'vue-toastification'
import Chart from 'chart.js/auto'

export default {
  name: 'AdminReports',
  setup() {
    const adminStore = useAdminStore()
    const toast = useToast()
    
    const dateRange = ref({
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
      end: new Date().toISOString().split('T')[0] // today
    })
    
    const reportType = ref('sales')
    const revenueChart = ref(null)
    const ordersChart = ref(null)
    
    const loading = computed(() => adminStore.loading)
    const reports = computed(() => adminStore.reports)
    
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(value)
    }
    
    const getProductImage = (product) => {
      if (product.images && product.images.length > 0) {
        return product.images[0]
      }
      return 'https://via.placeholder.com/40x40?text=No+Image'
    }
    
    const generateReport = async () => {
      try {
        await adminStore.fetchReports({
          start_date: dateRange.value.start,
          end_date: dateRange.value.end,
          type: reportType.value
        })
        
        await nextTick()
        initCharts()
        
        toast.success('Báo cáo đã được tạo thành công!')
      } catch (error) {
        console.error('Error generating report:', error)
        toast.error('Có lỗi xảy ra khi tạo báo cáo')
      }
    }
    
    const initCharts = () => {
      // Revenue Chart
      if (reports.value?.revenue_chart && revenueChart.value) {
        const ctx = revenueChart.value.getContext('2d')
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: reports.value.revenue_chart.map(item => item.date),
            datasets: [{
              label: 'Doanh thu',
              data: reports.value.revenue_chart.map(item => item.revenue),
              borderColor: 'rgb(99, 102, 241)',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              tension: 0.4,
              fill: true
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
      
      // Orders Chart
      if (reports.value?.orders_chart && ordersChart.value) {
        const ctx = ordersChart.value.getContext('2d')
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: reports.value.orders_chart.map(item => item.date),
            datasets: [{
              label: 'Số đơn hàng',
              data: reports.value.orders_chart.map(item => item.orders),
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
    
    const exportReport = async (format) => {
      try {
        const response = await adminStore.exportReport({
          start_date: dateRange.value.start,
          end_date: dateRange.value.end,
          type: reportType.value,
          format: format
        })
        
        // Create download link
        const url = window.URL.createObjectURL(new Blob([response]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `report_${dateRange.value.start}_${dateRange.value.end}.${format}`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
        
        toast.success(`Báo cáo ${format.toUpperCase()} đã được tải xuống!`)
      } catch (error) {
        console.error('Error exporting report:', error)
        toast.error('Có lỗi xảy ra khi xuất báo cáo')
      }
    }
    
    onMounted(() => {
      generateReport()
    })
    
    return {
      dateRange,
      reportType,
      revenueChart,
      ordersChart,
      loading,
      reports,
      formatCurrency,
      getProductImage,
      generateReport,
      exportReport
    }
  }
}
</script>

<style scoped>
.transition-colors {
  transition: background-color 0.2s ease;
}
</style>