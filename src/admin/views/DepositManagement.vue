<template>
  <div class="bg-gray-50 min-h-screen pb-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-indigo-800">
          <i class="fas fa-money-bill-wave mr-3 text-indigo-600"></i>
          Quản lý yêu cầu nạp tiền
        </h1>
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-600">Tự động làm mới sau: {{ autoRefreshTimer }}s</span>
          <button 
            @click="toggleAutoRefresh"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <i class="fas fa-sync-alt mr-2"></i>
            {{ autoRefresh ? 'Tắt' : 'Bật' }} tự động làm mới
          </button>
        </div>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center my-12 py-12">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
        <p class="text-indigo-600 font-medium">Đang tải dữ liệu...</p>
      </div>

      <div v-else>
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <i class="fas fa-clock text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-gray-500 text-sm">Chờ xử lý</p>
                <p class="text-2xl font-semibold">{{ stats.pending }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-green-100 text-green-600">
                <i class="fas fa-check-circle text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-gray-500 text-sm">Đã duyệt</p>
                <p class="text-2xl font-semibold">{{ stats.approved }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-red-100 text-red-600">
                <i class="fas fa-times-circle text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-gray-500 text-sm">Từ chối</p>
                <p class="text-2xl font-semibold">{{ stats.rejected }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                <i class="fas fa-money-bill-wave text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-gray-500 text-sm">Tổng tiền hôm nay</p>
                <p class="text-2xl font-semibold">{{ formatCurrency(stats.todayTotal) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
              <select 
                v-model="filters.status" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">Tất cả</option>
                <option value="pending">Chờ xử lý</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Từ chối</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
              <input 
                v-model="filters.fromDate" 
                type="date" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Đến ngày</label>
              <input 
                v-model="filters.toDate" 
                type="date" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
              <input 
                v-model="filters.search" 
                type="text" 
                placeholder="Mã yêu cầu, tên user..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
            </div>
            
            <div class="flex items-end">
              <button 
                @click="resetFilters"
                class="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <i class="fas fa-refresh mr-2"></i>
                Đặt lại
              </button>
            </div>
          </div>
        </div>

        <!-- Deposit Requests Table -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold">Danh sách yêu cầu nạp tiền</h2>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-600">
                  {{ filteredRequests.length }} yêu cầu
                </span>
                <button 
                  @click="exportToExcel"
                  class="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                >
                  <i class="fas fa-file-excel mr-1"></i>
                  Xuất Excel
                </button>
              </div>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã yêu cầu
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người dùng
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
                    Chứng từ
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr 
                  v-for="request in paginatedRequests" 
                  :key="request.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ request.id }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img 
                          class="h-10 w-10 rounded-full" 
                          :src="request.user.avatar || '/default-avatar.png'" 
                          :alt="request.user.name"
                        >
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ request.user.name }}</div>
                        <div class="text-sm text-gray-500">{{ request.user.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-semibold text-gray-900">{{ formatCurrency(request.amount) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getStatusClass(request.status)"
                    >
                      {{ getStatusText(request.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{{ formatDateTime(request.createdAt) }}</div>
                    <div class="text-xs text-gray-500">
                      {{ getTimeAgo(request.createdAt) }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div v-if="request.proofImage" class="flex items-center space-x-2">
                      <button 
                        @click="viewProofImage(request.proofImage)"
                        class="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <i class="fas fa-image mr-1"></i>
                        Xem ảnh
                      </button>
                    </div>
                    <div v-else class="text-sm text-gray-500">
                      Chưa có
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      @click="viewRequestDetail(request)"
                      class="text-blue-600 hover:text-blue-800"
                    >
                      <i class="fas fa-eye mr-1"></i>
                      Chi tiết
                    </button>
                    <button 
                      v-if="request.status === 'pending'"
                      @click="approveRequest(request)"
                      class="text-green-600 hover:text-green-800"
                    >
                      <i class="fas fa-check mr-1"></i>
                      Duyệt
                    </button>
                    <button 
                      v-if="request.status === 'pending'"
                      @click="rejectRequest(request)"
                      class="text-red-600 hover:text-red-800"
                    >
                      <i class="fas fa-times mr-1"></i>
                      Từ chối
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="px-6 py-4 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-700">
                Hiển thị {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, filteredRequests.length) }} 
                trong tổng số {{ filteredRequests.length }} yêu cầu
              </div>
              <div class="flex items-center space-x-2">
                <button 
                  @click="currentPage--"
                  :disabled="currentPage === 1"
                  class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                <span class="text-sm text-gray-700">
                  Trang {{ currentPage }} / {{ totalPages }}
                </span>
                <button 
                  @click="currentPage++"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Request Detail Modal -->
    <div v-if="showDetailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Chi tiết yêu cầu nạp tiền</h3>
            <button 
              @click="showDetailModal = false"
              class="text-gray-400 hover:text-gray-600"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <div v-if="selectedRequest" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- User Info -->
            <div class="space-y-4">
              <h4 class="font-semibold text-gray-800">Thông tin người dùng</h4>
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center space-x-4">
                  <img 
                    class="h-16 w-16 rounded-full" 
                    :src="selectedRequest.user.avatar || '/default-avatar.png'" 
                    :alt="selectedRequest.user.name"
                  >
                  <div>
                    <div class="font-medium text-gray-900">{{ selectedRequest.user.name }}</div>
                    <div class="text-sm text-gray-500">{{ selectedRequest.user.email }}</div>
                    <div class="text-sm text-gray-500">ID: {{ selectedRequest.user.id }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Request Info -->
            <div class="space-y-4">
              <h4 class="font-semibold text-gray-800">Thông tin yêu cầu</h4>
              <div class="bg-gray-50 rounded-lg p-4 space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Mã yêu cầu:</span>
                  <span class="font-medium">{{ selectedRequest.id }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Số tiền:</span>
                  <span class="font-medium text-lg">{{ formatCurrency(selectedRequest.amount) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Trạng thái:</span>
                  <span 
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="getStatusClass(selectedRequest.status)"
                  >
                    {{ getStatusText(selectedRequest.status) }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Thời gian:</span>
                  <span class="font-medium">{{ formatDateTime(selectedRequest.createdAt) }}</span>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="md:col-span-2" v-if="selectedRequest.description">
              <h4 class="font-semibold text-gray-800 mb-3">Mô tả</h4>
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-gray-700">{{ selectedRequest.description }}</p>
              </div>
            </div>

            <!-- Proof Image -->
            <div class="md:col-span-2" v-if="selectedRequest.proofImage">
              <h4 class="font-semibold text-gray-800 mb-3">Chứng từ chuyển khoản</h4>
              <div class="bg-gray-50 rounded-lg p-4">
                <img 
                  :src="selectedRequest.proofImage" 
                  :alt="'Chứng từ ' + selectedRequest.id"
                  class="max-w-full h-auto rounded-lg"
                >
              </div>
            </div>

            <!-- Actions -->
            <div class="md:col-span-2" v-if="selectedRequest.status === 'pending'">
              <h4 class="font-semibold text-gray-800 mb-3">Thao tác</h4>
              <div class="flex space-x-4">
                <button 
                  @click="approveRequest(selectedRequest)"
                  class="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <i class="fas fa-check mr-2"></i>
                  Duyệt yêu cầu
                </button>
                <button 
                  @click="showRejectModal = true"
                  class="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <i class="fas fa-times mr-2"></i>
                  Từ chối yêu cầu
                </button>
              </div>
            </div>

            <!-- Processing History -->
            <div class="md:col-span-2" v-if="selectedRequest.history && selectedRequest.history.length > 0">
              <h4 class="font-semibold text-gray-800 mb-3">Lịch sử xử lý</h4>
              <div class="bg-gray-50 rounded-lg p-4">
                <div 
                  v-for="item in selectedRequest.history" 
                  :key="item.id"
                  class="flex items-center space-x-4 py-2"
                >
                  <div class="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div class="flex-1">
                    <div class="text-sm font-medium">{{ item.action }}</div>
                    <div class="text-xs text-gray-500">{{ formatDateTime(item.timestamp) }} - {{ item.admin }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-md w-full mx-4">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold">Từ chối yêu cầu</h3>
        </div>
        <div class="p-6">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Lý do từ chối *</label>
            <textarea 
              v-model="rejectReason"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Nhập lý do từ chối..."
              required
            ></textarea>
          </div>
          <div class="flex space-x-4">
            <button 
              @click="confirmReject"
              class="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Xác nhận từ chối
            </button>
            <button 
              @click="showRejectModal = false; rejectReason = ''"
              class="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Viewer Modal -->
    <div v-if="showImageModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div class="max-w-4xl max-h-[90vh] mx-4">
        <div class="relative">
          <button 
            @click="showImageModal = false"
            class="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <i class="fas fa-times text-2xl"></i>
          </button>
          <img 
            :src="selectedImage" 
            alt="Chứng từ"
            class="max-w-full max-h-full rounded-lg"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Swal from 'sweetalert2'

export default {
  name: 'DepositManagement',
  setup() {
    const loading = ref(false)
    const showDetailModal = ref(false)
    const showRejectModal = ref(false)
    const showImageModal = ref(false)
    const selectedRequest = ref(null)
    const selectedImage = ref('')
    const rejectReason = ref('')
    const currentPage = ref(1)
    const pageSize = ref(10)
    const autoRefresh = ref(true)
    const autoRefreshTimer = ref(30)
    
    const filters = ref({
      status: 'all',
      fromDate: '',
      toDate: '',
      search: ''
    })

    // Mock data
    const depositRequests = ref([
      {
        id: 'DEP001',
        user: {
          id: 'USER001',
          name: 'Nguyễn Văn A',
          email: 'user1@example.com',
          avatar: ''
        },
        amount: 500000,
        status: 'pending',
        description: 'Nạp tiền khẩn cấp',
        proofImage: 'https://via.placeholder.com/400x300/4f46e5/ffffff?text=Bank+Transfer',
        createdAt: '2024-01-15T10:30:00Z',
        history: [
          {
            id: 1,
            action: 'Tạo yêu cầu nạp tiền',
            timestamp: '2024-01-15T10:30:00Z',
            admin: 'Hệ thống'
          }
        ]
      },
      {
        id: 'DEP002',
        user: {
          id: 'USER002',
          name: 'Trần Thị B',
          email: 'user2@example.com',
          avatar: ''
        },
        amount: 1000000,
        status: 'approved',
        description: 'Nạp tiền mua hàng',
        proofImage: 'https://via.placeholder.com/400x300/10b981/ffffff?text=Approved',
        createdAt: '2024-01-14T15:45:00Z',
        processedAt: '2024-01-14T16:00:00Z',
        history: [
          {
            id: 1,
            action: 'Tạo yêu cầu nạp tiền',
            timestamp: '2024-01-14T15:45:00Z',
            admin: 'Hệ thống'
          },
          {
            id: 2,
            action: 'Duyệt yêu cầu nạp tiền',
            timestamp: '2024-01-14T16:00:00Z',
            admin: 'Admin'
          }
        ]
      },
      {
        id: 'DEP003',
        user: {
          id: 'USER003',
          name: 'Lê Văn C',
          email: 'user3@example.com',
          avatar: ''
        },
        amount: 200000,
        status: 'rejected',
        description: 'Nạp tiền test',
        proofImage: '',
        createdAt: '2024-01-13T09:15:00Z',
        processedAt: '2024-01-13T09:30:00Z',
        rejectReason: 'Không có chứng từ chuyển khoản',
        history: [
          {
            id: 1,
            action: 'Tạo yêu cầu nạp tiền',
            timestamp: '2024-01-13T09:15:00Z',
            admin: 'Hệ thống'
          },
          {
            id: 2,
            action: 'Từ chối yêu cầu: Không có chứng từ chuyển khoản',
            timestamp: '2024-01-13T09:30:00Z',
            admin: 'Admin'
          }
        ]
      }
    ])

    // Computed properties
    const stats = computed(() => {
      const requests = depositRequests.value
      const today = new Date().toDateString()
      
      return {
        pending: requests.filter(r => r.status === 'pending').length,
        approved: requests.filter(r => r.status === 'approved').length,
        rejected: requests.filter(r => r.status === 'rejected').length,
        todayTotal: requests
          .filter(r => new Date(r.createdAt).toDateString() === today)
          .reduce((sum, r) => sum + r.amount, 0)
      }
    })

    const filteredRequests = computed(() => {
      let filtered = depositRequests.value

      // Filter by status
      if (filters.value.status !== 'all') {
        filtered = filtered.filter(r => r.status === filters.value.status)
      }

      // Filter by date range
      if (filters.value.fromDate) {
        filtered = filtered.filter(r => new Date(r.createdAt) >= new Date(filters.value.fromDate))
      }
      if (filters.value.toDate) {
        filtered = filtered.filter(r => new Date(r.createdAt) <= new Date(filters.value.toDate))
      }

      // Filter by search
      if (filters.value.search) {
        const search = filters.value.search.toLowerCase()
        filtered = filtered.filter(r => 
          r.id.toLowerCase().includes(search) ||
          r.user.name.toLowerCase().includes(search) ||
          r.user.email.toLowerCase().includes(search)
        )
      }

      return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    })

    const paginatedRequests = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return filteredRequests.value.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredRequests.value.length / pageSize.value)
    })

    // Methods
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
      }).format(value)
    }

    const formatDateTime = (dateString) => {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    }

    const getTimeAgo = (dateString) => {
      const now = new Date()
      const date = new Date(dateString)
      const diff = now - date
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(minutes / 60)
      const days = Math.floor(hours / 24)

      if (days > 0) return `${days} ngày trước`
      if (hours > 0) return `${hours} giờ trước`
      if (minutes > 0) return `${minutes} phút trước`
      return 'Vừa xong'
    }

    const getStatusClass = (status) => {
      switch (status) {
        case 'pending':
          return 'bg-yellow-100 text-yellow-800'
        case 'approved':
          return 'bg-green-100 text-green-800'
        case 'rejected':
          return 'bg-red-100 text-red-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }

    const getStatusText = (status) => {
      switch (status) {
        case 'pending':
          return 'Chờ xử lý'
        case 'approved':
          return 'Đã duyệt'
        case 'rejected':
          return 'Từ chối'
        default:
          return 'Không xác định'
      }
    }

    const resetFilters = () => {
      filters.value = {
        status: 'all',
        fromDate: '',
        toDate: '',
        search: ''
      }
      currentPage.value = 1
    }

    const viewRequestDetail = (request) => {
      selectedRequest.value = request
      showDetailModal.value = true
    }

    const viewProofImage = (imageUrl) => {
      selectedImage.value = imageUrl
      showImageModal.value = true
    }

    const approveRequest = async (request) => {
      const result = await Swal.fire({
        title: 'Xác nhận duyệt yêu cầu?',
        text: `Bạn có chắc chắn muốn duyệt yêu cầu nạp ${formatCurrency(request.amount)} cho ${request.user.name}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Duyệt',
        cancelButtonText: 'Hủy'
      })

      if (result.isConfirmed) {
        loading.value = true
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500))
          
          // Update request status
          request.status = 'approved'
          request.processedAt = new Date().toISOString()
          request.history.push({
            id: request.history.length + 1,
            action: 'Duyệt yêu cầu nạp tiền',
            timestamp: new Date().toISOString(),
            admin: 'Admin'
          })
          
          Swal.fire({
            title: 'Đã duyệt!',
            text: 'Yêu cầu nạp tiền đã được duyệt thành công.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          })
          
          showDetailModal.value = false
          
        } catch (error) {
          Swal.fire({
            title: 'Lỗi!',
            text: 'Có lỗi xảy ra khi duyệt yêu cầu.',
            icon: 'error'
          })
        } finally {
          loading.value = false
        }
      }
    }

    const rejectRequest = (request) => {
      selectedRequest.value = request
      showRejectModal.value = true
    }

    const confirmReject = async () => {
      if (!rejectReason.value.trim()) {
        Swal.fire({
          title: 'Lỗi!',
          text: 'Vui lòng nhập lý do từ chối.',
          icon: 'error'
        })
        return
      }

      loading.value = true
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Update request status
        selectedRequest.value.status = 'rejected'
        selectedRequest.value.processedAt = new Date().toISOString()
        selectedRequest.value.rejectReason = rejectReason.value
        selectedRequest.value.history.push({
          id: selectedRequest.value.history.length + 1,
          action: `Từ chối yêu cầu: ${rejectReason.value}`,
          timestamp: new Date().toISOString(),
          admin: 'Admin'
        })
        
        Swal.fire({
          title: 'Đã từ chối!',
          text: 'Yêu cầu nạp tiền đã được từ chối.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
        
        showRejectModal.value = false
        showDetailModal.value = false
        rejectReason.value = ''
        
      } catch (error) {
        Swal.fire({
          title: 'Lỗi!',
          text: 'Có lỗi xảy ra khi từ chối yêu cầu.',
          icon: 'error'
        })
      } finally {
        loading.value = false
      }
    }

    const exportToExcel = () => {
      Swal.fire({
        title: 'Xuất Excel',
        text: 'Tính năng xuất Excel đang được phát triển.',
        icon: 'info'
      })
    }

    const toggleAutoRefresh = () => {
      autoRefresh.value = !autoRefresh.value
      if (autoRefresh.value) {
        autoRefreshTimer.value = 30
      }
    }

    // Auto refresh
    let refreshInterval = null
    
    onMounted(() => {
      refreshInterval = setInterval(() => {
        if (autoRefresh.value) {
          autoRefreshTimer.value--
          if (autoRefreshTimer.value <= 0) {
            // Refresh data here
            autoRefreshTimer.value = 30
          }
        }
      }, 1000)
    })

    onUnmounted(() => {
      if (refreshInterval) {
        clearInterval(refreshInterval)
      }
    })

    return {
      loading,
      showDetailModal,
      showRejectModal,
      showImageModal,
      selectedRequest,
      selectedImage,
      rejectReason,
      currentPage,
      pageSize,
      autoRefresh,
      autoRefreshTimer,
      filters,
      depositRequests,
      stats,
      filteredRequests,
      paginatedRequests,
      totalPages,
      formatCurrency,
      formatDateTime,
      getTimeAgo,
      getStatusClass,
      getStatusText,
      resetFilters,
      viewRequestDetail,
      viewProofImage,
      approveRequest,
      rejectRequest,
      confirmReject,
      exportToExcel,
      toggleAutoRefresh
    }
  }
}
</script>

<style scoped>
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
</style>