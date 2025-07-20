<template>
  <div class="order-history-container">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Lịch sử đơn hàng</h1>
          <p class="text-gray-600 mt-1">Theo dõi tất cả đơn hàng của bạn</p>
        </div>
        <button @click="refreshOrders" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <i class="fas fa-sync-alt mr-2" :class="{ 'animate-spin': isRefreshing }"></i>
          Làm mới
        </button>
      </div>
    </div>

    <!-- Order Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 text-sm">Tổng đơn hàng</p>
            <p class="text-2xl font-bold">{{ orderStats.total }}</p>
          </div>
          <div class="bg-blue-400 bg-opacity-30 rounded-full p-3">
            <i class="fas fa-shopping-cart text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-100 text-sm">Hoàn thành</p>
            <p class="text-2xl font-bold">{{ orderStats.completed }}</p>
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
            <p class="text-2xl font-bold">{{ orderStats.processing }}</p>
          </div>
          <div class="bg-yellow-400 bg-opacity-30 rounded-full p-3">
            <i class="fas fa-clock text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-100 text-sm">Tổng chi tiêu</p>
            <p class="text-2xl font-bold">{{ formatCurrency(orderStats.totalSpent) }}</p>
          </div>
          <div class="bg-purple-400 bg-opacity-30 rounded-full p-3">
            <i class="fas fa-dollar-sign text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
          <select v-model="filters.status" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">Tất cả</option>
            <option value="pending">Chờ xử lý</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="processing">Đang xử lý</option>
            <option value="shipping">Đang giao</option>
            <option value="delivered">Đã giao</option>
            <option value="cancelled">Đã hủy</option>
            <option value="returned">Đã trả</option>
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
              placeholder="Mã đơn hàng, sản phẩm..."
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

    <!-- Orders List -->
    <div class="space-y-6">
      <div v-for="order in paginatedOrders" :key="order.id" class="bg-white rounded-lg shadow-sm overflow-hidden">
        <!-- Order Header -->
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Đơn hàng #{{ order.id }}</h3>
                <p class="text-sm text-gray-500">Đặt ngày {{ formatDate(order.createdAt) }}</p>
              </div>
              <span :class="getStatusClass(order.status)" class="px-3 py-1 rounded-full text-sm font-medium">
                {{ getStatusName(order.status) }}
              </span>
            </div>
            <div class="text-right">
              <p class="text-lg font-bold text-gray-900">{{ formatCurrency(order.total) }}</p>
              <p class="text-sm text-gray-500">{{ order.items.length }} sản phẩm</p>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="px-6 py-4">
          <div class="space-y-4">
            <div v-for="item in order.items" :key="item.id" class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <img :src="item.image" :alt="item.name" class="w-16 h-16 object-cover rounded-lg">
              </div>
              <div class="flex-1">
                <h4 class="text-sm font-medium text-gray-900">{{ item.name }}</h4>
                <p class="text-sm text-gray-500">{{ item.variant }}</p>
                <p class="text-sm text-gray-500">Số lượng: {{ item.quantity }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">{{ formatCurrency(item.price) }}</p>
                <p class="text-xs text-gray-500">{{ formatCurrency(item.price * item.quantity) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Actions -->
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-2">
              <button @click="viewOrderDetail(order)" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                <i class="fas fa-eye mr-1"></i>
                Xem chi tiết
              </button>
              <button v-if="order.status === 'delivered'" @click="reorder(order)" class="text-green-600 hover:text-green-800 text-sm font-medium">
                <i class="fas fa-redo mr-1"></i>
                Đặt lại
              </button>
              <button v-if="canCancel(order.status)" @click="cancelOrder(order)" class="text-red-600 hover:text-red-800 text-sm font-medium">
                <i class="fas fa-times mr-1"></i>
                Hủy đơn
              </button>
            </div>
            <div class="flex items-center space-x-2">
              <button v-if="order.status === 'delivered'" @click="rateOrder(order)" class="text-yellow-600 hover:text-yellow-800 text-sm font-medium">
                <i class="fas fa-star mr-1"></i>
                Đánh giá
              </button>
              <button @click="trackOrder(order)" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                <i class="fas fa-truck mr-1"></i>
                Theo dõi
              </button>
            </div>
          </div>
        </div>

        <!-- Order Timeline -->
        <div v-if="order.showTimeline" class="px-6 py-4 border-t border-gray-200">
          <h4 class="text-sm font-medium text-gray-900 mb-3">Lịch sử đơn hàng</h4>
          <div class="space-y-3">
            <div v-for="event in order.timeline" :key="event.id" class="flex items-start space-x-3">
              <div :class="event.completed ? 'bg-green-500' : 'bg-gray-300'" class="w-3 h-3 rounded-full mt-1"></div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">{{ event.title }}</p>
                <p class="text-xs text-gray-500">{{ event.description }}</p>
                <p class="text-xs text-gray-400">{{ formatDateTime(event.timestamp) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredOrders.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
      <div class="text-gray-400 mb-4">
        <i class="fas fa-shopping-cart text-6xl"></i>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
      <p class="text-gray-500 mb-6">Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!</p>
      <router-link to="/" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center">
        <i class="fas fa-shopping-cart mr-2"></i>
        Mua sắm ngay
      </router-link>
    </div>

    <!-- Pagination -->
    <div v-if="filteredOrders.length > 0" class="bg-white rounded-lg shadow-sm p-4 mt-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Hiển thị <span class="font-medium">{{ startIndex }}</span> đến <span class="font-medium">{{ endIndex }}</span> 
            trong tổng số <span class="font-medium">{{ filteredOrders.length }}</span> đơn hàng
          </p>
        </div>
        <div class="flex items-center space-x-2">
          <button @click="previousPage" :disabled="currentPage === 1" class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button 
            v-for="page in visiblePages" 
            :key="page"
            @click="goToPage(page)"
            :class="[
              'px-3 py-1 border text-sm',
              page === currentPage 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'border-gray-300 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Order Detail Modal -->
    <div v-if="showDetailModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeDetailModal">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white" @click.stop>
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-gray-900">Chi tiết đơn hàng #{{ selectedOrder?.id }}</h3>
          <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <div v-if="selectedOrder" class="space-y-6">
          <!-- Order Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Thông tin đơn hàng</h4>
              <div class="space-y-1 text-sm">
                <p><span class="text-gray-500">Mã đơn hàng:</span> {{ selectedOrder.id }}</p>
                <p><span class="text-gray-500">Ngày đặt:</span> {{ formatDateTime(selectedOrder.createdAt) }}</p>
                <p><span class="text-gray-500">Trạng thái:</span> 
                  <span :class="getStatusClass(selectedOrder.status)" class="px-2 py-1 rounded-full text-xs font-medium ml-1">
                    {{ getStatusName(selectedOrder.status) }}
                  </span>
                </p>
                <p><span class="text-gray-500">Tổng tiền:</span> {{ formatCurrency(selectedOrder.total) }}</p>
              </div>
            </div>
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Thông tin giao hàng</h4>
              <div class="space-y-1 text-sm">
                <p><span class="text-gray-500">Người nhận:</span> {{ selectedOrder.shipping.name }}</p>
                <p><span class="text-gray-500">Số điện thoại:</span> {{ selectedOrder.shipping.phone }}</p>
                <p><span class="text-gray-500">Địa chỉ:</span> {{ selectedOrder.shipping.address }}</p>
                <p><span class="text-gray-500">Ghi chú:</span> {{ selectedOrder.shipping.note || 'Không có' }}</p>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div>
            <h4 class="font-medium text-gray-900 mb-2">Sản phẩm đã đặt</h4>
            <div class="border rounded-lg overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Số lượng</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Đơn giá</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Thành tiền</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="item in selectedOrder.items" :key="item.id">
                    <td class="px-4 py-2">
                      <div class="flex items-center">
                        <img :src="item.image" :alt="item.name" class="w-10 h-10 object-cover rounded mr-3">
                        <div>
                          <p class="text-sm font-medium text-gray-900">{{ item.name }}</p>
                          <p class="text-xs text-gray-500">{{ item.variant }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-2 text-sm text-gray-900">{{ item.quantity }}</td>
                    <td class="px-4 py-2 text-sm text-gray-900">{{ formatCurrency(item.price) }}</td>
                    <td class="px-4 py-2 text-sm font-medium text-gray-900">{{ formatCurrency(item.price * item.quantity) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="border-t pt-4">
            <div class="flex justify-end">
              <div class="w-64 space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Tạm tính:</span>
                  <span>{{ formatCurrency(selectedOrder.subtotal) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Phí vận chuyển:</span>
                  <span>{{ formatCurrency(selectedOrder.shippingFee) }}</span>
                </div>
                <div v-if="selectedOrder.discount > 0" class="flex justify-between text-sm">
                  <span class="text-gray-500">Giảm giá:</span>
                  <span class="text-red-600">-{{ formatCurrency(selectedOrder.discount) }}</span>
                </div>
                <div class="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Tổng cộng:</span>
                  <span>{{ formatCurrency(selectedOrder.total) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button @click="closeDetailModal" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
            Đóng
          </button>
          <button v-if="selectedOrder && canCancel(selectedOrder.status)" @click="cancelOrder(selectedOrder)" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Hủy đơn hàng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'OrderHistory',
  setup() {
    // Reactive data
    const orders = ref([])
    const isRefreshing = ref(false)
    const showDetailModal = ref(false)
    const selectedOrder = ref(null)
    const currentPage = ref(1)
    const itemsPerPage = ref(5)

    // Filters
    const filters = ref({
      status: '',
      fromDate: '',
      toDate: '',
      search: ''
    })

    // Mock data
    const mockOrders = [
      {
        id: 'ORD001',
        createdAt: new Date('2024-12-18T10:30:00'),
        status: 'delivered',
        total: 1250000,
        subtotal: 1200000,
        shippingFee: 50000,
        discount: 0,
        items: [
          {
            id: 1,
            name: 'iPhone 15 Pro Max',
            variant: '256GB - Titan Tự Nhiên',
            quantity: 1,
            price: 1200000,
            image: 'https://via.placeholder.com/100x100?text=iPhone'
          }
        ],
        shipping: {
          name: 'Nguyễn Văn A',
          phone: '0123456789',
          address: '123 Đường ABC, Quận 1, TP.HCM',
          note: 'Giao hàng giờ hành chính'
        },
        showTimeline: false,
        timeline: [
          {
            id: 1,
            title: 'Đơn hàng đã được đặt',
            description: 'Đơn hàng của bạn đã được tiếp nhận',
            timestamp: new Date('2024-12-18T10:30:00'),
            completed: true
          },
          {
            id: 2,
            title: 'Đã xác nhận',
            description: 'Đơn hàng đã được xác nhận và chuẩn bị',
            timestamp: new Date('2024-12-18T11:00:00'),
            completed: true
          },
          {
            id: 3,
            title: 'Đang giao hàng',
            description: 'Đơn hàng đang được vận chuyển',
            timestamp: new Date('2024-12-18T14:00:00'),
            completed: true
          },
          {
            id: 4,
            title: 'Đã giao thành công',
            description: 'Đơn hàng đã được giao thành công',
            timestamp: new Date('2024-12-18T16:30:00'),
            completed: true
          }
        ]
      },
      {
        id: 'ORD002',
        createdAt: new Date('2024-12-17T15:20:00'),
        status: 'shipping',
        total: 850000,
        subtotal: 800000,
        shippingFee: 50000,
        discount: 0,
        items: [
          {
            id: 2,
            name: 'Samsung Galaxy Buds Pro',
            variant: 'Đen',
            quantity: 2,
            price: 400000,
            image: 'https://via.placeholder.com/100x100?text=Buds'
          }
        ],
        shipping: {
          name: 'Nguyễn Văn A',
          phone: '0123456789',
          address: '123 Đường ABC, Quận 1, TP.HCM',
          note: ''
        },
        showTimeline: false,
        timeline: [
          {
            id: 1,
            title: 'Đơn hàng đã được đặt',
            description: 'Đơn hàng của bạn đã được tiếp nhận',
            timestamp: new Date('2024-12-17T15:20:00'),
            completed: true
          },
          {
            id: 2,
            title: 'Đã xác nhận',
            description: 'Đơn hàng đã được xác nhận và chuẩn bị',
            timestamp: new Date('2024-12-17T16:00:00'),
            completed: true
          },
          {
            id: 3,
            title: 'Đang giao hàng',
            description: 'Đơn hàng đang được vận chuyển',
            timestamp: new Date('2024-12-18T09:00:00'),
            completed: true
          }
        ]
      },
      {
        id: 'ORD003',
        createdAt: new Date('2024-12-16T09:15:00'),
        status: 'processing',
        total: 2100000,
        subtotal: 2050000,
        shippingFee: 50000,
        discount: 0,
        items: [
          {
            id: 3,
            name: 'MacBook Air M3',
            variant: '13 inch - 256GB',
            quantity: 1,
            price: 2050000,
            image: 'https://via.placeholder.com/100x100?text=MacBook'
          }
        ],
        shipping: {
          name: 'Nguyễn Văn A',
          phone: '0123456789',
          address: '123 Đường ABC, Quận 1, TP.HCM',
          note: 'Kiểm tra kỹ trước khi giao'
        },
        showTimeline: false,
        timeline: [
          {
            id: 1,
            title: 'Đơn hàng đã được đặt',
            description: 'Đơn hàng của bạn đã được tiếp nhận',
            timestamp: new Date('2024-12-16T09:15:00'),
            completed: true
          },
          {
            id: 2,
            title: 'Đang xử lý',
            description: 'Đơn hàng đang được chuẩn bị',
            timestamp: new Date('2024-12-16T10:00:00'),
            completed: true
          }
        ]
      }
    ]

    // Computed properties
    const orderStats = computed(() => {
      const total = orders.value.length
      const completed = orders.value.filter(o => o.status === 'delivered').length
      const processing = orders.value.filter(o => ['pending', 'confirmed', 'processing', 'shipping'].includes(o.status)).length
      const totalSpent = orders.value.reduce((sum, o) => sum + o.total, 0)

      return {
        total,
        completed,
        processing,
        totalSpent
      }
    })

    const filteredOrders = computed(() => {
      let filtered = orders.value

      if (filters.value.status) {
        filtered = filtered.filter(o => o.status === filters.value.status)
      }

      if (filters.value.fromDate) {
        const fromDate = new Date(filters.value.fromDate)
        filtered = filtered.filter(o => new Date(o.createdAt) >= fromDate)
      }

      if (filters.value.toDate) {
        const toDate = new Date(filters.value.toDate)
        toDate.setHours(23, 59, 59, 999)
        filtered = filtered.filter(o => new Date(o.createdAt) <= toDate)
      }

      if (filters.value.search) {
        const search = filters.value.search.toLowerCase()
        filtered = filtered.filter(o => 
          o.id.toLowerCase().includes(search) ||
          o.items.some(item => item.name.toLowerCase().includes(search))
        )
      }

      return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    })

    const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage.value))

    const paginatedOrders = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredOrders.value.slice(start, end)
    })

    const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
    const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredOrders.value.length))

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
    const loadOrders = () => {
      orders.value = mockOrders
    }

    const refreshOrders = async () => {
      isRefreshing.value = true
      await new Promise(resolve => setTimeout(resolve, 1000))
      loadOrders()
      isRefreshing.value = false
    }

    const resetFilters = () => {
      filters.value = {
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

    const viewOrderDetail = (order) => {
      selectedOrder.value = order
      showDetailModal.value = true
    }

    const closeDetailModal = () => {
      showDetailModal.value = false
      selectedOrder.value = null
    }

    const trackOrder = (order) => {
      order.showTimeline = !order.showTimeline
    }

    const cancelOrder = async (order) => {
      if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
        order.status = 'cancelled'
        alert('Đơn hàng đã được hủy thành công!')
        closeDetailModal()
      }
    }

    const reorder = () => {
      // Add items to cart and redirect to checkout
      alert('Tính năng đặt lại đơn hàng sẽ được triển khai sau!')
    }

    const rateOrder = () => {
      alert('Tính năng đánh giá đơn hàng sẽ được triển khai sau!')
    }

    const canCancel = (status) => {
      return ['pending', 'confirmed', 'processing'].includes(status)
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

    const formatDateTime = (date) => {
      return new Date(date).toLocaleString('vi-VN')
    }

    const getStatusClass = (status) => {
      const classes = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        processing: 'bg-purple-100 text-purple-800',
        shipping: 'bg-indigo-100 text-indigo-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
        returned: 'bg-gray-100 text-gray-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    }

    const getStatusName = (status) => {
      const names = {
        pending: 'Chờ xử lý',
        confirmed: 'Đã xác nhận',
        processing: 'Đang xử lý',
        shipping: 'Đang giao',
        delivered: 'Đã giao',
        cancelled: 'Đã hủy',
        returned: 'Đã trả'
      }
      return names[status] || status
    }

    // Lifecycle
    onMounted(() => {
      loadOrders()
    })

    return {
      // Data
      orders,
      isRefreshing,
      showDetailModal,
      selectedOrder,
      currentPage,
      itemsPerPage,
      filters,
      
      // Computed
      orderStats,
      filteredOrders,
      totalPages,
      paginatedOrders,
      startIndex,
      endIndex,
      visiblePages,
      
      // Methods
      refreshOrders,
      resetFilters,
      applyFilters,
      viewOrderDetail,
      closeDetailModal,
      trackOrder,
      cancelOrder,
      reorder,
      rateOrder,
      canCancel,
      previousPage,
      nextPage,
      goToPage,
      formatCurrency,
      formatDate,
      formatDateTime,
      getStatusClass,
      getStatusName
    }
  }
}
</script>

<style scoped>
.order-history-container {
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