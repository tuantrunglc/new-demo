<template>
  <div class="bg-gray-50 min-h-screen pb-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-indigo-800">
          <i class="fas fa-money-bill-wave mr-3 text-indigo-600"></i>
          Quản lý hoa hồng
        </h1>
        <div>
          <router-link 
            to="/admin/wallets" 
            class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-md transition-all font-medium"
          >
            <i class="fas fa-wallet mr-2"></i> Quản lý ví người dùng
          </router-link>
        </div>
      </div>
    
    <div v-if="loading" class="flex flex-col items-center justify-center my-12 py-12">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
      <p class="text-indigo-600 font-medium">Đang tải dữ liệu...</p>
    </div>
    
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Summary Cards -->
      <div class="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-indigo-100 text-indigo-500">
              <i class="fas fa-money-bill-wave text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-gray-500 text-sm">Tổng hoa hồng đã trả</p>
              <p class="text-2xl font-semibold">{{ formatCurrency(totalPaidCommissions) }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 text-yellow-500">
              <i class="fas fa-clock text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-gray-500 text-sm">Hoa hồng đang chờ</p>
              <p class="text-2xl font-semibold">{{ formatCurrency(totalPendingCommissions) }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-500">
              <i class="fas fa-store text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-gray-500 text-sm">Số người bán</p>
              <p class="text-2xl font-semibold">{{ wallets.length }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Seller Wallets -->
      <div class="bg-white rounded-lg shadow col-span-1">
        <div class="p-4 border-b">
          <h2 class="text-lg font-semibold">Ví người bán</h2>
        </div>
        
        <div class="p-4">
          <div class="mb-4">
            <input 
              type="text" 
              v-model="sellerSearchQuery" 
              placeholder="Tìm kiếm người bán..." 
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
          </div>
          
          <div v-if="filteredWallets.length === 0" class="text-center py-4 text-gray-500">
            Không tìm thấy người bán nào
          </div>
          
          <div v-else>
            <div 
              v-for="wallet in filteredWallets" 
              :key="wallet.sellerId"
              class="border-b last:border-0 py-3 cursor-pointer hover:bg-gray-50"
              :class="{ 'bg-indigo-50': selectedSellerId === wallet.sellerId }"
              @click="selectSeller(wallet.sellerId)"
            >
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-medium">{{ wallet.sellerName }}</p>
                  <p class="text-sm text-gray-500">ID: {{ wallet.sellerId }}</p>
                </div>
                <div class="text-right">
                  <p class="font-semibold">{{ formatCurrency(wallet.balance) }}</p>
                  <p v-if="wallet.pendingBalance > 0" class="text-xs text-yellow-600">
                    + {{ formatCurrency(wallet.pendingBalance) }} đang chờ
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Commission History -->
      <div class="bg-white rounded-lg shadow col-span-1 lg:col-span-2">
        <div class="p-4 border-b flex justify-between items-center">
          <h2 class="text-lg font-semibold">Lịch sử hoa hồng</h2>
          
          <div class="flex space-x-2">
            <select 
              v-model="statusFilter" 
              class="px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="paid">Đã thanh toán</option>
              <option value="pending">Đang chờ</option>
            </select>
            
            <input 
              type="text" 
              v-model="orderSearchQuery" 
              placeholder="Tìm theo mã đơn..." 
              class="px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đơn hàng
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người bán
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số tiền
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="filteredCommissions.length === 0">
                <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                  Không có dữ liệu hoa hồng
                </td>
              </tr>
              
              <tr v-for="commission in filteredCommissions" :key="commission.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-indigo-600">{{ commission.orderId }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ commission.sellerName }}</div>
                  <div class="text-xs text-gray-500">ID: {{ commission.sellerId }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ formatCurrency(commission.amount) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="{
                      'bg-green-100 text-green-800': commission.status === 'paid',
                      'bg-yellow-100 text-yellow-800': commission.status === 'pending'
                    }"
                  >
                    {{ commission.status === 'paid' ? 'Đã thanh toán' : 'Đang chờ' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(commission.createdAt) }}</div>
                  <div v-if="commission.paidAt" class="text-xs text-gray-500">
                    Thanh toán: {{ formatDate(commission.paidAt) }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useCommissionStore } from '../../stores/commissionStore'

export default {
  name: 'CommissionManagement',
  setup() {
    const commissionStore = useCommissionStore()
    const sellerSearchQuery = ref('')
    const orderSearchQuery = ref('')
    const statusFilter = ref('')
    const selectedSellerId = ref(null)
    
    const loading = computed(() => commissionStore.loading)
    const commissions = computed(() => commissionStore.commissions)
    const wallets = computed(() => commissionStore.wallets)
    
    const totalPaidCommissions = computed(() => commissionStore.getTotalCommissions)
    const totalPendingCommissions = computed(() => commissionStore.getTotalPendingCommissions)
    
    const filteredWallets = computed(() => {
      if (!sellerSearchQuery.value) return wallets.value
      
      const query = sellerSearchQuery.value.toLowerCase()
      return wallets.value.filter(wallet => 
        wallet.sellerName.toLowerCase().includes(query) || 
        wallet.sellerId.toString().includes(query)
      )
    })
    
    const filteredCommissions = computed(() => {
      let result = commissions.value
      
      // Filter by seller if selected
      if (selectedSellerId.value) {
        result = result.filter(commission => commission.sellerId === selectedSellerId.value)
      }
      
      // Filter by status
      if (statusFilter.value) {
        result = result.filter(commission => commission.status === statusFilter.value)
      }
      
      // Filter by order ID
      if (orderSearchQuery.value) {
        const query = orderSearchQuery.value.toLowerCase()
        result = result.filter(commission => 
          commission.orderId.toLowerCase().includes(query)
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
    
    const selectSeller = (sellerId) => {
      if (selectedSellerId.value === sellerId) {
        selectedSellerId.value = null
      } else {
        selectedSellerId.value = sellerId
      }
    }
    
    // Reset selected seller when search query changes
    watch(sellerSearchQuery, () => {
      selectedSellerId.value = null
    })
    
    onMounted(async () => {
      await Promise.all([
        commissionStore.fetchCommissions(),
        commissionStore.fetchWallets()
      ])
    })
    
    return {
      loading,
      commissions,
      wallets,
      sellerSearchQuery,
      orderSearchQuery,
      statusFilter,
      selectedSellerId,
      totalPaidCommissions,
      totalPendingCommissions,
      filteredWallets,
      filteredCommissions,
      formatCurrency,
      formatDate,
      selectSeller
    }
  }
}
</script>