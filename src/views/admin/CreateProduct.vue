<template>
  <div class="bg-gray-50 min-h-screen pb-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-indigo-800">
          <i class="fas fa-box-open mr-3 text-indigo-600"></i>
          Thêm sản phẩm mới
        </h1>
        <div class="flex space-x-3">
          <router-link 
            to="/admin/products" 
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
        <!-- Product Form -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden col-span-1 lg:col-span-2 card-hover">
          <div class="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <h2 class="text-xl font-bold text-white flex items-center">
              <i class="fas fa-info-circle mr-2"></i>
              Thông tin sản phẩm
            </h2>
          </div>
          
          <div class="p-6">
            <form @submit.prevent="validateAndSubmit">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <!-- Basic Information -->
                <div>
                  <h3 class="text-lg font-semibold text-gray-800 mb-4">Thông tin cơ bản</h3>
                  
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Tên sản phẩm</label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i class="fas fa-tag text-gray-400"></i>
                      </div>
                      <input 
                        v-model="productForm.name" 
                        type="text" 
                        required
                        placeholder="Nhập tên sản phẩm"
                        class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                    </div>
                  </div>
                  
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i class="fas fa-folder text-gray-400"></i>
                      </div>
                      <select 
                        v-model="productForm.category" 
                        required
                        class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                      >
                        <option value="" disabled>Chọn danh mục</option>
                        <option value="Điện thoại">Điện thoại</option>
                        <option value="Laptop">Laptop</option>
                        <option value="Máy tính bảng">Máy tính bảng</option>
                        <option value="Phụ kiện">Phụ kiện</option>
                        <option value="Đồng hồ thông minh">Đồng hồ thông minh</option>
                        <option value="Điện tử">Điện tử</option>
                        <option value="Nội thất">Nội thất</option>
                      </select>
                      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <i class="fas fa-chevron-down text-gray-400"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Mô tả sản phẩm</label>
                    <div class="relative">
                      <div class="absolute top-3 left-3 flex items-start pointer-events-none">
                        <i class="fas fa-align-left text-gray-400"></i>
                      </div>
                      <textarea 
                        v-model="productForm.description" 
                        required
                        rows="4"
                        placeholder="Nhập mô tả sản phẩm"
                        class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                <!-- Pricing and Inventory -->
                <div>
                  <h3 class="text-lg font-semibold text-gray-800 mb-4">Giá và tồn kho</h3>
                  
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Giá bán (VNĐ)</label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i class="fas fa-money-bill-wave text-gray-400"></i>
                      </div>
                      <input 
                        v-model="productForm.price" 
                        type="number" 
                        required
                        min="0"
                        placeholder="Nhập giá bán"
                        class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                    </div>
                  </div>
                  
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Giá khuyến mãi (VNĐ)</label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i class="fas fa-tags text-gray-400"></i>
                      </div>
                      <input 
                        v-model="productForm.discountPrice" 
                        type="number" 
                        min="0"
                        placeholder="Nhập giá khuyến mãi (nếu có)"
                        class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                    </div>
                    <div v-if="discountPercentage" class="mt-1 text-sm text-green-600">
                      Giảm {{ discountPercentage }}% so với giá gốc
                    </div>
                  </div>
                  
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Số lượng tồn kho</label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i class="fas fa-cubes text-gray-400"></i>
                      </div>
                      <input 
                        v-model="productForm.stock" 
                        type="number" 
                        required
                        min="0"
                        placeholder="Nhập số lượng tồn kho"
                        class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                    </div>
                  </div>
                  
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Tỷ lệ hoa hồng (%)</label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i class="fas fa-percentage text-gray-400"></i>
                      </div>
                      <input 
                        v-model="productForm.commission_rate" 
                        type="number" 
                        required
                        min="0"
                        max="100"
                        placeholder="Nhập tỷ lệ hoa hồng"
                        class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Seller Information -->
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Thông tin người bán</h3>
              
              <div class="bg-gray-50 p-4 rounded-lg mb-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Chọn người bán</label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i class="fas fa-store text-gray-400"></i>
                      </div>
                      <select 
                        v-model="productForm.sellerId" 
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
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Trạng thái sản phẩm</label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i class="fas fa-check-circle text-gray-400"></i>
                      </div>
                      <select 
                        v-model="productForm.status" 
                        required
                        class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                      >
                        <option value="pending">Chờ duyệt</option>
                        <option value="approved">Đã duyệt</option>
                      </select>
                      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <i class="fas fa-chevron-down text-gray-400"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Product Images -->
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Hình ảnh sản phẩm</h3>
              
              <div class="bg-gray-50 p-4 rounded-lg mb-6">
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">URL hình ảnh</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i class="fas fa-image text-gray-400"></i>
                    </div>
                    <input 
                      v-model="imageUrl" 
                      type="text" 
                      placeholder="Nhập URL hình ảnh"
                      class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                  </div>
                  <div class="flex justify-end mt-2">
                    <button 
                      type="button" 
                      @click="addImage" 
                      class="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
                      :disabled="!imageUrl"
                    >
                      <i class="fas fa-plus mr-1"></i> Thêm hình ảnh
                    </button>
                  </div>
                </div>
                
                <div v-if="productForm.images.length === 0" class="text-center py-8">
                  <div class="text-gray-400 text-5xl mb-4">
                    <i class="fas fa-images"></i>
                  </div>
                  <p class="text-gray-500">Chưa có hình ảnh nào</p>
                  <p class="text-gray-400 text-sm">Thêm ít nhất một hình ảnh cho sản phẩm</p>
                </div>
                
                <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div 
                    v-for="(image, index) in productForm.images" 
                    :key="index" 
                    class="relative group"
                  >
                    <img 
                      :src="image" 
                      alt="Product image" 
                      class="w-full h-32 object-cover rounded-lg border border-gray-200"
                    >
                    <button 
                      type="button" 
                      @click="removeImage(index)" 
                      class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="flex justify-end">
                <button 
                  type="submit" 
                  class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-md transition-all font-medium"
                  :disabled="productForm.images.length === 0"
                >
                  <i class="fas fa-save mr-2"></i> Tạo sản phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <!-- Product Preview -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden col-span-1 card-hover">
          <div class="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <h2 class="text-xl font-bold text-white flex items-center">
              <i class="fas fa-eye mr-2"></i>
              Xem trước sản phẩm
            </h2>
          </div>
          
          <div class="p-6">
            <div v-if="!productForm.name" class="text-center py-8">
              <div class="text-gray-400 text-5xl mb-4">
                <i class="fas fa-box-open"></i>
              </div>
              <h3 class="text-lg font-medium text-gray-500 mb-2">Chưa có thông tin sản phẩm</h3>
              <p class="text-gray-400 text-sm">Vui lòng điền thông tin sản phẩm bên trái</p>
            </div>
            
            <div v-else>
              <!-- Product Preview Card -->
              <div class="border border-gray-200 rounded-lg overflow-hidden mb-6">
                <div class="relative">
                  <img 
                    :src="productForm.images[0] || 'https://via.placeholder.com/300x300.png?text=No+Image'" 
                    alt="Product preview" 
                    class="w-full h-48 object-cover"
                  >
                  <div v-if="productForm.discountPrice && productForm.price > productForm.discountPrice" class="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    -{{ discountPercentage }}%
                  </div>
                  <div class="absolute top-2 right-2">
                    <span 
                      class="px-2 py-1 text-xs font-semibold rounded-full"
                      :class="{
                        'bg-green-100 text-green-800': productForm.status === 'approved',
                        'bg-yellow-100 text-yellow-800': productForm.status === 'pending'
                      }"
                    >
                      {{ productForm.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt' }}
                    </span>
                  </div>
                </div>
                
                <div class="p-4">
                  <h3 class="font-bold text-gray-900 mb-1">{{ productForm.name }}</h3>
                  <p class="text-sm text-gray-500 mb-2">{{ productForm.category }}</p>
                  
                  <div class="flex items-baseline mb-2">
                    <span class="text-lg font-bold text-indigo-600 mr-2">
                      {{ formatCurrency(productForm.discountPrice || productForm.price) }}
                    </span>
                    <span v-if="productForm.discountPrice && productForm.price > productForm.discountPrice" class="text-sm text-gray-500 line-through">
                      {{ formatCurrency(productForm.price) }}
                    </span>
                  </div>
                  
                  <p class="text-sm text-gray-600 line-clamp-2 mb-3">{{ productForm.description }}</p>
                  
                  <div class="flex justify-between items-center">
                    <span class="text-xs text-gray-500">
                      <i class="fas fa-store mr-1"></i> {{ selectedSeller ? selectedSeller.name : '' }}
                    </span>
                    <span class="text-xs text-gray-500">
                      <i class="fas fa-cubes mr-1"></i> Còn {{ productForm.stock }} sản phẩm
                    </span>
                  </div>
                </div>
              </div>
              
              <!-- Additional Info -->
              <div class="space-y-4">
                <div class="bg-gray-50 p-3 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-700 mb-1">Hoa hồng</h4>
                  <div class="flex items-center">
                    <span class="text-lg font-semibold text-indigo-600">{{ productForm.commission_rate }}%</span>
                    <span class="text-sm text-gray-500 ml-2">
                      ({{ formatCurrency((productForm.discountPrice || productForm.price) * productForm.commission_rate / 100) }})
                    </span>
                  </div>
                </div>
                
                <div class="bg-gray-50 p-3 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-700 mb-1">Hình ảnh</h4>
                  <div class="flex flex-wrap gap-2">
                    <div 
                      v-for="(image, index) in productForm.images.slice(0, 4)" 
                      :key="index" 
                      class="w-14 h-14 rounded-md overflow-hidden"
                    >
                      <img :src="image" alt="Product thumbnail" class="w-full h-full object-cover">
                    </div>
                    <div v-if="productForm.images.length > 4" class="w-14 h-14 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                      +{{ productForm.images.length - 4 }}
                    </div>
                  </div>
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
import { useProductStore } from '../../stores/productStore'
import Swal from 'sweetalert2'

export default {
  name: 'CreateProduct',
  setup() {
    const router = useRouter()
    const productStore = useProductStore()
    const loading = ref(false)
    const sellers = ref([])
    const selectedSeller = ref(null)
    const imageUrl = ref('')
    
    const productForm = ref({
      name: '',
      description: '',
      price: '',
      discountPrice: '',
      sellerId: '',
      sellerName: '',
      category: '',
      status: 'pending',
      commission_rate: 5,
      images: [],
      stock: 1
    })
    
    const discountPercentage = computed(() => {
      if (productForm.value.discountPrice && productForm.value.price > productForm.value.discountPrice) {
        const discount = ((productForm.value.price - productForm.value.discountPrice) / productForm.value.price) * 100
        return Math.round(discount)
      }
      return null
    })
    
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
    
    const handleSellerChange = () => {
      const seller = sellers.value.find(s => s.id === parseInt(productForm.value.sellerId))
      if (seller) {
        selectedSeller.value = seller
        productForm.value.sellerName = seller.name
      }
    }
    
    const addImage = () => {
      if (imageUrl.value && !productForm.value.images.includes(imageUrl.value)) {
        productForm.value.images.push(imageUrl.value)
        imageUrl.value = ''
      }
    }
    
    const removeImage = (index) => {
      productForm.value.images.splice(index, 1)
    }
    
    const formatCurrency = (value) => {
      if (!value) return '0 ₫'
      return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND',
        maximumFractionDigits: 0
      }).format(value)
    }
    
    const validateAndSubmit = () => {
      // Check if there are images
      if (productForm.value.images.length === 0) {
        Swal.fire({
          title: 'Lỗi!',
          text: 'Vui lòng thêm ít nhất một hình ảnh cho sản phẩm',
          icon: 'error',
          confirmButtonText: 'OK'
        })
        return
      }
      
      // Check if discount price is less than regular price
      if (productForm.value.discountPrice && parseFloat(productForm.value.discountPrice) >= parseFloat(productForm.value.price)) {
        Swal.fire({
          title: 'Lỗi!',
          text: 'Giá khuyến mãi phải nhỏ hơn giá gốc',
          icon: 'error',
          confirmButtonText: 'OK'
        })
        return
      }
      
      // Submit the form
      createProduct()
    }
    
    const createProduct = async () => {
      loading.value = true
      
      try {
        // Add createdAt and updatedAt
        const now = new Date().toISOString()
        const productData = {
          ...productForm.value,
          createdAt: now,
          updatedAt: now,
          // Convert string values to numbers
          price: parseFloat(productForm.value.price),
          discountPrice: productForm.value.discountPrice ? parseFloat(productForm.value.discountPrice) : null,
          sellerId: parseInt(productForm.value.sellerId),
          commission_rate: parseFloat(productForm.value.commission_rate),
          stock: parseInt(productForm.value.stock)
        }
        
        // Call API to create product
        const result = await productStore.createProduct(productData)
        
        if (result) {
          Swal.fire({
            title: 'Thành công!',
            text: 'Sản phẩm đã được tạo thành công',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            router.push('/admin/products')
          })
        }
      } catch (error) {
        console.error('Error creating product:', error)
        Swal.fire({
          title: 'Lỗi!',
          text: 'Có lỗi xảy ra khi tạo sản phẩm',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      } finally {
        loading.value = false
      }
    }
    
    onMounted(async () => {
      await fetchSellers()
    })
    
    return {
      loading,
      sellers,
      productForm,
      selectedSeller,
      imageUrl,
      discountPercentage,
      handleSellerChange,
      addImage,
      removeImage,
      formatCurrency,
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

/* Line clamp for description */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>