<template>
  <div class="bg-gray-50 min-h-screen pb-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-indigo-800">
          <i class="fas fa-wallet mr-3 text-indigo-600"></i>
          Quản lý ví người dùng
        </h1>
      </div>
      
      <div v-if="loading" class="flex flex-col items-center justify-center my-12 py-12">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
        <p class="text-indigo-600 font-medium">Đang tải dữ liệu...</p>
      </div>
      
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Wallet List -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden col-span-1 card-hover">
          <div class="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <h2 class="text-xl font-bold text-white flex items-center">
              <i class="fas fa-users mr-2"></i>
              Danh sách ví người dùng
            </h2>
          </div>
          
          <div class="p-4">
            <div class="mb-4">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fas fa-search text-gray-400"></i>
                </div>
                <input 
                  type="text" 
                  v-model="searchQuery" 
                  placeholder="Tìm kiếm người dùng..." 
                  class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
              </div>
            </div>
            
            <div v-if="filteredWallets.length === 0" class="text-center py-8">
              <div class="text-gray-400 text-5xl mb-4">
                <i class="fas fa-search"></i>
              </div>
              <p class="text-gray-500">Không tìm thấy người dùng nào</p>
            </div>
            
            <div v-else class="space-y-2">
              <div 
                v-for="wallet in filteredWallets" 
                :key="wallet.sellerId"
                class="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                :class="{ 'bg-indigo-50 border-indigo-300': selectedWallet && selectedWallet.sellerId === wallet.sellerId }"
                @click="selectWallet(wallet)"
              >
                <div class="flex justify-between items-center">
                  <div>
                    <p class="font-medium text-gray-900">{{ wallet.sellerName }}</p>
                    <p class="text-sm text-gray-500">ID: {{ wallet.sellerId }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold text-indigo-600">{{ formatCurrency(wallet.balance) }}</p>
                    <p v-if="wallet.pendingBalance > 0" class="text-xs text-yellow-600">
                      + {{ formatCurrency(wallet.pendingBalance) }} đang chờ
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Wallet Details and Actions -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden col-span-1 lg:col-span-2 card-hover">
          <div class="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <h2 class="text-xl font-bold text-white flex items-center">
              <i class="fas fa-money-bill-wave mr-2"></i>
              Thao tác với ví
            </h2>
          </div>
          
          <div class="p-6">
            <div v-if="!selectedWallet" class="text-center py-12">
              <div class="text-gray-400 text-6xl mb-4">
                <i class="fas fa-wallet"></i>
              </div>
              <h3 class="text-lg font-medium text-gray-500 mb-2">Chưa chọn ví người dùng</h3>
              <p class="text-gray-400 text-sm">Vui lòng chọn một người dùng từ danh sách bên trái</p>
            </div>
            
            <div v-else>
              <!-- Wallet Info -->
              <div class="bg-indigo-50 rounded-xl p-6 mb-8">
                <div class="flex items-center justify-between mb-4">
                  <div>
                    <h3 class="text-xl font-bold text-gray-800">{{ selectedWallet.sellerName }}</h3>
                    <p class="text-gray-500">ID: {{ selectedWallet.sellerId }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-gray-500">Cập nhật lần cuối</p>
                    <p class="text-sm font-medium">{{ formatDate(selectedWallet.lastUpdated) }}</p>
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-white rounded-lg p-4 shadow-sm">
                    <p class="text-sm text-gray-500 mb-1">Số dư hiện tại</p>
                    <p class="text-2xl font-bold text-indigo-600">{{ formatCurrency(selectedWallet.balance) }}</p>
                  </div>
                  
                  <div class="bg-white rounded-lg p-4 shadow-sm">
                    <p class="text-sm text-gray-500 mb-1">Số dư đang chờ</p>
                    <p class="text-2xl font-bold text-yellow-600">{{ formatCurrency(selectedWallet.pendingBalance) }}</p>
                  </div>
                </div>
              </div>
              
              <!-- Wallet Actions -->
              <div class="mb-8">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Thao tác với ví</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Add Balance -->
                  <div class="border border-green-200 rounded-lg p-4 bg-green-50">
                    <h4 class="font-medium text-green-800 mb-3 flex items-center">
                      <i class="fas fa-plus-circle mr-2"></i> Cộng tiền vào ví
                    </h4>
                    
                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Số tiền cần cộng</label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i class="fas fa-money-bill-wave text-gray-400"></i>
                        </div>
                        <input 
                          v-model="addAmount" 
                          type="number" 
                          min="1000"
                          step="1000"
                          placeholder="Nhập số tiền"
                          class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                      </div>
                    </div>
                    
                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i class="fas fa-comment-alt text-gray-400"></i>
                        </div>
                        <input 
                          v-model="addDescription" 
                          type="text" 
                          placeholder="Nhập mô tả (tùy chọn)"
                          class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                      </div>
                    </div>
                    
                    <button 
                      @click="addToWallet" 
                      class="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
                      :disabled="!addAmount || addAmount < 1000 || loading"
                    >
                      <i class="fas fa-plus-circle mr-2"></i> Cộng tiền
                    </button>
                  </div>
                  
                  <!-- Subtract Balance -->
                  <div class="border border-red-200 rounded-lg p-4 bg-red-50">
                    <h4 class="font-medium text-red-800 mb-3 flex items-center">
                      <i class="fas fa-minus-circle mr-2"></i> Trừ tiền từ ví
                    </h4>
                    
                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Số tiền cần trừ</label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i class="fas fa-money-bill-wave text-gray-400"></i>
                        </div>
                        <input 
                          v-model="subtractAmount" 
                          type="number" 
                          min="1000"
                          step="1000"
                          :max="selectedWallet.balance"
                          placeholder="Nhập số tiền"
                          class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                      </div>
                      <p class="text-xs text-gray-500 mt-1">Số dư hiện tại: {{ formatCurrency(selectedWallet.balance) }}</p>
                    </div>
                    
                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i class="fas fa-comment-alt text-gray-400"></i>
                        </div>
                        <input 
                          v-model="subtractDescription" 
                          type="text" 
                          placeholder="Nhập mô tả (tùy chọn)"
                          class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                      </div>
                    </div>
                    
                    <button 
                      @click="subtractFromWallet" 
                      class="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center"
                      :disabled="!subtractAmount || subtractAmount < 1000 || subtractAmount > selectedWallet.balance || loading"
                    >
                      <i class="fas fa-minus-circle mr-2"></i> Trừ tiền
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Transaction History Placeholder -->
              <div>
                <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <i class="fas fa-history mr-2"></i> Lịch sử giao dịch
                </h3>
                
                <div class="bg-gray-100 rounded-lg p-6 text-center">
                  <p class="text-gray-500">Chức năng lịch sử giao dịch sẽ được cập nhật trong phiên bản tiếp theo</p>
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
import { useCommissionStore } from '../../stores/commissionStore'
import Swal from 'sweetalert2'

export default {
  name: 'WalletManagement',
  setup() {
    const commissionStore = useCommissionStore()
    const loading = ref(false)
    const searchQuery = ref('')
    const selectedWallet = ref(null)
    
    // Form fields
    const addAmount = ref('')
    const addDescription = ref('')
    const subtractAmount = ref('')
    const subtractDescription = ref('')
    
    const wallets = computed(() => commissionStore.wallets)
    
    const filteredWallets = computed(() => {
      if (!searchQuery.value) return wallets.value
      
      const query = searchQuery.value.toLowerCase()
      return wallets.value.filter(wallet => 
        wallet.sellerName.toLowerCase().includes(query) || 
        wallet.sellerId.toString().includes(query)
      )
    })
    
    const selectWallet = (wallet) => {
      selectedWallet.value = wallet
      // Reset form fields
      addAmount.value = ''
      addDescription.value = ''
      subtractAmount.value = ''
      subtractDescription.value = ''
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
    
    const addToWallet = async () => {
      if (!selectedWallet.value || !addAmount.value || addAmount.value < 1000) {
        return
      }
      
      loading.value = true
      
      try {
        const result = await commissionStore.updateWalletBalance({
          sellerId: selectedWallet.value.sellerId,
          amount: parseFloat(addAmount.value),
          type: 'add',
          description: addDescription.value || 'Cộng tiền vào ví'
        })
        
        if (result) {
          // Update the selected wallet with the new balance
          selectedWallet.value = commissionStore.wallets.find(w => w.sellerId === selectedWallet.value.sellerId)
          
          // Reset form
          addAmount.value = ''
          addDescription.value = ''
        }
      } catch (error) {
        console.error('Error adding to wallet:', error)
      } finally {
        loading.value = false
      }
    }
    
    const subtractFromWallet = async () => {
      if (!selectedWallet.value || !subtractAmount.value || subtractAmount.value < 1000 || subtractAmount.value > selectedWallet.value.balance) {
        return
      }
      
      // Confirm before subtracting
      const result = await Swal.fire({
        title: 'Xác nhận trừ tiền',
        text: `Bạn có chắc chắn muốn trừ ${formatCurrency(subtractAmount.value)} từ ví của ${selectedWallet.value.sellerName}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Xác nhận trừ tiền',
        cancelButtonText: 'Hủy'
      })
      
      if (!result.isConfirmed) {
        return
      }
      
      loading.value = true
      
      try {
        const result = await commissionStore.updateWalletBalance({
          sellerId: selectedWallet.value.sellerId,
          amount: parseFloat(subtractAmount.value),
          type: 'subtract',
          description: subtractDescription.value || 'Trừ tiền từ ví'
        })
        
        if (result) {
          // Update the selected wallet with the new balance
          selectedWallet.value = commissionStore.wallets.find(w => w.sellerId === selectedWallet.value.sellerId)
          
          // Reset form
          subtractAmount.value = ''
          subtractDescription.value = ''
        }
      } catch (error) {
        console.error('Error subtracting from wallet:', error)
      } finally {
        loading.value = false
      }
    }
    
    onMounted(async () => {
      loading.value = true
      await commissionStore.fetchWallets()
      loading.value = false
    })
    
    return {
      loading,
      wallets,
      searchQuery,
      filteredWallets,
      selectedWallet,
      addAmount,
      addDescription,
      subtractAmount,
      subtractDescription,
      selectWallet,
      formatCurrency,
      formatDate,
      addToWallet,
      subtractFromWallet
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

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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