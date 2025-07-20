<template>
  <div class="deposit-statistics-container">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Thống kê nạp tiền</h1>
          <p class="text-gray-600 mt-1">Phân tích chi tiết các giao dịch nạp tiền và xu hướng</p>
        </div>
        <div class="flex space-x-3">
          <select v-model="selectedTimeRange" @change="loadStatistics" class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="7days">7 ngày qua</option>
            <option value="30days">30 ngày qua</option>
            <option value="3months">3 tháng qua</option>
            <option value="6months">6 tháng qua</option>
            <option value="1year">1 năm qua</option>
          </select>
          <button @click="exportStatistics" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center">
            <i class="fas fa-file-excel mr-2"></i>
            Xuất Excel
          </button>
          <button @click="refreshData" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
            <i class="fas fa-sync-alt mr-2" :class="{ 'animate-spin': isRefreshing }"></i>
            Làm mới
          </button>
        </div>
      </div>
    </div>

    <!-- Key Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 text-sm">Tổng nạp tiền</p>
            <p class="text-2xl font-bold">{{ formatCurrency(statistics.totalAmount) }}</p>
            <p class="text-blue-100 text-xs mt-1">
              <i :class="statistics.amountGrowth >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
              {{ Math.abs(statistics.amountGrowth) }}% so với kỳ trước
            </p>
          </div>
          <div class="bg-blue-400 bg-opacity-30 rounded-full p-3">
            <i class="fas fa-coins text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-100 text-sm">Số giao dịch</p>
            <p class="text-2xl font-bold">{{ statistics.totalTransactions }}</p>
            <p class="text-green-100 text-xs mt-1">
              Trung bình: {{ formatCurrency(statistics.averageAmount) }}
            </p>
          </div>
          <div class="bg-green-400 bg-opacity-30 rounded-full p-3">
            <i class="fas fa-exchange-alt text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-yellow-100 text-sm">Tỷ lệ thành công</p>
            <p class="text-2xl font-bold">{{ statistics.successRate }}%</p>
            <p class="text-yellow-100 text-xs mt-1">
              {{ statistics.successfulTransactions }}/{{ statistics.totalTransactions }} giao dịch
            </p>
          </div>
          <div class="bg-yellow-400 bg-opacity-30 rounded-full p-3">
            <i class="fas fa-check-circle text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-100 text-sm">Thời gian xử lý TB</p>
            <p class="text-2xl font-bold">{{ statistics.averageProcessingTime }}h</p>
            <p class="text-purple-100 text-xs mt-1">
              Nhanh nhất: {{ statistics.fastestProcessingTime }}h
            </p>
          </div>
          <div class="bg-purple-400 bg-opacity-30 rounded-full p-3">
            <i class="fas fa-clock text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Deposit Trend Chart -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Xu hướng nạp tiền</h3>
          <div class="flex space-x-2">
            <button 
              @click="chartView = 'amount'" 
              :class="chartView === 'amount' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
              class="px-3 py-1 rounded text-sm"
            >
              Số tiền
            </button>
            <button 
              @click="chartView = 'count'" 
              :class="chartView === 'count' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
              class="px-3 py-1 rounded text-sm"
            >
              Số lượng
            </button>
          </div>
        </div>
        <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div class="text-center text-gray-500">
            <i class="fas fa-chart-line text-4xl mb-2"></i>
            <p>Biểu đồ xu hướng nạp tiền theo {{ chartView === 'amount' ? 'số tiền' : 'số lượng' }}</p>
            <p class="text-sm">(Sẽ tích hợp Chart.js)</p>
          </div>
        </div>
      </div>

      <!-- Status Distribution -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Phân bố trạng thái</h3>
        <div class="h-64 flex items-center justify-center">
          <div class="w-48 h-48 relative">
            <!-- Pie Chart Placeholder -->
            <div class="w-full h-full rounded-full border-8 border-gray-200 flex items-center justify-center">
              <div class="text-center text-gray-500">
                <i class="fas fa-chart-pie text-3xl mb-2"></i>
                <p class="text-sm">Biểu đồ tròn</p>
                <p class="text-xs">(Chart.js)</p>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-4 space-y-2">
          <div v-for="status in statusDistribution" :key="status.name" class="flex justify-between items-center">
            <div class="flex items-center">
              <div :class="status.color" class="w-3 h-3 rounded-full mr-2"></div>
              <span class="text-sm text-gray-700">{{ status.name }}</span>
            </div>
            <div class="text-right">
              <div class="text-sm font-medium text-gray-900">{{ status.count }}</div>
              <div class="text-xs text-gray-500">{{ status.percentage }}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Amount Range Analysis -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Amount Ranges -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Phân tích theo mức tiền</h3>
        <div class="space-y-4">
          <div v-for="range in amountRanges" :key="range.range" class="flex items-center justify-between">
            <div class="flex items-center flex-1">
              <div class="w-20 text-sm text-gray-600">{{ range.range }}</div>
              <div class="flex-1 mx-4">
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div :class="range.color" class="h-2 rounded-full" :style="{ width: range.percentage + '%' }"></div>
                </div>
              </div>
              <div class="text-sm text-gray-500">{{ range.percentage }}%</div>
            </div>
            <div class="ml-4 text-right">
              <div class="text-sm font-medium text-gray-900">{{ range.count }} giao dịch</div>
              <div class="text-xs text-gray-500">{{ formatCurrency(range.totalAmount) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Time Analysis -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Phân tích theo thời gian</h3>
        <div class="space-y-4">
          <div>
            <h4 class="text-sm font-medium text-gray-700 mb-2">Theo giờ trong ngày</h4>
            <div class="grid grid-cols-6 gap-1">
              <div v-for="hour in hourlyData" :key="hour.hour" class="text-center">
                <div :class="getHourIntensity(hour.intensity)" class="w-8 h-8 rounded flex items-center justify-center text-xs font-medium">
                  {{ hour.hour }}
                </div>
                <div class="text-xs text-gray-500 mt-1">{{ hour.count }}</div>
              </div>
            </div>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-700 mb-2">Theo ngày trong tuần</h4>
            <div class="space-y-2">
              <div v-for="day in weeklyData" :key="day.day" class="flex items-center justify-between">
                <div class="w-16 text-sm text-gray-600">{{ day.day }}</div>
                <div class="flex-1 mx-4">
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-500 h-2 rounded-full" :style="{ width: day.percentage + '%' }"></div>
                  </div>
                </div>
                <div class="text-sm text-gray-900">{{ day.count }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Users -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Top người dùng nạp tiền nhiều nhất</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Xếp hạng</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người dùng</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng nạp</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lần</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trung bình</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lần cuối</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(user, index) in topUsers" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div :class="getRankBadge(index + 1)" class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {{ index + 1 }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img class="h-10 w-10 rounded-full" :src="user.avatar" :alt="user.name">
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ formatCurrency(user.totalAmount) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ user.transactionCount }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatCurrency(user.averageAmount) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.lastDeposit) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Insights and Trends -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Phân tích và xu hướng</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <h4 class="text-md font-medium text-gray-900 mb-3 flex items-center">
            <i class="fas fa-trending-up text-green-500 mr-2"></i>
            Xu hướng tích cực
          </h4>
          <ul class="space-y-2">
            <li v-for="trend in insights.positiveTrends" :key="trend" class="flex items-start">
              <i class="fas fa-arrow-up text-green-500 mr-2 mt-0.5 text-sm"></i>
              <span class="text-sm text-gray-700">{{ trend }}</span>
            </li>
          </ul>
        </div>
        <div>
          <h4 class="text-md font-medium text-gray-900 mb-3 flex items-center">
            <i class="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
            Cần chú ý
          </h4>
          <ul class="space-y-2">
            <li v-for="concern in insights.concerns" :key="concern" class="flex items-start">
              <i class="fas fa-minus text-yellow-500 mr-2 mt-0.5 text-sm"></i>
              <span class="text-sm text-gray-700">{{ concern }}</span>
            </li>
          </ul>
        </div>
        <div>
          <h4 class="text-md font-medium text-gray-900 mb-3 flex items-center">
            <i class="fas fa-lightbulb text-blue-500 mr-2"></i>
            Khuyến nghị
          </h4>
          <ul class="space-y-2">
            <li v-for="recommendation in insights.recommendations" :key="recommendation" class="flex items-start">
              <i class="fas fa-check text-blue-500 mr-2 mt-0.5 text-sm"></i>
              <span class="text-sm text-gray-700">{{ recommendation }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'DepositStatistics',
  setup() {
    // Reactive data
    const selectedTimeRange = ref('30days')
    const isRefreshing = ref(false)
    const chartView = ref('amount')

    // Statistics data
    const statistics = ref({
      totalAmount: 45750000,
      amountGrowth: 18.5,
      totalTransactions: 234,
      successfulTransactions: 218,
      successRate: 93.2,
      averageAmount: 195513,
      averageProcessingTime: 2.3,
      fastestProcessingTime: 0.5
    })

    // Status distribution
    const statusDistribution = ref([
      { name: 'Thành công', count: 218, percentage: 93.2, color: 'bg-green-500' },
      { name: 'Đang xử lý', count: 12, percentage: 5.1, color: 'bg-yellow-500' },
      { name: 'Thất bại', count: 4, percentage: 1.7, color: 'bg-red-500' }
    ])

    // Amount ranges
    const amountRanges = ref([
      { range: '< 100K', count: 45, percentage: 19.2, totalAmount: 3200000, color: 'bg-blue-400' },
      { range: '100K-500K', count: 89, percentage: 38.0, totalAmount: 18500000, color: 'bg-blue-500' },
      { range: '500K-1M', count: 67, percentage: 28.6, totalAmount: 16800000, color: 'bg-blue-600' },
      { range: '1M-5M', count: 28, percentage: 12.0, totalAmount: 6200000, color: 'bg-blue-700' },
      { range: '> 5M', count: 5, percentage: 2.1, totalAmount: 1050000, color: 'bg-blue-800' }
    ])

    // Hourly data
    const hourlyData = ref([
      { hour: '0-4', count: 2, intensity: 'low' },
      { hour: '4-8', count: 8, intensity: 'low' },
      { hour: '8-12', count: 45, intensity: 'high' },
      { hour: '12-16', count: 67, intensity: 'highest' },
      { hour: '16-20', count: 89, intensity: 'highest' },
      { hour: '20-24', count: 23, intensity: 'medium' }
    ])

    // Weekly data
    const weeklyData = ref([
      { day: 'T2', count: 42, percentage: 85 },
      { day: 'T3', count: 38, percentage: 76 },
      { day: 'T4', count: 35, percentage: 70 },
      { day: 'T5', count: 41, percentage: 82 },
      { day: 'T6', count: 33, percentage: 66 },
      { day: 'T7', count: 28, percentage: 56 },
      { day: 'CN', count: 17, percentage: 34 }
    ])

    // Top users
    const topUsers = ref([
      {
        id: 1,
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@email.com',
        avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=0D8ABC&color=fff',
        totalAmount: 5200000,
        transactionCount: 12,
        averageAmount: 433333,
        lastDeposit: new Date('2024-12-18')
      },
      {
        id: 2,
        name: 'Trần Thị B',
        email: 'tranthib@email.com',
        avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=7C3AED&color=fff',
        totalAmount: 3800000,
        transactionCount: 8,
        averageAmount: 475000,
        lastDeposit: new Date('2024-12-17')
      },
      {
        id: 3,
        name: 'Lê Văn C',
        email: 'levanc@email.com',
        avatar: 'https://ui-avatars.com/api/?name=Le+Van+C&background=059669&color=fff',
        totalAmount: 3200000,
        transactionCount: 15,
        averageAmount: 213333,
        lastDeposit: new Date('2024-12-19')
      },
      {
        id: 4,
        name: 'Phạm Thị D',
        email: 'phamthid@email.com',
        avatar: 'https://ui-avatars.com/api/?name=Pham+Thi+D&background=DC2626&color=fff',
        totalAmount: 2900000,
        transactionCount: 6,
        averageAmount: 483333,
        lastDeposit: new Date('2024-12-16')
      },
      {
        id: 5,
        name: 'Hoàng Văn E',
        email: 'hoangvane@email.com',
        avatar: 'https://ui-avatars.com/api/?name=Hoang+Van+E&background=F59E0B&color=fff',
        totalAmount: 2500000,
        transactionCount: 10,
        averageAmount: 250000,
        lastDeposit: new Date('2024-12-15')
      }
    ])

    // Insights
    const insights = ref({
      positiveTrends: [
        'Tổng số tiền nạp tăng 18.5% so với kỳ trước',
        'Tỷ lệ thành công cao 93.2%, vượt mục tiêu 90%',
        'Thời gian xử lý trung bình giảm 15% xuống 2.3h',
        'Số lượng giao dịch lớn (>1M) tăng 25%'
      ],
      concerns: [
        'Giao dịch cuối tuần giảm 40% so với ngày thường',
        'Tỷ lệ thất bại tăng nhẹ 0.3% trong tuần qua',
        'Thời gian xử lý vào giờ cao điểm chậm hơn 50%',
        'Số lượng giao dịch nhỏ (<100K) tăng quá nhanh'
      ],
      recommendations: [
        'Tăng cường nhân sự xử lý vào khung 12-20h',
        'Triển khai xử lý tự động cho giao dịch <500K',
        'Khuyến khích nạp tiền cuối tuần bằng ưu đãi',
        'Cải thiện UX để giảm tỷ lệ giao dịch thất bại'
      ]
    })

    // Methods
    const loadStatistics = async () => {
      isRefreshing.value = true
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      isRefreshing.value = false
    }

    const refreshData = async () => {
      await loadStatistics()
    }

    const exportStatistics = () => {
      alert('Tính năng xuất thống kê Excel sẽ được triển khai sau!')
    }

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(amount)
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('vi-VN')
    }

    const getHourIntensity = (intensity) => {
      const classes = {
        low: 'bg-gray-200 text-gray-600',
        medium: 'bg-blue-300 text-blue-800',
        high: 'bg-blue-500 text-white',
        highest: 'bg-blue-700 text-white'
      }
      return classes[intensity] || 'bg-gray-200 text-gray-600'
    }

    const getRankBadge = (rank) => {
      if (rank === 1) return 'bg-yellow-500'
      if (rank === 2) return 'bg-gray-400'
      if (rank === 3) return 'bg-yellow-600'
      return 'bg-blue-500'
    }

    // Lifecycle
    onMounted(() => {
      loadStatistics()
    })

    return {
      // Data
      selectedTimeRange,
      isRefreshing,
      chartView,
      statistics,
      statusDistribution,
      amountRanges,
      hourlyData,
      weeklyData,
      topUsers,
      insights,
      
      // Methods
      loadStatistics,
      refreshData,
      exportStatistics,
      formatCurrency,
      formatDate,
      getHourIntensity,
      getRankBadge
    }
  }
}
</script>

<style scoped>
.deposit-statistics-container {
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