<template>
  <div class="financial-reports-container">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Báo cáo tài chính</h1>
          <p class="text-gray-600 mt-1">Thống kê doanh thu, lợi nhuận và các chỉ số tài chính</p>
        </div>
        <div class="flex space-x-3">
          <select v-model="selectedPeriod" @change="loadReportData" class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="today">Hôm nay</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="quarter">Quý này</option>
            <option value="year">Năm này</option>
            <option value="custom">Tùy chỉnh</option>
          </select>
          <button @click="exportReport" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center">
            <i class="fas fa-file-excel mr-2"></i>
            Xuất báo cáo
          </button>
          <button @click="refreshData" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
            <i class="fas fa-sync-alt mr-2" :class="{ 'animate-spin': isRefreshing }"></i>
            Làm mới
          </button>
        </div>
      </div>

      <!-- Custom Date Range -->
      <div v-if="selectedPeriod === 'custom'" class="mt-4 flex space-x-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
          <input v-model="customDateRange.from" type="date" class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
          <input v-model="customDateRange.to" type="date" class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>
        <div class="flex items-end">
          <button @click="loadReportData" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Áp dụng
          </button>
        </div>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 text-sm">Tổng doanh thu</p>
            <p class="text-2xl font-bold">{{ formatCurrency(metrics.totalRevenue) }}</p>
            <p class="text-blue-100 text-xs mt-1">
              <i :class="metrics.revenueGrowth >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
              {{ Math.abs(metrics.revenueGrowth) }}% so với kỳ trước
            </p>
          </div>
          <div class="bg-blue-400 bg-opacity-30 rounded-full p-3">
            <i class="fas fa-chart-line text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-100 text-sm">Lợi nhuận</p>
            <p class="text-2xl font-bold">{{ formatCurrency(metrics.totalProfit) }}</p>
            <p class="text-green-100 text-xs mt-1">
              Tỷ suất: {{ metrics.profitMargin }}%
            </p>
          </div>
          <div class="bg-green-400 bg-opacity-30 rounded-full p-3">
            <i class="fas fa-dollar-sign text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-100 text-sm">Tổng đơn hàng</p>
            <p class="text-2xl font-bold">{{ metrics.totalOrders }}</p>
            <p class="text-purple-100 text-xs mt-1">
              Giá trị TB: {{ formatCurrency(metrics.averageOrderValue) }}
            </p>
          </div>
          <div class="bg-purple-400 bg-opacity-30 rounded-full p-3">
            <i class="fas fa-shopping-cart text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-orange-100 text-sm">Khách hàng mới</p>
            <p class="text-2xl font-bold">{{ metrics.newCustomers }}</p>
            <p class="text-orange-100 text-xs mt-1">
              Tỷ lệ chuyển đổi: {{ metrics.conversionRate }}%
            </p>
          </div>
          <div class="bg-orange-400 bg-opacity-30 rounded-full p-3">
            <i class="fas fa-users text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Revenue Chart -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Biểu đồ doanh thu</h3>
          <select v-model="revenueChartType" class="border border-gray-300 rounded px-2 py-1 text-sm">
            <option value="line">Đường</option>
            <option value="bar">Cột</option>
            <option value="area">Vùng</option>
          </select>
        </div>
        <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div class="text-center text-gray-500">
            <i class="fas fa-chart-line text-4xl mb-2"></i>
            <p>Biểu đồ doanh thu theo thời gian</p>
            <p class="text-sm">(Sẽ tích hợp Chart.js)</p>
          </div>
        </div>
      </div>

      <!-- Profit Chart -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Biểu đồ lợi nhuận</h3>
          <select v-model="profitChartType" class="border border-gray-300 rounded px-2 py-1 text-sm">
            <option value="line">Đường</option>
            <option value="bar">Cột</option>
          </select>
        </div>
        <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div class="text-center text-gray-500">
            <i class="fas fa-chart-area text-4xl mb-2"></i>
            <p>Biểu đồ lợi nhuận theo thời gian</p>
            <p class="text-sm">(Sẽ tích hợp Chart.js)</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Reports -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- Revenue Breakdown -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Phân tích doanh thu</h3>
        <div class="space-y-4">
          <div v-for="item in revenueBreakdown" :key="item.category" class="flex justify-between items-center">
            <div class="flex items-center">
              <div :class="item.color" class="w-3 h-3 rounded-full mr-3"></div>
              <span class="text-sm text-gray-700">{{ item.category }}</span>
            </div>
            <div class="text-right">
              <div class="text-sm font-medium text-gray-900">{{ formatCurrency(item.amount) }}</div>
              <div class="text-xs text-gray-500">{{ item.percentage }}%</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Products -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Sản phẩm bán chạy</h3>
        <div class="space-y-3">
          <div v-for="(product, index) in topProducts" :key="product.id" class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-sm font-medium text-blue-600">{{ index + 1 }}</span>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                <div class="text-xs text-gray-500">{{ product.sold }} đã bán</div>
              </div>
            </div>
            <div class="text-sm font-medium text-gray-900">{{ formatCurrency(product.revenue) }}</div>
          </div>
        </div>
      </div>

      <!-- Payment Methods -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Phương thức thanh toán</h3>
        <div class="space-y-4">
          <div v-for="method in paymentMethods" :key="method.name" class="flex justify-between items-center">
            <div class="flex items-center">
              <i :class="method.icon" class="mr-3 text-lg"></i>
              <span class="text-sm text-gray-700">{{ method.name }}</span>
            </div>
            <div class="text-right">
              <div class="text-sm font-medium text-gray-900">{{ method.count }} giao dịch</div>
              <div class="text-xs text-gray-500">{{ method.percentage }}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Financial Summary Table -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Tóm tắt tài chính chi tiết</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chỉ số</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá trị hiện tại</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kỳ trước</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thay đổi</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mục tiêu</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in financialSummary" :key="item.metric" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <i :class="item.icon" class="mr-3 text-gray-400"></i>
                  <div class="text-sm font-medium text-gray-900">{{ item.metric }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ item.current }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ item.previous }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <i :class="item.change >= 0 ? 'fas fa-arrow-up text-green-500' : 'fas fa-arrow-down text-red-500'" class="mr-1"></i>
                  <span :class="item.change >= 0 ? 'text-green-600' : 'text-red-600'" class="text-sm font-medium">
                    {{ Math.abs(item.change) }}%
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-full bg-gray-200 rounded-full h-2 mr-2">
                    <div :class="item.progress >= 100 ? 'bg-green-500' : item.progress >= 70 ? 'bg-yellow-500' : 'bg-red-500'" 
                         class="h-2 rounded-full" 
                         :style="{ width: Math.min(item.progress, 100) + '%' }"></div>
                  </div>
                  <span class="text-sm text-gray-500">{{ item.progress }}%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Insights and Recommendations -->
    <div class="mt-6 bg-white rounded-lg shadow-sm p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Phân tích và khuyến nghị</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 class="text-md font-medium text-gray-900 mb-3">📈 Điểm mạnh</h4>
          <ul class="space-y-2">
            <li v-for="strength in insights.strengths" :key="strength" class="flex items-start">
              <i class="fas fa-check-circle text-green-500 mr-2 mt-0.5"></i>
              <span class="text-sm text-gray-700">{{ strength }}</span>
            </li>
          </ul>
        </div>
        <div>
          <h4 class="text-md font-medium text-gray-900 mb-3">⚠️ Cần cải thiện</h4>
          <ul class="space-y-2">
            <li v-for="improvement in insights.improvements" :key="improvement" class="flex items-start">
              <i class="fas fa-exclamation-triangle text-yellow-500 mr-2 mt-0.5"></i>
              <span class="text-sm text-gray-700">{{ improvement }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'FinancialReports',
  setup() {
    // Reactive data
    const selectedPeriod = ref('month')
    const customDateRange = ref({
      from: '',
      to: ''
    })
    const isRefreshing = ref(false)
    const revenueChartType = ref('line')
    const profitChartType = ref('line')

    // Metrics data
    const metrics = ref({
      totalRevenue: 15750000,
      revenueGrowth: 12.5,
      totalProfit: 4725000,
      profitMargin: 30,
      totalOrders: 156,
      averageOrderValue: 101000,
      newCustomers: 23,
      conversionRate: 3.2
    })

    // Revenue breakdown
    const revenueBreakdown = ref([
      { category: 'Điện tử', amount: 6300000, percentage: 40, color: 'bg-blue-500' },
      { category: 'Thời trang', amount: 4725000, percentage: 30, color: 'bg-green-500' },
      { category: 'Gia dụng', amount: 3150000, percentage: 20, color: 'bg-yellow-500' },
      { category: 'Khác', amount: 1575000, percentage: 10, color: 'bg-purple-500' }
    ])

    // Top products
    const topProducts = ref([
      { id: 1, name: 'iPhone 15 Pro Max', sold: 25, revenue: 2500000 },
      { id: 2, name: 'Samsung Galaxy S24', sold: 18, revenue: 1800000 },
      { id: 3, name: 'MacBook Air M3', sold: 12, revenue: 1680000 },
      { id: 4, name: 'AirPods Pro', sold: 35, revenue: 1050000 },
      { id: 5, name: 'iPad Air', sold: 15, revenue: 900000 }
    ])

    // Payment methods
    const paymentMethods = ref([
      { name: 'Ví điện tử', count: 142, percentage: 91, icon: 'fas fa-wallet text-blue-500' },
      { name: 'Chuyển khoản', count: 12, percentage: 8, icon: 'fas fa-university text-green-500' },
      { name: 'Tiền mặt', count: 2, percentage: 1, icon: 'fas fa-money-bill text-yellow-500' }
    ])

    // Financial summary
    const financialSummary = ref([
      {
        metric: 'Doanh thu',
        current: '15.75M VND',
        previous: '14.02M VND',
        change: 12.3,
        progress: 85,
        icon: 'fas fa-chart-line'
      },
      {
        metric: 'Lợi nhuận',
        current: '4.73M VND',
        previous: '4.21M VND',
        change: 12.4,
        progress: 78,
        icon: 'fas fa-dollar-sign'
      },
      {
        metric: 'Chi phí vận hành',
        current: '2.1M VND',
        previous: '2.3M VND',
        change: -8.7,
        progress: 92,
        icon: 'fas fa-cogs'
      },
      {
        metric: 'ROI',
        current: '225%',
        previous: '198%',
        change: 13.6,
        progress: 95,
        icon: 'fas fa-percentage'
      },
      {
        metric: 'Khách hàng mới',
        current: '23',
        previous: '19',
        change: 21.1,
        progress: 76,
        icon: 'fas fa-users'
      }
    ])

    // Insights
    const insights = ref({
      strengths: [
        'Doanh thu tăng trưởng ổn định 12.5% so với tháng trước',
        'Tỷ suất lợi nhuận cao 30%, vượt mục tiêu 25%',
        'Giá trị đơn hàng trung bình tăng 8.2%',
        'Tỷ lệ khách hàng quay lại mua cao 68%'
      ],
      improvements: [
        'Tỷ lệ chuyển đổi còn thấp 3.2%, cần tối ưu funnel',
        'Chi phí marketing chiếm 15% doanh thu, cần tối ưu',
        'Thời gian xử lý đơn hàng trung bình 2.5 ngày, cần cải thiện',
        'Tỷ lệ hoàn trả 5.2%, cần kiểm tra chất lượng sản phẩm'
      ]
    })

    // Methods
    const loadReportData = async () => {
      isRefreshing.value = true
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update metrics based on selected period
      // This would normally fetch from API
      
      isRefreshing.value = false
    }

    const refreshData = async () => {
      await loadReportData()
    }

    const exportReport = () => {
      // Simulate export functionality
      alert('Tính năng xuất báo cáo Excel sẽ được triển khai sau!')
    }

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(amount)
    }

    const getPeriodName = computed(() => {
      const names = {
        today: 'Hôm nay',
        week: 'Tuần này',
        month: 'Tháng này',
        quarter: 'Quý này',
        year: 'Năm này',
        custom: 'Tùy chỉnh'
      }
      return names[selectedPeriod.value] || 'Tháng này'
    })

    // Lifecycle
    onMounted(() => {
      loadReportData()
    })

    return {
      // Data
      selectedPeriod,
      customDateRange,
      isRefreshing,
      revenueChartType,
      profitChartType,
      metrics,
      revenueBreakdown,
      topProducts,
      paymentMethods,
      financialSummary,
      insights,
      
      // Computed
      getPeriodName,
      
      // Methods
      loadReportData,
      refreshData,
      exportReport,
      formatCurrency
    }
  }
}
</script>

<style scoped>
.financial-reports-container {
  @apply p-6 bg-gray-50 min-h-screen;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>