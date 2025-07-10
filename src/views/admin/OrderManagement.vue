<template>
  <div class="order-management">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Quản lý đơn hàng</h2>
      
      <div class="d-flex">
        <div class="input-group me-2" style="width: 300px;">
          <span class="input-group-text bg-white">
            <i class="fas fa-search"></i>
          </span>
          <input 
            type="text" 
            class="form-control" 
            placeholder="Tìm kiếm đơn hàng..." 
            v-model="searchQuery"
          >
        </div>
        
        <select class="form-select me-2" style="width: 200px;" v-model="statusFilter">
          <option value="">Tất cả trạng thái</option>
          <option value="pending">Chờ xác nhận</option>
          <option value="processing">Đang xử lý</option>
          <option value="shipped">Đã giao cho vận chuyển</option>
          <option value="delivered">Đã giao hàng</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>
    </div>
    
    <div class="card shadow-sm">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th scope="col">Mã đơn hàng</th>
                <th scope="col">Khách hàng</th>
                <th scope="col">Ngày đặt</th>
                <th scope="col">Tổng tiền</th>
                <th scope="col">Trạng thái đơn hàng</th>
                <th scope="col">Trạng thái thanh toán</th>
                <th scope="col" class="text-end">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in filteredOrders" :key="order.id">
                <td>{{ order.id }}</td>
                <td>
                  <div>{{ order.customerName }}</div>
                  <small class="text-muted">{{ order.customerEmail }}</small>
                </td>
                <td>{{ order.orderDate }}</td>
                <td>{{ formatCurrency(order.total) }}</td>
                <td>
                  <span 
                    class="badge" 
                    :class="getOrderStatusClass(order.status)"
                  >
                    {{ getOrderStatusLabel(order.status) }}
                  </span>
                </td>
                <td>
                  <span 
                    class="badge" 
                    :class="getPaymentStatusClass(order.paymentStatus)"
                  >
                    {{ getPaymentStatusLabel(order.paymentStatus) }}
                  </span>
                </td>
                <td class="text-end">
                  <button class="btn btn-sm btn-outline-primary me-1" @click="viewOrderDetails(order)">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-secondary me-1" @click="updateOrderStatus(order)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" v-if="order.status === 'pending'">
                    <i class="fas fa-times"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <div class="d-flex justify-content-between align-items-center mt-3">
      <div>
        <span class="text-muted">Hiển thị {{ filteredOrders.length }} trên {{ orders.length }} đơn hàng</span>
      </div>
      
      <nav>
        <ul class="pagination mb-0">
          <li class="page-item disabled">
            <a class="page-link" href="#" tabindex="-1">Trước</a>
          </li>
          <li class="page-item active"><a class="page-link" href="#">1</a></li>
          <li class="page-item"><a class="page-link" href="#">2</a></li>
          <li class="page-item">
            <a class="page-link" href="#">Sau</a>
          </li>
        </ul>
      </nav>
    </div>
    
    <!-- Order Details Modal -->
    <div class="modal fade" id="orderDetailsModal" tabindex="-1" aria-hidden="true" ref="orderModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content" v-if="selectedOrder">
          <div class="modal-header">
            <h5 class="modal-title">Chi tiết đơn hàng #{{ selectedOrder.id }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row mb-4">
              <div class="col-md-6">
                <h6>Thông tin khách hàng</h6>
                <p class="mb-1">{{ selectedOrder.customerName }}</p>
                <p class="mb-1">{{ selectedOrder.customerEmail }}</p>
                <p class="mb-1">{{ selectedOrder.customerPhone }}</p>
                <p class="mb-0">{{ selectedOrder.shippingAddress }}</p>
              </div>
              <div class="col-md-6">
                <h6>Thông tin đơn hàng</h6>
                <p class="mb-1">Ngày đặt: {{ selectedOrder.orderDate }}</p>
                <p class="mb-1">Phương thức thanh toán: {{ selectedOrder.paymentMethod }}</p>
                <p class="mb-1">
                  Trạng thái đơn hàng: 
                  <span 
                    class="badge" 
                    :class="getOrderStatusClass(selectedOrder.status)"
                  >
                    {{ getOrderStatusLabel(selectedOrder.status) }}
                  </span>
                </p>
                <p class="mb-0">
                  Trạng thái thanh toán: 
                  <span 
                    class="badge" 
                    :class="getPaymentStatusClass(selectedOrder.paymentStatus)"
                  >
                    {{ getPaymentStatusLabel(selectedOrder.paymentStatus) }}
                  </span>
                </p>
              </div>
            </div>
            
            <h6>Sản phẩm</h6>
            <div class="table-responsive">
              <table class="table table-bordered">
                <thead class="table-light">
                  <tr>
                    <th>Sản phẩm</th>
                    <th class="text-end">Đơn giá</th>
                    <th class="text-center">Số lượng</th>
                    <th class="text-end">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in selectedOrder.items" :key="item.productId">
                    <td>{{ item.productName }}</td>
                    <td class="text-end">{{ formatCurrency(item.price) }}</td>
                    <td class="text-center">{{ item.quantity }}</td>
                    <td class="text-end">{{ formatCurrency(item.total) }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3" class="text-end">Tạm tính:</td>
                    <td class="text-end">{{ formatCurrency(selectedOrder.subtotal) }}</td>
                  </tr>
                  <tr>
                    <td colspan="3" class="text-end">Phí vận chuyển:</td>
                    <td class="text-end">{{ formatCurrency(selectedOrder.shippingFee) }}</td>
                  </tr>
                  <tr v-if="selectedOrder.discount > 0">
                    <td colspan="3" class="text-end">Giảm giá:</td>
                    <td class="text-end">-{{ formatCurrency(selectedOrder.discount) }}</td>
                  </tr>
                  <tr>
                    <td colspan="3" class="text-end fw-bold">Tổng cộng:</td>
                    <td class="text-end fw-bold">{{ formatCurrency(selectedOrder.total) }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button 
              type="button" 
              class="btn btn-primary"
              @click="updateOrderStatus(selectedOrder)"
              data-bs-dismiss="modal"
            >
              Cập nhật trạng thái
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Update Status Modal -->
    <div class="modal fade" id="updateStatusModal" tabindex="-1" aria-hidden="true" ref="statusModal">
      <div class="modal-dialog">
        <div class="modal-content" v-if="selectedOrder">
          <div class="modal-header">
            <h5 class="modal-title">Cập nhật trạng thái đơn hàng #{{ selectedOrder.id }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Trạng thái đơn hàng</label>
              <select class="form-select" v-model="updatedOrderStatus">
                <option v-for="status in orderStatuses" :key="status.value" :value="status.value">
                  {{ status.label }}
                </option>
              </select>
            </div>
            
            <div class="mb-3">
              <label class="form-label">Trạng thái thanh toán</label>
              <select class="form-select" v-model="updatedPaymentStatus">
                <option v-for="status in paymentStatuses" :key="status.value" :value="status.value">
                  {{ status.label }}
                </option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button 
              type="button" 
              class="btn btn-primary"
              @click="saveStatusChanges"
              data-bs-dismiss="modal"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '../../stores/adminStore'
import { orderStatuses, paymentStatuses } from '../../data/orders'
import { showModal } from '../../utils/bootstrap'

export default {
  name: 'OrderManagement',
  setup() {
    const adminStore = useAdminStore()
    const searchQuery = ref('')
    const statusFilter = ref('')
    const selectedOrder = ref(null)
    const updatedOrderStatus = ref('')
    const updatedPaymentStatus = ref('')
    
    onMounted(() => {
      // Make sure bootstrap is loaded before trying to use modals
      if (window.bootstrap) {
        // Bootstrap modals will be initialized when needed
        console.log('Bootstrap is loaded and ready for modals')
      } else {
        console.warn('Bootstrap is not loaded, modals may not work properly')
      }
    })
    
    const orders = computed(() => adminStore.getOrders())
    
    const filteredOrders = computed(() => {
      let result = orders.value
      
      // Filter by status
      if (statusFilter.value) {
        result = result.filter(order => order.status === statusFilter.value)
      }
      
      // Filter by search query
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(order => 
          order.id.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.customerEmail.toLowerCase().includes(query)
        )
      }
      
      return result
    })
    
    const viewOrderDetails = (order) => {
      selectedOrder.value = order
      showModal('orderDetailsModal')
    }
    
    const updateOrderStatus = (order) => {
      selectedOrder.value = order
      updatedOrderStatus.value = order.status
      updatedPaymentStatus.value = order.paymentStatus
      showModal('updateStatusModal')
    }
    
    const saveStatusChanges = () => {
      if (selectedOrder.value) {
        adminStore.updateOrderStatus(selectedOrder.value.id, updatedOrderStatus.value)
        adminStore.updatePaymentStatus(selectedOrder.value.id, updatedPaymentStatus.value)
      }
    }
    
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND',
        maximumFractionDigits: 0
      }).format(value)
    }
    
    const getOrderStatusLabel = (status) => {
      const found = orderStatuses.find(s => s.value === status)
      return found ? found.label : status
    }
    
    const getOrderStatusClass = (status) => {
      const found = orderStatuses.find(s => s.value === status)
      return found ? `bg-${found.color}` : 'bg-secondary'
    }
    
    const getPaymentStatusLabel = (status) => {
      const found = paymentStatuses.find(s => s.value === status)
      return found ? found.label : status
    }
    
    const getPaymentStatusClass = (status) => {
      const found = paymentStatuses.find(s => s.value === status)
      return found ? `bg-${found.color}` : 'bg-secondary'
    }
    
    return {
      orders,
      filteredOrders,
      searchQuery,
      statusFilter,
      selectedOrder,
      orderStatuses,
      paymentStatuses,
      updatedOrderStatus,
      updatedPaymentStatus,
      viewOrderDetails,
      updateOrderStatus,
      saveStatusChanges,
      formatCurrency,
      getOrderStatusLabel,
      getOrderStatusClass,
      getPaymentStatusLabel,
      getPaymentStatusClass
    }
  }
}
</script>