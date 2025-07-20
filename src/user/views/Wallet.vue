<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <button @click="$router.go(-1)" class="flex items-center text-gray-600 hover:text-gray-900">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Quay lại
          </button>
          <h1 class="text-lg font-semibold">Ví của tôi</h1>
          <div class="w-20"></div>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Wallet Balance Card -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-medium opacity-90">Số dư ví</h2>
            <p class="text-4xl font-bold mt-2">{{ formatPrice(walletBalance) }}</p>
            <p class="text-sm opacity-80 mt-1">Số tiền có thể rút: {{ formatPrice(availableBalance) }}</p>
          </div>
          <div class="text-right">
            <svg class="w-16 h-16 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="flex space-x-4 mt-6">
          <button 
            @click="$router.push('/deposit')"
            class="flex-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg py-3 px-4 hover:bg-opacity-30 transition-all"
          >
            <svg class="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span class="text-sm font-medium">Nạp tiền</span>
          </button>
          
          <button 
            @click="$router.push('/withdrawal')"
            class="flex-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg py-3 px-4 hover:bg-opacity-30 transition-all"
          >
            <svg class="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4m16 0l-4-4m4 4l-4 4"></path>
            </svg>
            <span class="text-sm font-medium">Rút tiền</span>
          </button>
          
          <button 
            @click="$router.push('/transfer')"
            class="flex-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg py-3 px-4 hover:bg-opacity-30 transition-all"
          >
            <svg class="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
            </svg>
            <span class="text-sm font-medium">Chuyển tiền</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Statistics -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Monthly Statistics -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="font-semibold mb-4">Thống kê tháng này</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span class="text-sm text-gray-600">Tiền vào</span>
                </div>
                <span class="font-medium text-green-600">{{ formatPrice(monthlyStats.income) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <span class="text-sm text-gray-600">Tiền ra</span>
                </div>
                <span class="font-medium text-red-600">{{ formatPrice(monthlyStats.expense) }}</span>
              </div>
              <div class="flex items-center justify-between pt-2 border-t">
                <span class="text-sm font-medium text-gray-700">Chênh lệch</span>
                <span 
                  class="font-medium"
                  :class="monthlyStats.income - monthlyStats.expense >= 0 ? 'text-green-600' : 'text-red-600'"
                >
                  {{ formatPrice(monthlyStats.income - monthlyStats.expense) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-white rounded-lg shadow-sm p-4">
              <div class="text-2xl font-bold text-blue-600">{{ totalTransactions }}</div>
              <div class="text-sm text-gray-600">Giao dịch</div>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-4">
              <div class="text-2xl font-bold text-purple-600">{{ loyaltyPoints.toLocaleString() }}</div>
              <div class="text-sm text-gray-600">Điểm thưởng</div>
            </div>
          </div>

          <!-- Loyalty Program -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="font-semibold mb-4">Chương trình thành viên</h3>
            <div class="text-center">
              <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
              <div class="font-medium text-yellow-600">Thành viên Vàng</div>
              <div class="text-sm text-gray-600 mt-1">{{ loyaltyPoints.toLocaleString() }} điểm</div>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div class="bg-yellow-600 h-2 rounded-full" :style="`width: ${(loyaltyPoints % 10000) / 100}%`"></div>
              </div>
              <div class="text-xs text-gray-500 mt-1">
                {{ 10000 - (loyaltyPoints % 10000) }} điểm nữa để lên Bạch Kim
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Transaction History -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold">Lịch sử giao dịch</h3>
                <div class="flex space-x-2">
                  <select 
                    v-model="filterType"
                    class="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Tất cả</option>
                    <option value="deposit">Nạp tiền</option>
                    <option value="withdrawal">Rút tiền</option>
                    <option value="transfer">Chuyển tiền</option>
                    <option value="payment">Thanh toán</option>
                    <option value="refund">Hoàn tiền</option>
                  </select>
                  <select 
                    v-model="filterPeriod"
                    class="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Tất cả</option>
                    <option value="today">Hôm nay</option>
                    <option value="week">Tuần này</option>
                    <option value="month">Tháng này</option>
                    <option value="quarter">Quý này</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="divide-y divide-gray-200">
              <div 
                v-for="transaction in filteredTransactions" 
                :key="transaction.id"
                class="p-6 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4">
                    <div 
                      class="w-12 h-12 rounded-full flex items-center justify-center"
                      :class="getTransactionIconClass(transaction.type)"
                    >
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path 
                          stroke-linecap="round" 
                          stroke-linejoin="round" 
                          stroke-width="2" 
                          :d="getTransactionIcon(transaction.type)"
                        ></path>
                      </svg>
                    </div>
                    
                    <div>
                      <div class="font-medium">{{ transaction.description }}</div>
                      <div class="text-sm text-gray-500">
                        {{ formatDateTime(transaction.createdAt) }}
                      </div>
                      <div v-if="transaction.reference" class="text-xs text-gray-400">
                        Mã GD: {{ transaction.reference }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="text-right">
                    <div 
                      class="font-semibold"
                      :class="transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'"
                    >
                      {{ transaction.amount >= 0 ? '+' : '' }}{{ formatPrice(transaction.amount) }}
                    </div>
                    <div 
                      class="text-xs px-2 py-1 rounded-full inline-block mt-1"
                      :class="getStatusClass(transaction.status)"
                    >
                      {{ getStatusText(transaction.status) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div class="p-6 border-t border-gray-200">
              <div class="flex items-center justify-between">
                <div class="text-sm text-gray-500">
                  Hiển thị {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, totalTransactions) }} 
                  trong tổng số {{ totalTransactions }} giao dịch
                </div>
                <div class="flex space-x-2">
                  <button 
                    @click="currentPage--"
                    :disabled="currentPage === 1"
                    class="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>
                  <button 
                    @click="currentPage++"
                    :disabled="currentPage * pageSize >= totalTransactions"
                    class="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WalletView',
  data() {
    return {
      walletBalance: 2500000,
      availableBalance: 2300000,
      loyaltyPoints: 8750,
      filterType: 'all',
      filterPeriod: 'all',
      currentPage: 1,
      pageSize: 10,
      monthlyStats: {
        income: 3500000,
        expense: 1200000
      },
      transactions: [
        {
          id: 1,
          type: 'deposit',
          description: 'Nạp tiền vào ví',
          amount: 500000,
          status: 'completed',
          reference: 'DEP001',
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          type: 'payment',
          description: 'Thanh toán đơn hàng #12345',
          amount: -299000,
          status: 'completed',
          reference: 'PAY001',
          createdAt: '2024-01-14T15:45:00Z'
        },
        {
          id: 3,
          type: 'withdrawal',
          description: 'Rút tiền về tài khoản ngân hàng',
          amount: -1000000,
          status: 'pending',
          reference: 'WIT001',
          createdAt: '2024-01-13T09:15:00Z'
        },
        {
          id: 4,
          type: 'refund',
          description: 'Hoàn tiền đơn hàng #12340',
          amount: 150000,
          status: 'completed',
          reference: 'REF001',
          createdAt: '2024-01-12T14:20:00Z'
        },
        {
          id: 5,
          type: 'transfer',
          description: 'Chuyển tiền cho Nguyễn Văn B',
          amount: -200000,
          status: 'completed',
          reference: 'TRF001',
          createdAt: '2024-01-11T11:00:00Z'
        }
      ]
    }
  },
  computed: {
    totalTransactions() {
      return this.filteredTransactions.length
    },
    filteredTransactions() {
      let filtered = this.transactions

      if (this.filterType !== 'all') {
        filtered = filtered.filter(t => t.type === this.filterType)
      }

      if (this.filterPeriod !== 'all') {
        const now = new Date()
        const filterDate = new Date()
        
        switch (this.filterPeriod) {
          case 'today':
            filterDate.setHours(0, 0, 0, 0)
            break
          case 'week':
            filterDate.setDate(now.getDate() - 7)
            break
          case 'month':
            filterDate.setMonth(now.getMonth() - 1)
            break
          case 'quarter':
            filterDate.setMonth(now.getMonth() - 3)
            break
        }
        
        filtered = filtered.filter(t => new Date(t.createdAt) >= filterDate)
      }

      return filtered.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price)
    },
    formatDateTime(dateTime) {
      return new Date(dateTime).toLocaleString('vi-VN')
    },
    getTransactionIconClass(type) {
      switch (type) {
        case 'deposit':
          return 'bg-green-100 text-green-600'
        case 'withdrawal':
          return 'bg-red-100 text-red-600'
        case 'transfer':
          return 'bg-blue-100 text-blue-600'
        case 'payment':
          return 'bg-purple-100 text-purple-600'
        case 'refund':
          return 'bg-yellow-100 text-yellow-600'
        default:
          return 'bg-gray-100 text-gray-600'
      }
    },
    getTransactionIcon(type) {
      switch (type) {
        case 'deposit':
          return 'M12 6v6m0 0v6m0-6h6m-6 0H6'
        case 'withdrawal':
          return 'M20 12H4m16 0l-4-4m4 4l-4 4'
        case 'transfer':
          return 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'
        case 'payment':
          return 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
        case 'refund':
          return 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6'
        default:
          return 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
      }
    },
    getStatusClass(status) {
      switch (status) {
        case 'completed':
          return 'bg-green-100 text-green-800'
        case 'pending':
          return 'bg-yellow-100 text-yellow-800'
        case 'failed':
          return 'bg-red-100 text-red-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    },
    getStatusText(status) {
      switch (status) {
        case 'completed':
          return 'Hoàn thành'
        case 'pending':
          return 'Đang xử lý'
        case 'failed':
          return 'Thất bại'
        default:
          return 'Không xác định'
      }
    }
  }
}
</script>