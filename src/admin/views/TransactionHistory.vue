<template>
  <div class="transaction-history-container">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Lịch sử giao dịch</h1>
          <p class="text-gray-600 mt-1">Theo dõi tất cả giao dịch trong hệ thống với thống kê chi tiết</p>
        </div>
        <div class="flex space-x-3">
          <button @click="exportTransactions" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center">
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

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 text-sm">Tổng giao dịch hôm nay</p>
            <p class="text-2xl font-bold">{{ formatCurrency(stats.todayTotal) }}</p>
          </div>
          <div class="bg-blue-400 bg-opacity-30 rounded-full p-3">
            <i class="fas fa-chart-line text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-100 text-sm">Giao dịch thành công</p>
            <p class="text-2xl font-bold">{{ stats.successCount }}</p>
          </div>
          <div class="bg-green-400 bg-opacity-30 rounded-full p-3">
            <i class="fas fa-check-circle text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-yellow-100 text-sm">Đang xử lý</p>
            <p class="text-2xl font-bold">{{ stats.pendingCount }}</p>
          </div>
          <div class="bg-yellow-400 bg-opacity-30 rounded-full p-3">
            <i class="fas fa-clock text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-red-100 text-sm">Thất bại</p>
            <p class="text-2xl font-bold">{{ stats.failedCount }}</p>
          </div>
          <div class="bg-red-400 bg-opacity-30 rounded-full p-3">
            <i class="fas fa-times-circle text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Loại giao dịch</label>
          <select v-model="filters.type" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">Tất cả</option>
            <option value="deposit">Nạp tiền</option>
            <option value="withdrawal">Rút tiền</option>
            <option value="purchase">Mua hàng</option>
            <option value="refund">Hoàn tiền</option>
            <option value="commission">Hoa hồng</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
          <select v-model="filters.status" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">Tất cả</option>
            <option value="completed">Thành công</option>
            <option value="pending">Đang xử lý</option>
            <option value="failed">Thất bại</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
          <input v-model="filters.fromDate" type="date" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Đến ngày</label>
          <input v-model="filters.toDate" type="date" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
          <div class="relative">
            <input 
              v-model="filters.search" 
              type="text" 
              placeholder="Mã GD, User ID, Email..."
              class="w-full border border-gray-300 rounded-lg px-3 py-2 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
            <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>
        </div>
      </div>

      <div class="flex justify-between items-center mt-4">
        <button @click="resetFilters" class="text-gray-600 hover:text-gray-800 flex items-center">
          <i class="fas fa-undo mr-2"></i>
          Đặt lại bộ lọc
        </button>
        <button @click="applyFilters" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          Áp dụng bộ lọc
        </button>
      </div>
    </div>

    <!-- Transaction Table -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã giao dịch
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người dùng
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại giao dịch
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số tiền
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời gian
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="transaction in paginatedTransactions" :key="transaction.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ transaction.id }}</div>
                <div class="text-sm text-gray-500">{{ transaction.reference }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img class="h-10 w-10 rounded-full" :src="transaction.user.avatar" :alt="transaction.user.name">
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ transaction.user.name }}</div>
                    <div class="text-sm text-gray-500">{{ transaction.user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <i :class="getTransactionIcon(transaction.type)" class="mr-2"></i>
                  <span class="text-sm text-gray-900">{{ getTransactionTypeName(transaction.type) }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium" :class="getAmountColor(transaction.type)">
                  {{ transaction.type === 'withdrawal' || transaction.type === 'purchase' ? '-' : '+' }}{{ formatCurrency(transaction.amount) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(transaction.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ getStatusName(transaction.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div>{{ formatDate(transaction.createdAt) }}</div>
                <div class="text-xs text-gray-400">{{ formatTime(transaction.createdAt) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="viewTransactionDetail(transaction)" class="text-blue-600 hover:text-blue-900 mr-3">
                  <i class="fas fa-eye"></i>
                </button>
                <button v-if="transaction.status === 'pending'" @click="processTransaction(transaction)" class="text-green-600 hover:text-green-900">
                  <i class="fas fa-check"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button @click="previousPage" :disabled="currentPage === 1" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Trước
          </button>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Sau
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Hiển thị <span class="font-medium">{{ startIndex }}</span> đến <span class="font-medium">{{ endIndex }}</span> 
              trong tổng số <span class="font-medium">{{ filteredTransactions.length }}</span> giao dịch
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button @click="previousPage" :disabled="currentPage === 1" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <i class="fas fa-chevron-left"></i>
              </button>
              <button 
                v-for="page in visiblePages" 
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  page === currentPage 
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' 
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
              <button @click="nextPage" :disabled="currentPage === totalPages" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <i class="fas fa-chevron-right"></i>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Transaction Detail Modal -->
    <div v-if="showDetailModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeDetailModal">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white" @click.stop>
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-gray-900">Chi tiết giao dịch</h3>
          <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <div v-if="selectedTransaction" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Mã giao dịch</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedTransaction.id }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Mã tham chiếu</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedTransaction.reference }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Người dùng</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedTransaction.user.name }} ({{ selectedTransaction.user.email }})</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Loại giao dịch</label>
              <p class="mt-1 text-sm text-gray-900">{{ getTransactionTypeName(selectedTransaction.type) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Số tiền</label>
              <p class="mt-1 text-sm font-medium" :class="getAmountColor(selectedTransaction.type)">
                {{ selectedTransaction.type === 'withdrawal' || selectedTransaction.type === 'purchase' ? '-' : '+' }}{{ formatCurrency(selectedTransaction.amount) }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Trạng thái</label>
              <span :class="getStatusClass(selectedTransaction.status)" class="mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ getStatusName(selectedTransaction.status) }}
              </span>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Thời gian tạo</label>
              <p class="mt-1 text-sm text-gray-900">{{ formatDateTime(selectedTransaction.createdAt) }}</p>
            </div>
            <div v-if="selectedTransaction.completedAt">
              <label class="block text-sm font-medium text-gray-700">Thời gian hoàn thành</label>
              <p class="mt-1 text-sm text-gray-900">{{ formatDateTime(selectedTransaction.completedAt) }}</p>
            </div>
          </div>

          <div v-if="selectedTransaction.description">
            <label class="block text-sm font-medium text-gray-700">Mô tả</label>
            <p class="mt-1 text-sm text-gray-900">{{ selectedTransaction.description }}</p>
          </div>

          <div v-if="selectedTransaction.metadata">
            <label class="block text-sm font-medium text-gray-700">Thông tin bổ sung</label>
            <div class="mt-1 bg-gray-50 rounded-lg p-3">
              <pre class="text-sm text-gray-900">{{ JSON.stringify(selectedTransaction.metadata, null, 2) }}</pre>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button @click="closeDetailModal" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
            Đóng
          </button>
          <button v-if="selectedTransaction && selectedTransaction.status === 'pending'" @click="processTransaction(selectedTransaction)" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Xử lý giao dịch
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'

export default {
  name: 'TransactionHistory',
  setup() {
    // Reactive data
    const transactions = ref([])
    const isRefreshing = ref(false)
    const showDetailModal = ref(false)
    const selectedTransaction = ref(null)
    const currentPage = ref(1)
    const itemsPerPage = ref(10)
    const refreshInterval = ref(null)

    // Filters
    const filters = ref({
      type: '',
      status: '',
      fromDate: '',
      toDate: '',
      search: ''
    })

    // Stats
    const stats = ref({
      todayTotal: 0,
      successCount: 0,
      pendingCount: 0,
      failedCount: 0
    })

    // Mock data
    const mockTransactions = [
      {
        id: 'TXN001',
        reference: 'REF001',
        user: {
          name: 'Nguyễn Văn A',
          email: 'nguyenvana@email.com',
          avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=0D8ABC&color=fff'
        },
        type: 'deposit',
        amount: 500000,
        status: 'completed',
        description: 'Nạp tiền vào ví',
        createdAt: new Date('2024-12-19T10:30:00'),
        completedAt: new Date('2024-12-19T10:35:00'),
        metadata: {
          bankAccount: '1234567890',
          bankName: 'ACB'
        }
      },
      {
        id: 'TXN002',
        reference: 'REF002',
        user: {
          name: 'Trần Thị B',
          email: 'tranthib@email.com',
          avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=7C3AED&color=fff'
        },
        type: 'purchase',
        amount: 250000,
        status: 'completed',
        description: 'Mua sản phẩm #SP001',
        createdAt: new Date('2024-12-19T09:15:00'),
        completedAt: new Date('2024-12-19T09:15:00'),
        metadata: {
          productId: 'SP001',
          orderId: 'ORD001'
        }
      },
      {
        id: 'TXN003',
        reference: 'REF003',
        user: {
          name: 'Lê Văn C',
          email: 'levanc@email.com',
          avatar: 'https://ui-avatars.com/api/?name=Le+Van+C&background=059669&color=fff'
        },
        type: 'withdrawal',
        amount: 100000,
        status: 'pending',
        description: 'Rút tiền về tài khoản ngân hàng',
        createdAt: new Date('2024-12-19T08:45:00'),
        metadata: {
          bankAccount: '9876543210',
          bankName: 'Vietcombank'
        }
      },
      {
        id: 'TXN004',
        reference: 'REF004',
        user: {
          name: 'Phạm Thị D',
          email: 'phamthid@email.com',
          avatar: 'https://ui-avatars.com/api/?name=Pham+Thi+D&background=DC2626&color=fff'
        },
        type: 'commission',
        amount: 50000,
        status: 'completed',
        description: 'Hoa hồng từ đơn hàng #ORD002',
        createdAt: new Date('2024-12-18T16:20:00'),
        completedAt: new Date('2024-12-18T16:20:00'),
        metadata: {
          orderId: 'ORD002',
          commissionRate: 0.1
        }
      },
      {
        id: 'TXN005',
        reference: 'REF005',
        user: {
          name: 'Hoàng Văn E',
          email: 'hoangvane@email.com',
          avatar: 'https://ui-avatars.com/api/?name=Hoang+Van+E&background=F59E0B&color=fff'
        },
        type: 'refund',
        amount: 150000,
        status: 'failed',
        description: 'Hoàn tiền đơn hàng #ORD003',
        createdAt: new Date('2024-12-18T14:10:00'),
        metadata: {
          orderId: 'ORD003',
          reason: 'Sản phẩm lỗi'
        }
      }
    ]

    // Computed properties
    const filteredTransactions = computed(() => {
      let filtered = transactions.value

      if (filters.value.type) {
        filtered = filtered.filter(t => t.type === filters.value.type)
      }

      if (filters.value.status) {
        filtered = filtered.filter(t => t.status === filters.value.status)
      }

      if (filters.value.fromDate) {
        const fromDate = new Date(filters.value.fromDate)
        filtered = filtered.filter(t => new Date(t.createdAt) >= fromDate)
      }

      if (filters.value.toDate) {
        const toDate = new Date(filters.value.toDate)
        toDate.setHours(23, 59, 59, 999)
        filtered = filtered.filter(t => new Date(t.createdAt) <= toDate)
      }

      if (filters.value.search) {
        const search = filters.value.search.toLowerCase()
        filtered = filtered.filter(t => 
          t.id.toLowerCase().includes(search) ||
          t.reference.toLowerCase().includes(search) ||
          t.user.name.toLowerCase().includes(search) ||
          t.user.email.toLowerCase().includes(search)
        )
      }

      return filtered
    })

    const totalPages = computed(() => Math.ceil(filteredTransactions.value.length / itemsPerPage.value))

    const paginatedTransactions = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredTransactions.value.slice(start, end)
    })

    const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
    const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredTransactions.value.length))

    const visiblePages = computed(() => {
      const pages = []
      const start = Math.max(1, currentPage.value - 2)
      const end = Math.min(totalPages.value, currentPage.value + 2)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      return pages
    })

    // Methods
    const loadTransactions = () => {
      transactions.value = mockTransactions
      calculateStats()
    }

    const calculateStats = () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const todayTransactions = transactions.value.filter(t => {
        const transactionDate = new Date(t.createdAt)
        return transactionDate >= today && transactionDate < tomorrow
      })

      stats.value = {
        todayTotal: todayTransactions.reduce((sum, t) => sum + t.amount, 0),
        successCount: transactions.value.filter(t => t.status === 'completed').length,
        pendingCount: transactions.value.filter(t => t.status === 'pending').length,
        failedCount: transactions.value.filter(t => t.status === 'failed').length
      }
    }

    const refreshData = async () => {
      isRefreshing.value = true
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      loadTransactions()
      isRefreshing.value = false
    }

    const resetFilters = () => {
      filters.value = {
        type: '',
        status: '',
        fromDate: '',
        toDate: '',
        search: ''
      }
      currentPage.value = 1
    }

    const applyFilters = () => {
      currentPage.value = 1
    }

    const viewTransactionDetail = (transaction) => {
      selectedTransaction.value = transaction
      showDetailModal.value = true
    }

    const closeDetailModal = () => {
      showDetailModal.value = false
      selectedTransaction.value = null
    }

    const processTransaction = async (transaction) => {
      // Simulate processing
      transaction.status = 'completed'
      transaction.completedAt = new Date()
      calculateStats()
      closeDetailModal()
    }

    const exportTransactions = () => {
      // Simulate export
      alert('Tính năng xuất Excel sẽ được triển khai sau!')
    }

    // Pagination methods
    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    const goToPage = (page) => {
      currentPage.value = page
    }

    // Utility methods
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(amount)
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('vi-VN')
    }

    const formatTime = (date) => {
      return new Date(date).toLocaleTimeString('vi-VN')
    }

    const formatDateTime = (date) => {
      return new Date(date).toLocaleString('vi-VN')
    }

    const getTransactionIcon = (type) => {
      const icons = {
        deposit: 'fas fa-plus-circle text-green-500',
        withdrawal: 'fas fa-minus-circle text-red-500',
        purchase: 'fas fa-shopping-cart text-blue-500',
        refund: 'fas fa-undo text-yellow-500',
        commission: 'fas fa-percentage text-purple-500'
      }
      return icons[type] || 'fas fa-circle text-gray-500'
    }

    const getTransactionTypeName = (type) => {
      const names = {
        deposit: 'Nạp tiền',
        withdrawal: 'Rút tiền',
        purchase: 'Mua hàng',
        refund: 'Hoàn tiền',
        commission: 'Hoa hồng'
      }
      return names[type] || type
    }

    const getStatusClass = (status) => {
      const classes = {
        completed: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        failed: 'bg-red-100 text-red-800',
        cancelled: 'bg-gray-100 text-gray-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    }

    const getStatusName = (status) => {
      const names = {
        completed: 'Thành công',
        pending: 'Đang xử lý',
        failed: 'Thất bại',
        cancelled: 'Đã hủy'
      }
      return names[status] || status
    }

    const getAmountColor = (type) => {
      return type === 'withdrawal' || type === 'purchase' ? 'text-red-600' : 'text-green-600'
    }

    // Lifecycle
    onMounted(() => {
      loadTransactions()
      // Auto refresh every 30 seconds
      refreshInterval.value = setInterval(refreshData, 30000)
    })

    onUnmounted(() => {
      if (refreshInterval.value) {
        clearInterval(refreshInterval.value)
      }
    })

    return {
      // Data
      transactions,
      isRefreshing,
      showDetailModal,
      selectedTransaction,
      currentPage,
      itemsPerPage,
      filters,
      stats,
      
      // Computed
      filteredTransactions,
      totalPages,
      paginatedTransactions,
      startIndex,
      endIndex,
      visiblePages,
      
      // Methods
      refreshData,
      resetFilters,
      applyFilters,
      viewTransactionDetail,
      closeDetailModal,
      processTransaction,
      exportTransactions,
      previousPage,
      nextPage,
      goToPage,
      formatCurrency,
      formatDate,
      formatTime,
      formatDateTime,
      getTransactionIcon,
      getTransactionTypeName,
      getStatusClass,
      getStatusName,
      getAmountColor
    }
  }
}
</script>

<style scoped>
.transaction-history-container {
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