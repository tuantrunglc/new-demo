<template>
  <div class="bg-gray-50 min-h-screen pb-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-indigo-800">
          <i class="fas fa-shopping-cart mr-3 text-indigo-600"></i>
          Quản lý đơn hàng
        </h1>
        <div>
          <router-link 
            to="/admin/orders/create" 
            class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-md transition-all font-medium"
          >
            <i class="fas fa-plus mr-2"></i> Tạo đơn hàng mới
          </router-link>
        </div>
      </div>
    
    <div class="bg-white rounded-xl shadow-md p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái đơn hàng</label>
          <select 
            v-model="statusFilter" 
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option 
              v-for="status in orderStatuses" 
              :key="status.value" 
              :value="status.value"
            >
              {{ status.label }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái thanh toán</label>
          <select 
            v-model="paymentStatusFilter" 
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option 
              v-for="status in paymentStatuses" 
              :key="status.value" 
              :value="status.value"
            >
              {{ status.label }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
          <div class="relative">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Tìm kiếm theo mã đơn hàng, khách hàng..." 
              class="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
            <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="loading" class="flex flex-col items-center justify-center my-12 py-12">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
      <p class="text-indigo-600 font-medium">Đang tải dữ liệu...</p>
    </div>
    
    <div v-else-if="filteredOrders.length === 0" class="bg-white rounded-xl shadow-md p-8 text-center">
      <div class="text-gray-500 text-6xl mb-4">
        <i class="fas fa-shopping-cart"></i>
      </div>
      <h2 class="text-xl font-semibold mb-2">Không tìm thấy đơn hàng nào</h2>
      <p class="text-gray-500">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
      <div class="mt-6">
        <router-link 
          to="/admin/orders/create" 
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium inline-flex items-center"
        >
          <i class="fas fa-plus mr-2"></i> Tạo đơn hàng mới
        </router-link>
      </div>
    </div>
    
    <div v-else class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã đơn hàng
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người bán
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày đặt
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng tiền
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thanh toán
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ order.id }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ order.userName }}</div>
                <div class="text-sm text-gray-500">ID: {{ order.userId }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ order.sellerName }}</div>
                <div class="text-sm text-gray-500">ID: {{ order.sellerId }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(order.createdAt) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ formatCurrency(order.total) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-yellow-100 text-yellow-800': order.status === 'pending',
                    'bg-blue-100 text-blue-800': order.status === 'processing',
                    'bg-indigo-100 text-indigo-800': order.status === 'shipped',
                    'bg-green-100 text-green-800': order.status === 'completed',
                    'bg-red-100 text-red-800': order.status === 'cancelled'
                  }"
                >
                  {{ getOrderStatusLabel(order.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-yellow-100 text-yellow-800': order.paymentStatus === 'pending',
                    'bg-green-100 text-green-800': order.paymentStatus === 'paid',
                    'bg-blue-100 text-blue-800': order.paymentStatus === 'refunded',
                    'bg-red-100 text-red-800': order.paymentStatus === 'failed'
                  }"
                >
                  {{ getPaymentStatusLabel(order.paymentStatus) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  @click="viewOrderDetails(order)" 
                  class="text-indigo-600 hover:text-indigo-900 mr-2"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button 
                  @click="openUpdateModal(order)" 
                  class="text-blue-600 hover:text-blue-900 mr-2"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button 
                  v-if="order.status === 'pending'" 
                  @click="confirmCancelOrder(order.id)" 
                  class="text-red-600 hover:text-red-900"
                >
                  <i class="fas fa-times"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-700">
            Hiển thị <span class="font-medium">{{ filteredOrders.length }}</span> trên <span class="font-medium">{{ orders.length }}</span> đơn hàng
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">Previous</span>
                <i class="fas fa-chevron-left"></i>
              </a>
              <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-indigo-50 text-sm font-medium text-indigo-600 hover:bg-indigo-100">
                1
              </a>
              <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                2
              </a>
              <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">Next</span>
                <i class="fas fa-chevron-right"></i>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Order Details Modal -->
    <div v-if="showOrderDetailsModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="showOrderDetailsModal = false">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex justify-between items-start">
              <h3 class="text-lg font-medium text-gray-900">Chi tiết đơn hàng #{{ selectedOrder?.id }}</h3>
              <button 
                @click="showOrderDetailsModal = false" 
                class="text-gray-400 hover:text-gray-500"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
            
            <div v-if="selectedOrder" class="mt-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 class="text-sm font-medium text-gray-500 mb-2">Thông tin khách hàng</h4>
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm mb-1"><span class="font-medium">Tên:</span> {{ selectedOrder.userName }}</p>
                    <p class="text-sm mb-1"><span class="font-medium">ID:</span> {{ selectedOrder.userId }}</p>
                    <p class="text-sm"><span class="font-medium">Địa chỉ:</span> {{ selectedOrder.shippingAddress }}</p>
                  </div>
                </div>
                
                <div>
                  <h4 class="text-sm font-medium text-gray-500 mb-2">Thông tin đơn hàng</h4>
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm mb-1"><span class="font-medium">Ngày đặt:</span> {{ formatDate(selectedOrder.createdAt) }}</p>
                    <p class="text-sm mb-1"><span class="font-medium">Cập nhật:</span> {{ formatDate(selectedOrder.updatedAt) }}</p>
                    <p class="text-sm mb-1">
                      <span class="font-medium">Trạng thái:</span> 
                      <span 
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ml-1"
                        :class="{
                          'bg-yellow-100 text-yellow-800': selectedOrder.status === 'pending',
                          'bg-blue-100 text-blue-800': selectedOrder.status === 'processing',
                          'bg-indigo-100 text-indigo-800': selectedOrder.status === 'shipped',
                          'bg-green-100 text-green-800': selectedOrder.status === 'completed',
                          'bg-red-100 text-red-800': selectedOrder.status === 'cancelled'
                        }"
                      >
                        {{ getOrderStatusLabel(selectedOrder.status) }}
                      </span>
                    </p>
                    <p class="text-sm">
                      <span class="font-medium">Thanh toán:</span> 
                      <span 
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ml-1"
                        :class="{
                          'bg-yellow-100 text-yellow-800': selectedOrder.paymentStatus === 'pending',
                          'bg-green-100 text-green-800': selectedOrder.paymentStatus === 'paid',
                          'bg-blue-100 text-blue-800': selectedOrder.paymentStatus === 'refunded',
                          'bg-red-100 text-red-800': selectedOrder.paymentStatus === 'failed'
                        }"
                      >
                        {{ getPaymentStatusLabel(selectedOrder.paymentStatus) }}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              
              <h4 class="text-sm font-medium text-gray-500 mb-2">Sản phẩm</h4>
              <div class="bg-gray-50 rounded-lg overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th class="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sản phẩm
                      </th>
                      <th class="px-6 py-3 bg-gray-100 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Đơn giá
                      </th>
                      <th class="px-6 py-3 bg-gray-100 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số lượng
                      </th>
                      <th class="px-6 py-3 bg-gray-100 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thành tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="item in selectedOrder.items" :key="item.productId">
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ item.productName }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {{ formatCurrency(item.price) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        {{ item.quantity }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {{ formatCurrency(item.subtotal) }}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="3" class="px-6 py-3 text-right text-sm font-medium text-gray-900">
                        Tổng cộng:
                      </td>
                      <td class="px-6 py-3 text-right text-sm font-bold text-gray-900">
                        {{ formatCurrency(selectedOrder.total) }}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              @click="openUpdateModal(selectedOrder)" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cập nhật trạng thái
            </button>
            <button 
              type="button" 
              @click="showOrderDetailsModal = false" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Update Status Modal -->
    <div v-if="showUpdateModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="showUpdateModal = false">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form @submit.prevent="saveStatusChanges">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                Cập nhật trạng thái đơn hàng #{{ selectedOrder?.id }}
              </h3>
              
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái đơn hàng</label>
                  <select 
                    v-model="updatedOrderStatus" 
                    required
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option 
                      v-for="status in orderStatuses" 
                      :key="status.value" 
                      :value="status.value"
                    >
                      {{ status.label }}
                    </option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái thanh toán</label>
                  <select 
                    v-model="updatedPaymentStatus" 
                    required
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option 
                      v-for="status in paymentStatuses" 
                      :key="status.value" 
                      :value="status.value"
                    >
                      {{ status.label }}
                    </option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                  <textarea 
                    v-model="updateNote" 
                    rows="3"
                    placeholder="Nhập ghi chú về việc cập nhật trạng thái (nếu có)"
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                type="submit" 
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Lưu thay đổi
              </button>
              <button 
                type="button" 
                @click="showUpdateModal = false" 
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<style scoped>
/* Card hover effects */
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Button effects */
button {
  transition: all 0.2s ease;
}

button:active:not(:disabled) {
  transform: scale(0.97);
}

/* Form input focus effects */
input:focus, select:focus {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #c7d2fe;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #818cf8;
}
</style>

<script>
import { ref, computed, onMounted } from 'vue'
import { useOrderStore } from '../../stores/orderStore'
import { orderStatuses, paymentStatuses } from '../../data/orders'
import Swal from 'sweetalert2'

export default {
  name: 'OrderManagement',
  setup() {
    const orderStore = useOrderStore()
    const searchQuery = ref('')
    const statusFilter = ref('')
    const paymentStatusFilter = ref('')
    const selectedOrder = ref(null)
    const updatedOrderStatus = ref('')
    const updatedPaymentStatus = ref('')
    const updateNote = ref('')
    
    const showOrderDetailsModal = ref(false)
    const showUpdateModal = ref(false)
    
    const loading = computed(() => orderStore.loading)
    const orders = computed(() => orderStore.orders)
    
    const filteredOrders = computed(() => {
      let result = orders.value
      
      // Filter by order status
      if (statusFilter.value) {
        result = result.filter(order => order.status === statusFilter.value)
      }
      
      // Filter by payment status
      if (paymentStatusFilter.value) {
        result = result.filter(order => order.paymentStatus === paymentStatusFilter.value)
      }
      
      // Filter by search query
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(order => 
          order.id.toLowerCase().includes(query) ||
          order.userName.toLowerCase().includes(query) ||
          order.sellerName.toLowerCase().includes(query)
        )
      }
      
      return result
    })
    
    const viewOrderDetails = (order) => {
      selectedOrder.value = order
      showOrderDetailsModal.value = true
    }
    
    const openUpdateModal = (order) => {
      selectedOrder.value = order
      updatedOrderStatus.value = order.status
      updatedPaymentStatus.value = order.paymentStatus
      updateNote.value = ''
      showUpdateModal.value = true
    }
    
    const saveStatusChanges = async () => {
      try {
        if (selectedOrder.value) {
          await orderStore.updateOrderStatus({
            orderId: selectedOrder.value.id,
            status: updatedOrderStatus.value,
            paymentStatus: updatedPaymentStatus.value
          })
          
          // Update the selected order with new status values
          selectedOrder.value.status = updatedOrderStatus.value
          selectedOrder.value.paymentStatus = updatedPaymentStatus.value
          
          showUpdateModal.value = false
        }
      } catch (error) {
        console.error('Error updating order status:', error)
      }
    }
    
    const confirmCancelOrder = (orderId) => {
      Swal.fire({
        title: 'Xác nhận hủy đơn hàng?',
        text: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Hủy đơn hàng',
        cancelButtonText: 'Không'
      }).then((result) => {
        if (result.isConfirmed) {
          cancelOrder(orderId)
        }
      })
    }
    
    const cancelOrder = async (orderId) => {
      try {
        await orderStore.updateOrderStatus({
          orderId,
          status: 'cancelled',
          paymentStatus: 'refunded'
        })
      } catch (error) {
        console.error('Error cancelling order:', error)
      }
    }
    
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND',
        maximumFractionDigits: 0
      }).format(value)
    }
    
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    }
    
    const getOrderStatusLabel = (status) => {
      const found = orderStatuses.find(s => s.value === status)
      return found ? found.label : status
    }
    
    const getPaymentStatusLabel = (status) => {
      const found = paymentStatuses.find(s => s.value === status)
      return found ? found.label : status
    }
    
    onMounted(async () => {
      await orderStore.fetchOrders()
    })
    
    return {
      loading,
      orders,
      filteredOrders,
      searchQuery,
      statusFilter,
      paymentStatusFilter,
      selectedOrder,
      orderStatuses,
      paymentStatuses,
      updatedOrderStatus,
      updatedPaymentStatus,
      updateNote,
      showOrderDetailsModal,
      showUpdateModal,
      viewOrderDetails,
      openUpdateModal,
      saveStatusChanges,
      confirmCancelOrder,
      formatCurrency,
      formatDate,
      getOrderStatusLabel,
      getPaymentStatusLabel
    }
  }
}
</script>