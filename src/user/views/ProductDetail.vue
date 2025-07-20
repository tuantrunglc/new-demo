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
          <h1 class="text-lg font-semibold">Chi tiết sản phẩm</h1>
          <div class="w-20"></div>
        </div>
      </div>
    </div>

    <!-- Product Detail Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Product Images -->
        <div class="space-y-4">
          <div class="aspect-square bg-white rounded-lg overflow-hidden shadow-sm">
            <img 
              :src="product.image" 
              :alt="product.name"
              class="w-full h-full object-cover"
            >
          </div>
          <div class="grid grid-cols-4 gap-2">
            <div 
              v-for="(image, index) in product.gallery" 
              :key="index"
              class="aspect-square bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-500"
            >
              <img :src="image" :alt="`${product.name} ${index + 1}`" class="w-full h-full object-cover">
            </div>
          </div>
        </div>

        <!-- Product Info -->
        <div class="space-y-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ product.name }}</h1>
            <p class="text-sm text-gray-500 mt-1">SKU: {{ product.sku }}</p>
          </div>

          <div class="flex items-center space-x-4">
            <span class="text-3xl font-bold text-red-600">{{ formatPrice(product.price) }}</span>
            <span v-if="product.originalPrice" class="text-lg text-gray-500 line-through">
              {{ formatPrice(product.originalPrice) }}
            </span>
            <span v-if="product.discount" class="bg-red-100 text-red-800 text-sm px-2 py-1 rounded">
              -{{ product.discount }}%
            </span>
          </div>

          <div class="flex items-center space-x-2">
            <div class="flex items-center">
              <svg v-for="i in 5" :key="i" class="w-5 h-5" :class="i <= product.rating ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </div>
            <span class="text-sm text-gray-600">({{ product.reviewCount }} đánh giá)</span>
          </div>

          <!-- Quantity and Add to Cart -->
          <div class="space-y-4">
            <div class="flex items-center space-x-4">
              <span class="text-sm font-medium text-gray-700">Số lượng:</span>
              <div class="flex items-center border border-gray-300 rounded-lg">
                <button @click="decreaseQuantity" class="px-3 py-2 text-gray-600 hover:bg-gray-100">-</button>
                <input v-model="quantity" type="number" min="1" class="w-16 text-center border-0 focus:ring-0">
                <button @click="increaseQuantity" class="px-3 py-2 text-gray-600 hover:bg-gray-100">+</button>
              </div>
              <span class="text-sm text-gray-500">{{ product.stock }} sản phẩm có sẵn</span>
            </div>

            <div class="flex space-x-4">
              <button 
                @click="addToCart"
                class="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Thêm vào giỏ hàng
              </button>
              <button 
                @click="buyNow"
                class="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Mua ngay
              </button>
            </div>
          </div>

          <!-- Product Features -->
          <div class="border-t pt-6">
            <h3 class="text-lg font-semibold mb-4">Thông tin sản phẩm</h3>
            <div class="space-y-2">
              <div v-for="(feature, index) in product.features" :key="index" class="flex">
                <span class="w-32 text-sm text-gray-600">{{ feature.label }}:</span>
                <span class="text-sm text-gray-900">{{ feature.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Description -->
      <div class="mt-12">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button 
              @click="activeTab = 'description'"
              :class="activeTab === 'description' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            >
              Mô tả sản phẩm
            </button>
            <button 
              @click="activeTab = 'specifications'"
              :class="activeTab === 'specifications' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            >
              Thông số kỹ thuật
            </button>
            <button 
              @click="activeTab = 'reviews'"
              :class="activeTab === 'reviews' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            >
              Đánh giá ({{ product.reviewCount }})
            </button>
          </nav>
        </div>

        <div class="py-6">
          <div v-if="activeTab === 'description'" class="prose max-w-none">
            <div v-html="product.description"></div>
          </div>
          
          <div v-if="activeTab === 'specifications'" class="space-y-4">
            <div v-for="(spec, index) in product.specifications" :key="index" class="flex py-2 border-b border-gray-100">
              <span class="w-48 text-sm font-medium text-gray-700">{{ spec.label }}</span>
              <span class="text-sm text-gray-900">{{ spec.value }}</span>
            </div>
          </div>

          <div v-if="activeTab === 'reviews'" class="space-y-6">
            <div v-for="review in product.reviews" :key="review.id" class="border-b border-gray-100 pb-6">
              <div class="flex items-center space-x-4 mb-2">
                <img :src="review.avatar" :alt="review.name" class="w-10 h-10 rounded-full">
                <div>
                  <h4 class="font-medium text-gray-900">{{ review.name }}</h4>
                  <div class="flex items-center space-x-2">
                    <div class="flex items-center">
                      <svg v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    </div>
                    <span class="text-sm text-gray-500">{{ review.date }}</span>
                  </div>
                </div>
              </div>
              <p class="text-gray-700">{{ review.comment }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductDetailView',
  data() {
    return {
      quantity: 1,
      activeTab: 'description',
      product: {
        id: 1,
        name: 'iPhone 15 Pro Max 256GB',
        sku: 'IP15PM256',
        price: 29990000,
        originalPrice: 32990000,
        discount: 9,
        rating: 4.5,
        reviewCount: 128,
        stock: 15,
        image: 'https://via.placeholder.com/600x600/3B82F6/FFFFFF?text=iPhone+15+Pro',
        gallery: [
          'https://via.placeholder.com/150x150/3B82F6/FFFFFF?text=1',
          'https://via.placeholder.com/150x150/EF4444/FFFFFF?text=2',
          'https://via.placeholder.com/150x150/10B981/FFFFFF?text=3',
          'https://via.placeholder.com/150x150/F59E0B/FFFFFF?text=4'
        ],
        features: [
          { label: 'Thương hiệu', value: 'Apple' },
          { label: 'Bộ nhớ', value: '256GB' },
          { label: 'Màu sắc', value: 'Titan Tự Nhiên' },
          { label: 'Bảo hành', value: '12 tháng' }
        ],
        description: `
          <h3>iPhone 15 Pro Max - Đỉnh cao công nghệ</h3>
          <p>iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, camera 48MP chuyên nghiệp và thiết kế titan cao cấp.</p>
          <ul>
            <li>Chip A17 Pro 3nm tiên tiến nhất</li>
            <li>Camera chính 48MP với zoom quang học 5x</li>
            <li>Màn hình Super Retina XDR 6.7 inch</li>
            <li>Khung viền titan cực kỳ bền bỉ</li>
          </ul>
        `,
        specifications: [
          { label: 'Màn hình', value: '6.7 inch Super Retina XDR' },
          { label: 'Chip xử lý', value: 'A17 Pro' },
          { label: 'Camera sau', value: '48MP + 12MP + 12MP' },
          { label: 'Camera trước', value: '12MP TrueDepth' },
          { label: 'Dung lượng pin', value: '4441 mAh' },
          { label: 'Hệ điều hành', value: 'iOS 17' }
        ],
        reviews: [
          {
            id: 1,
            name: 'Nguyễn Văn A',
            avatar: 'https://via.placeholder.com/40x40/6B7280/FFFFFF?text=A',
            rating: 5,
            date: '2 ngày trước',
            comment: 'Sản phẩm rất tốt, camera chụp ảnh đẹp, pin trâu. Rất hài lòng với lựa chọn này.'
          },
          {
            id: 2,
            name: 'Trần Thị B',
            avatar: 'https://via.placeholder.com/40x40/EC4899/FFFFFF?text=B',
            rating: 4,
            date: '1 tuần trước',
            comment: 'Máy đẹp, chạy mượt. Tuy nhiên giá hơi cao so với mong đợi.'
          }
        ]
      }
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price)
    },
    increaseQuantity() {
      if (this.quantity < this.product.stock) {
        this.quantity++
      }
    },
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--
      }
    },
    addToCart() {
      // Logic thêm vào giỏ hàng
      this.$toast.success(`Đã thêm ${this.quantity} sản phẩm vào giỏ hàng`)
    },
    buyNow() {
      // Chuyển đến trang thanh toán
      this.$router.push('/checkout')
    }
  },
  mounted() {
    // Load product data based on route params
    // const productId = this.$route.params.id
    // Fetch product data from API
  }
}
</script>