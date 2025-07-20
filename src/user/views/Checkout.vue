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
          <h1 class="text-lg font-semibold">Thanh toán</h1>
          <div class="w-20"></div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Checkout Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Shipping Address -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-semibold mb-4">Địa chỉ giao hàng</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Họ và tên *</label>
                <input 
                  v-model="shippingInfo.fullName"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập họ và tên"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Số điện thoại *</label>
                <input 
                  v-model="shippingInfo.phone"
                  type="tel" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập số điện thoại"
                >
              </div>
            </div>

            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Địa chỉ *</label>
              <input 
                v-model="shippingInfo.address"
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Số nhà, tên đường"
              >
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Tỉnh/Thành phố *</label>
                <select 
                  v-model="shippingInfo.province"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Chọn tỉnh/thành</option>
                  <option value="hanoi">Hà Nội</option>
                  <option value="hcm">TP. Hồ Chí Minh</option>
                  <option value="danang">Đà Nẵng</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Quận/Huyện *</label>
                <select 
                  v-model="shippingInfo.district"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Chọn quận/huyện</option>
                  <option value="district1">Quận 1</option>
                  <option value="district2">Quận 2</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Phường/Xã *</label>
                <select 
                  v-model="shippingInfo.ward"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Chọn phường/xã</option>
                  <option value="ward1">Phường 1</option>
                  <option value="ward2">Phường 2</option>
                </select>
              </div>
            </div>

            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
              <textarea 
                v-model="shippingInfo.note"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ghi chú cho đơn hàng (tùy chọn)"
              ></textarea>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-semibold mb-4">Phương thức thanh toán</h2>
            
            <div class="space-y-3">
              <label class="flex items-center p-4 border-2 border-purple-300 bg-purple-50 rounded-lg cursor-pointer">
                <input 
                  v-model="paymentMethod" 
                  type="radio" 
                  value="wallet" 
                  class="text-purple-600 focus:ring-purple-500"
                  checked
                >
                <div class="ml-3 flex items-center">
                  <svg class="w-6 h-6 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                  <div>
                    <div class="font-medium">Ví điện tử</div>
                    <div class="text-sm text-gray-600">Số dư: {{ formatPrice(walletBalance) }}</div>
                  </div>
                </div>
              </label>
              
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <p class="text-sm text-blue-800">
                      Hiện tại chỉ hỗ trợ thanh toán bằng ví điện tử. 
                      <router-link to="/deposit" class="font-medium underline">Nạp tiền vào ví</router-link> 
                      nếu số dư không đủ.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Shipping Method -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-semibold mb-4">Phương thức vận chuyển</h2>
            
            <div class="space-y-3">
              <label class="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <div class="flex items-center">
                  <input 
                    v-model="shippingMethod" 
                    type="radio" 
                    value="standard" 
                    class="text-blue-600 focus:ring-blue-500"
                  >
                  <div class="ml-3">
                    <div class="font-medium">Giao hàng tiêu chuẩn</div>
                    <div class="text-sm text-gray-500">3-5 ngày làm việc</div>
                  </div>
                </div>
                <span class="font-medium text-green-600">Miễn phí</span>
              </label>

              <label class="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <div class="flex items-center">
                  <input 
                    v-model="shippingMethod" 
                    type="radio" 
                    value="express" 
                    class="text-blue-600 focus:ring-blue-500"
                  >
                  <div class="ml-3">
                    <div class="font-medium">Giao hàng nhanh</div>
                    <div class="text-sm text-gray-500">1-2 ngày làm việc</div>
                  </div>
                </div>
                <span class="font-medium">{{ formatPrice(30000) }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Right Column - Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h2 class="text-lg font-semibold mb-4">Đơn hàng của bạn</h2>
            
            <!-- Cart Items -->
            <div class="space-y-4 mb-6">
              <div v-for="item in cartItems" :key="item.id" class="flex items-center space-x-3">
                <img :src="item.image" :alt="item.name" class="w-16 h-16 object-cover rounded-lg">
                <div class="flex-1">
                  <h3 class="font-medium text-sm">{{ item.name }}</h3>
                  <p class="text-sm text-gray-500">Số lượng: {{ item.quantity }}</p>
                </div>
                <span class="font-medium">{{ formatPrice(item.price * item.quantity) }}</span>
              </div>
            </div>

            <!-- Order Summary -->
            <div class="border-t pt-4 space-y-2">
              <div class="flex justify-between">
                <span>Tạm tính:</span>
                <span>{{ formatPrice(subtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span>{{ formatPrice(shippingFee) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Giảm giá:</span>
                <span class="text-red-600">-{{ formatPrice(discount) }}</span>
              </div>
              <div class="border-t pt-2 flex justify-between font-semibold text-lg">
                <span>Tổng cộng:</span>
                <span class="text-red-600">{{ formatPrice(total) }}</span>
              </div>
            </div>

            <!-- Coupon Code -->
            <div class="mt-6">
              <div class="flex space-x-2">
                <input 
                  v-model="couponCode"
                  type="text" 
                  placeholder="Mã giảm giá"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                <button 
                  @click="applyCoupon"
                  class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Áp dụng
                </button>
              </div>
            </div>

            <!-- Place Order Button -->
            <button 
              @click="placeOrder"
              :disabled="!isFormValid"
              class="w-full mt-6 bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Đặt hàng
            </button>

            <!-- Security Info -->
            <div class="mt-4 flex items-center justify-center text-sm text-gray-500">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              Thanh toán an toàn và bảo mật
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckoutView',
  data() {
    return {
      shippingInfo: {
        fullName: '',
        phone: '',
        address: '',
        province: '',
        district: '',
        ward: '',
        note: ''
      },
      paymentMethod: 'cod',
      shippingMethod: 'standard',
      couponCode: '',
      walletBalance: 500000,
      cartItems: [
        {
          id: 1,
          name: 'iPhone 15 Pro Max 256GB',
          price: 29990000,
          quantity: 1,
          image: 'https://via.placeholder.com/64x64/3B82F6/FFFFFF?text=iPhone'
        },
        {
          id: 2,
          name: 'AirPods Pro 2',
          price: 6990000,
          quantity: 1,
          image: 'https://via.placeholder.com/64x64/EF4444/FFFFFF?text=AirPods'
        }
      ]
    }
  },
  computed: {
    subtotal() {
      return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    },
    shippingFee() {
      return this.shippingMethod === 'express' ? 30000 : 0
    },
    discount() {
      return 0 // Calculate based on coupon
    },
    total() {
      return this.subtotal + this.shippingFee - this.discount
    },
    isFormValid() {
      return this.shippingInfo.fullName && 
             this.shippingInfo.phone && 
             this.shippingInfo.address && 
             this.shippingInfo.province && 
             this.shippingInfo.district && 
             this.shippingInfo.ward &&
             this.paymentMethod &&
             this.shippingMethod
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price)
    },
    applyCoupon() {
      // Logic áp dụng mã giảm giá
      if (this.couponCode) {
        this.$toast.success('Áp dụng mã giảm giá thành công!')
      }
    },
    placeOrder() {
      if (!this.isFormValid) {
        this.$toast.error('Vui lòng điền đầy đủ thông tin!')
        return
      }

      // Logic đặt hàng
      // const orderData = {
      //   shippingInfo: this.shippingInfo,
      //   paymentMethod: this.paymentMethod,
      //   shippingMethod: this.shippingMethod,
      //   items: this.cartItems,
      //   total: this.total
      // }

      // Call API to place order
      this.$toast.success('Đặt hàng thành công!')
      this.$router.push('/order-success')
    }
  }
}
</script>