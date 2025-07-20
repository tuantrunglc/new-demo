<template>
  <div class="bg-gray-50 min-h-screen pb-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-indigo-800">
          <i class="fas fa-shopping-cart mr-3 text-indigo-600"></i>
          Tạo đơn hàng mới
        </h1>
        <div class="flex space-x-3">
          <router-link 
            to="/admin/orders" 
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium flex items-center"
          >
            <i class="fas fa-arrow-left mr-2"></i>
            Quay lại
          </router-link>
        </div>
      </div>
      
      <div v-if="loading" class="flex flex-col items-center justify-center my-12 py-12">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
        <p class="text-indigo-600 font-medium">Đang xử lý...</p>
      </div>
      
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Order Form -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden col-span-1 lg:col-span-2 card-hover">
          <div class="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <h2 class="text-xl font-bold text-white flex items-center">
              <i class="fas fa-file-invoice mr-2"></i>
              Thông tin đơn hàng
            </h2>
          </div>
          
          <div class="p-6">
            <form @submit.prevent="validateAndSubmit">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <!-- User Information -->
                <div>
                  <h3 class="text-lg font-semibold text-gray-800 mb-4">Thông tin khách hàng</h3>
                  
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Chọn người dùng</label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i class="fas fa-user text-gray-400"></i>
                      </div>
                      <select 
                        v-model="orderForm.userId" 
                        required
                        class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                        @change="handleUserChange"
                      >
                        <option value="" disabled>Chọn người dùng</option>
                        <option 
                          v-for="user in users" 
                          :key="user.id" 
                          :value="user.id"
                        >
                          {{ user.name }} (ID: {{ user.id }})
                        </option>
                      </select>
                      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <i class="fas fa-chevron-down text-gray-400"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Địa chỉ giao hàng</label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i class="fas fa-map-marker-alt text-gray-400"></i>
                      </div>
                      <textarea 
                        v-model="orderForm.shippingAddress" 
                        required
                        rows="3"
                        placeholder="Nhập địa chỉ giao hàng"
                        class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                <!-- Seller and Payment Information -->
                <div>
                  <h3 class="text-lg font-semibold text-gray-800 mb-4">Thông tin thanh toán</h3>
                  
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Chọn người bán</label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i class="fas fa-store text-gray-400"></i>
                      </div>
                      <select 
                        v-model="orderForm.sellerId" 
                        required
                        class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                        @change="handleSellerChange"
                      >
                        <option value="" disabled>Chọn người bán</option>
                        <option 
                          v-for="seller in sellers" 
                          :key="seller.id" 
                          :value="seller.id"
                        >
                          {{ seller.name }} (ID: {{ seller.id }})
                        </option>
                      </select>
                      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <i class="fas fa-chevron-down text-gray-400"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Phương thức thanh toán</label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i class="fas fa-credit-card text-gray-400"></i>
                      </div>
                      <select 
                        v-model="orderForm.paymentMethod" 
                        required
                        class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                      >
                        <option value="" disabled>Chọn phương thức thanh toán</option>
                        <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                        <option value="bank_transfer">Chuyển khoản ngân hàng</option>
                        <option value="credit_card">Thẻ tín dụng</option>
                        <option value="momo">Ví MoMo</option>
                      </select>
                      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <i class="fas fa-chevron-down text-gray-400"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Trạng thái đơn hàng</label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i class="fas fa-tasks text-gray-400"></i>
                      </div>
                      <select 
                        v-model="orderForm.status" 
                        required
                        class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                      >
                        <option 
                          v-for="status in orderStatuses" 
                          :key="status.value" 
                          :value="status.value"
                        >
                          {{ status.label }}
                        </option>
                      </select>
                      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <i class="fas fa-chevron-down text-gray-400"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Trạng thái thanh toán</label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i class="fas fa-money-check-alt text-gray-400"></i>
                      </div>
                      <select 
                        v-model="orderForm.paymentStatus" 
                        required
                        class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                      >
                        <option 
                          v-for="status in paymentStatuses" 
                          :key="status.value" 
                          :value="status.value"
                        >
                          {{ status.label }}
                        </option>
                      </select>
                      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <i class="fas fa-chevron-down text-gray-400"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Product Selection -->
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Sản phẩm</h3>
              
              <div class="bg-gray-50 p-4 rounded-lg mb-6">
                <div v-for="(item, index) in orderForm.items" :key="index" class="mb-4 pb-4 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0">
                  <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div class="md:col-span-5">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Sản phẩm</label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i class="fas fa-box text-gray-400"></i>
                        </div>
                        <select 
                          v-model="item.productId" 
                          required
                          class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                          @change="handleProductChange(index)"
                        >
                          <option value="" disabled>Chọn sản phẩm</option>
                          <option 
                            v-for="product in availableProducts" 
                            :key="product.id" 
                            :value="product.id"
                          >
                            {{ product.name }} ({{ formatCurrency(product.price) }})
                          </option>
                        </select>
                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <i class="fas fa-chevron-down text-gray-400"></i>
                        </div>
                      </div>
                    </div>
                    
                    <div class="md:col-span-2">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Đơn giá</label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i class="fas fa-tag text-gray-400"></i>
                        </div>
                        <input 
                          type="number" 
                          v-model="item.price" 
                          required
                          min="0"
                          readonly
                          class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100"
                        >
                      </div>
                    </div>
                    
                    <div class="md:col-span-2">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Số lượng</label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i class="fas fa-sort-amount-up text-gray-400"></i>
                        </div>
                        <input 
                          type="number" 
                          v-model="item.quantity" 
                          required
                          min="1"
                          class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          @change="updateSubtotal(index)"
                        >
                      </div>
                    </div>
                    
                    <div class="md:col-span-2">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Thành tiền</label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i class="fas fa-calculator text-gray-400"></i>
                        </div>
                        <input 
                          type="number" 
                          v-model="item.subtotal" 
                          required
                          readonly
                          class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100"
                        >
                      </div>
                    </div>
                    
                    <div class="md:col-span-1 flex items-end">
                      <button 
                        type="button" 
                        @click="removeItem(index)" 
                        class="w-full py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        :disabled="orderForm.items.length <= 1"
                      >
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div class="flex justify-between items-center mt-4">
                  <button 
                    type="button" 
                    @click="addItem" 
                    class="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
                  >
                    <i class="fas fa-plus mr-1"></i> Thêm sản phẩm
                  </button>
                  
                  <div class="text-right">
                    <p class="text-sm text-gray-600 mb-1">Tổng cộng:</p>
                    <p class="text-xl font-bold text-indigo-700">{{ formatCurrency(calculateTotal) }}</p>
                  </div>
                </div>
              </div>
              
              <div class="flex justify-end">
                <button 
                  type="submit" 
                  class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-md transition-all font-medium"
                >
                  <i class="fas fa-save mr-2"></i> Tạo đơn hàng
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <!-- Order Summary -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden col-span-1 card-hover">
          <div class="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <h2 class="text-xl font-bold text-white flex items-center">
              <i class="fas fa-receipt mr-2"></i>
              Tóm tắt đơn hàng
            </h2>
          </div>
          
          <div class="p-6">
            <div v-if="!orderForm.userId || !orderForm.sellerId || orderForm.items.length === 0 || !orderForm.items[0].productId" class="text-center py-8">
              <div class="text-gray-400 text-5xl mb-4">
                <i class="fas fa-shopping-cart"></i>
              </div>
              <h3 class="text-lg font-medium text-gray-500 mb-2">Chưa có thông tin đơn hàng</h3>
              <p class="text-gray-400 text-sm">Vui lòng điền thông tin đơn hàng bên trái</p>
            </div>
            
            <div v-else>
              <!-- Customer Info -->
              <div class="mb-6 pb-6 border-b border-gray-200">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Thông tin khách hàng</h3>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm mb-1">
                    <span class="font-medium">Tên:</span> 
                    {{ selectedUser ? selectedUser.name : '' }}
                  </p>
                  <p class="text-sm mb-1">
                    <span class="font-medium">ID:</span> 
                    {{ orderForm.userId }}
                  </p>
                  <p class="text-sm">
                    <span class="font-medium">Địa chỉ:</span> 
                    {{ orderForm.shippingAddress }}
                  </p>
                </div>
              </div>
              
              <!-- Seller Info -->
              <div class="mb-6 pb-6 border-b border-gray-200">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Thông tin người bán</h3>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm mb-1">
                    <span class="font-medium">Tên:</span> 
                    {{ selectedSeller ? selectedSeller.name : '' }}
                  </p>
                  <p class="text-sm">
                    <span class="font-medium">ID:</span> 
                    {{ orderForm.sellerId }}
                  </p>
                </div>
              </div>
              
              <!-- Order Status -->
              <div class="mb-6 pb-6 border-b border-gray-200">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Trạng thái đơn hàng</h3>
                <div class="flex space-x-2">
                  <span 
                    class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full"
                    :class="{
                      'bg-yellow-100 text-yellow-800': orderForm.status === 'pending',
                      'bg-blue-100 text-blue-800': orderForm.status === 'processing',
                      'bg-indigo-100 text-indigo-800': orderForm.status === 'shipped',
                      'bg-green-100 text-green-800': orderForm.status === 'completed',
                      'bg-red-100 text-red-800': orderForm.status === 'cancelled'
                    }"
                  >
                    {{ getOrderStatusLabel(orderForm.status) }}
                  </span>
                  
                  <span 
                    class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full"
                    :class="{
                      'bg-yellow-100 text-yellow-800': orderForm.paymentStatus === 'pending',
                      'bg-green-100 text-green-800': orderForm.paymentStatus === 'paid',
                      'bg-blue-100 text-blue-800': orderForm.paymentStatus === 'refunded',
                      'bg-red-100 text-red-800': orderForm.paymentStatus === 'failed'
                    }"
                  >
                    {{ getPaymentStatusLabel(orderForm.paymentStatus) }}
                  </span>
                </div>
              </div>
              
              <!-- Products Summary -->
              <div class="mb-6">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Sản phẩm</h3>
                <div class="bg-gray-50 rounded-lg overflow-hidden">
                  <div v-for="(item, index) in orderForm.items" :key="index" class="p-3 border-b border-gray-200 last:border-0">
                    <div class="flex justify-between items-start">
                      <div>
                        <p class="text-sm font-medium">
                          {{ getProductName(item.productId) }}
                        </p>
                        <p class="text-xs text-gray-500">
                          {{ formatCurrency(item.price) }} x {{ item.quantity }}
                        </p>
                      </div>
                      <p class="text-sm font-semibold">
                        {{ formatCurrency(item.subtotal) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Total -->
              <div class="bg-indigo-50 p-4 rounded-lg">
                <div class="flex justify-between items-center">
                  <p class="font-medium text-indigo-800">Tổng cộng:</p>
                  <p class="text-xl font-bold text-indigo-800">{{ formatCurrency(calculateTotal) }}</p>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '../stores/orderStore'
import { orderStatuses, paymentStatuses } from '../data/orders'
import Swal from 'sweetalert2'

export default {
  name: 'CreateOrder',
  setup() {
    const router = useRouter()
    const orderStore = useOrderStore()
    const loading = ref(false)
    const users = ref([])
    const sellers = ref([])
    const products = ref([])
    const selectedUser = ref(null)
    const selectedSeller = ref(null)
    
    const orderForm = ref({
      userId: '',
      userName: '',
      sellerId: '',
      sellerName: '',
      items: [
        {
          productId: '',
          productName: '',
          price: 0,
          quantity: 1,
          subtotal: 0
        }
      ],
      total: 0,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: '',
      shippingAddress: ''
    })
    
    const availableProducts = computed(() => {
      return products.value.filter(product => 
        product.sellerId === parseInt(orderForm.value.sellerId)
      )
    })
    
    const calculateTotal = computed(() => {
      return orderForm.value.items.reduce((sum, item) => sum + (item.subtotal || 0), 0)
    })
    
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users')
        const data = await response.json()
        users.value = data.data || []
      } catch (error) {
        console.error('Error fetching users:', error)
        // Mocking users for demo
        users.value = [
          { id: 1, name: 'Nguyễn Văn A', address: '123 Đường Lê Lợi, Quận 1, TP.HCM' },
          { id: 4, name: 'Phạm Thị D', address: '101 Đường Võ Văn Tần, Quận 3, TP.HCM' }
        ]
      }
    }
    
    const fetchSellers = async () => {
      try {
        const response = await fetch('/api/sellers')
        const data = await response.json()
        sellers.value = data.data || []
      } catch (error) {
        console.error('Error fetching sellers:', error)
        // Mocking sellers for demo
        sellers.value = [
          { id: 2, name: 'Trần Thị B' },
          { id: 5, name: 'Hoàng E' }
        ]
      }
    }
    
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        const data = await response.json()
        products.value = data.data || []
      } catch (error) {
        console.error('Error fetching products:', error)
        // Mocking products for demo
        products.value = [
          { id: 1, name: 'Tai Nghe Không Dây Cao Cấp', price: 2990000, sellerId: 2 },
          { id: 2, name: 'Đồng Hồ Thông Minh Series 5', price: 6890000, sellerId: 5 },
          { id: 3, name: 'Ghế Văn Phòng Công Thái Học', price: 4590000, sellerId: 2 },
          { id: 4, name: 'Máy Ảnh DSLR Chuyên Nghiệp', price: 20690000, sellerId: 5 },
          { id: 5, name: 'Kính Mát Thời Trang', price: 1380000, sellerId: 2 },
          { id: 6, name: 'Loa Bluetooth Di Động', price: 1840000, sellerId: 2 }
        ]
      }
    }
    
    const handleUserChange = () => {
      const user = users.value.find(u => u.id === parseInt(orderForm.value.userId))
      if (user) {
        selectedUser.value = user
        orderForm.value.userName = user.name
        orderForm.value.shippingAddress = user.address || ''
      }
    }
    
    const handleSellerChange = () => {
      const seller = sellers.value.find(s => s.id === parseInt(orderForm.value.sellerId))
      if (seller) {
        selectedSeller.value = seller
        orderForm.value.sellerName = seller.name
        
        // Reset product selections when seller changes
        orderForm.value.items.forEach(item => {
          item.productId = ''
          item.productName = ''
          item.price = 0
          item.subtotal = 0
        })
      }
    }
    
    const handleProductChange = (index) => {
      const item = orderForm.value.items[index]
      const product = products.value.find(p => p.id === parseInt(item.productId))
      
      if (product) {
        item.productName = product.name
        item.price = product.price
        updateSubtotal(index)
      }
    }
    
    const updateSubtotal = (index) => {
      const item = orderForm.value.items[index]
      item.subtotal = item.price * item.quantity
    }
    
    const addItem = () => {
      orderForm.value.items.push({
        productId: '',
        productName: '',
        price: 0,
        quantity: 1,
        subtotal: 0
      })
    }
    
    const removeItem = (index) => {
      if (orderForm.value.items.length > 1) {
        orderForm.value.items.splice(index, 1)
      }
    }
    
    const getProductName = (productId) => {
      if (!productId) return ''
      const product = products.value.find(p => p.id === parseInt(productId))
      return product ? product.name : ''
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
    
    const getPaymentStatusLabel = (status) => {
      const found = paymentStatuses.find(s => s.value === status)
      return found ? found.label : status
    }
    
    const validateAndSubmit = () => {
      // Check if all products have been selected
      const hasEmptyProducts = orderForm.value.items.some(item => !item.productId)
      if (hasEmptyProducts) {
        Swal.fire({
          title: 'Lỗi!',
          text: 'Vui lòng chọn sản phẩm cho tất cả các mục',
          icon: 'error',
          confirmButtonText: 'OK'
        })
        return
      }
      
      // Update total before submitting
      orderForm.value.total = calculateTotal.value
      
      // Submit the form
      createOrder()
    }
    
    const createOrder = async () => {
      loading.value = true
      
      try {
        const result = await orderStore.createOrder(orderForm.value)
        
        if (result) {
          Swal.fire({
            title: 'Thành công!',
            text: 'Đơn hàng đã được tạo thành công',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            router.push('/admin/orders')
          })
        }
      } catch (error) {
        console.error('Error creating order:', error)
        Swal.fire({
          title: 'Lỗi!',
          text: 'Có lỗi xảy ra khi tạo đơn hàng',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      } finally {
        loading.value = false
      }
    }
    
    onMounted(async () => {
      await Promise.all([
        fetchUsers(),
        fetchSellers(),
        fetchProducts()
      ])
    })
    
    return {
      loading,
      users,
      sellers,
      products,
      orderForm,
      orderStatuses,
      paymentStatuses,
      selectedUser,
      selectedSeller,
      availableProducts,
      calculateTotal,
      handleUserChange,
      handleSellerChange,
      handleProductChange,
      updateSubtotal,
      addItem,
      removeItem,
      getProductName,
      formatCurrency,
      getOrderStatusLabel,
      getPaymentStatusLabel,
      validateAndSubmit
    }
  }
}
</script>

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
input:focus, select:focus, textarea:focus {
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