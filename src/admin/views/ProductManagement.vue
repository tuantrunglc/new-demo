<template>
  <div class="bg-gray-50 min-h-screen pb-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-indigo-800">
          <i class="fas fa-box-open mr-3 text-indigo-600"></i>
          Quản lý sản phẩm
        </h1>
        <div>
          <router-link 
            to="/admin/products/create" 
            class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-md transition-all font-medium"
          >
            <i class="fas fa-plus mr-2"></i> Thêm sản phẩm mới
          </router-link>
        </div>
      </div>
      
      <div class="flex space-x-2 mb-6">
        <div class="relative">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Tìm kiếm sản phẩm..." 
            class="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
          <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
        
        <select 
          v-model="statusFilter" 
          class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="approved">Đã duyệt</option>
          <option value="pending">Chờ duyệt</option>
        </select>
        
        <select 
          v-model="sellerFilter" 
          class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Tất cả người bán</option>
          <option v-for="seller in sellers" :key="seller.id" :value="seller.id">
            {{ seller.name }}
          </option>
        </select>
      </div>
    </div>
    
    <div v-if="loading" class="flex flex-col items-center justify-center my-12 py-12">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
      <p class="text-indigo-600 font-medium">Đang tải dữ liệu...</p>
    </div>
    
    <div v-else-if="filteredProducts.length === 0" class="bg-white rounded-xl shadow-md p-8 text-center">
      <div class="text-gray-500 text-6xl mb-4">
        <i class="fas fa-box-open"></i>
      </div>
      <h2 class="text-xl font-semibold mb-2">Không tìm thấy sản phẩm nào</h2>
      <p class="text-gray-500">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
      <div class="mt-6">
        <router-link 
          to="/admin/products/create" 
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium inline-flex items-center"
        >
          <i class="fas fa-plus mr-2"></i> Thêm sản phẩm mới
        </router-link>
      </div>
    </div>
    
    <div v-else class="bg-white rounded-xl shadow-md overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sản phẩm
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Giá
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Người bán
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hoa hồng
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="product in filteredProducts" :key="product.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="h-10 w-10 flex-shrink-0">
                  <img class="h-10 w-10 rounded-full object-cover" :src="product.images[0]" alt="">
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                  <div class="text-sm text-gray-500">{{ product.category }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ formatCurrency(product.price) }}</div>
              <div v-if="product.discountPrice" class="text-sm text-green-600">
                {{ formatCurrency(product.discountPrice) }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ product.sellerName }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ product.commission_rate }}%</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-green-100 text-green-800': product.status === 'approved',
                  'bg-yellow-100 text-yellow-800': product.status === 'pending'
                }"
              >
                {{ product.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button 
                v-if="product.status === 'pending'"
                @click="approveProduct(product.id)" 
                class="text-indigo-600 hover:text-indigo-900 mr-3"
              >
                <i class="fas fa-check mr-1"></i> Duyệt
              </button>
              <button 
                @click="confirmDeleteProduct(product.id)" 
                class="text-red-600 hover:text-red-900"
              >
                <i class="fas fa-trash-alt mr-1"></i> Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
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
import { useAdminStore } from '../stores/adminStore'
import Swal from 'sweetalert2'

export default {
  name: 'ProductManagement',
  setup() {
    const adminStore = useAdminStore()
    const searchQuery = ref('')
    const statusFilter = ref('')
    const sellerFilter = ref('')
    
    const loading = computed(() => adminStore.loading)
    const products = computed(() => adminStore.products)
    
    const sellers = computed(() => {
      const uniqueSellers = new Map()
      products.value.forEach(product => {
        if (product.user && !uniqueSellers.has(product.user.id)) {
          uniqueSellers.set(product.user.id, {
            id: product.user.id,
            name: product.user.name
          })
        }
      })
      return Array.from(uniqueSellers.values())
    })
    
    const filteredProducts = computed(() => {
      let result = products.value
      
      // Apply status filter
      if (statusFilter.value) {
        result = result.filter(product => product.status === statusFilter.value)
      }
      
      // Apply seller filter
      if (sellerFilter.value) {
        result = result.filter(product => product.user && product.user.id === parseInt(sellerFilter.value))
      }
      
      // Apply search query
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(product => 
          product.name.toLowerCase().includes(query) || 
          (product.category && product.category.name.toLowerCase().includes(query))
        )
      }
      
      return result
    })
    
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(value)
    }
    
    const approveProduct = async (id) => {
      try {
        await adminStore.updateProduct(id, { status: 'approved' })
      } catch (error) {
        console.error('Error approving product:', error)
      }
    }
    
    const confirmDeleteProduct = (id) => {
      Swal.fire({
        title: 'Xác nhận xóa?',
        text: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
      }).then((result) => {
        if (result.isConfirmed) {
          deleteProduct(id)
        }
      })
    }
    
    const deleteProduct = async (id) => {
      try {
        await adminStore.deleteProduct(id)
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
    
    onMounted(async () => {
      await adminStore.fetchProducts()
    })
    
    return {
      loading,
      products,
      sellers,
      searchQuery,
      statusFilter,
      sellerFilter,
      filteredProducts,
      formatCurrency,
      approveProduct,
      confirmDeleteProduct
    }
  }
}
</script>