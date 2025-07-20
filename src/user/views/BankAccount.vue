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
          <h1 class="text-lg font-semibold">Tài khoản ngân hàng</h1>
          <button 
            @click="showAddModal = true"
            class="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Thêm mới
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Bank Account List -->
      <div class="space-y-4">
        <div 
          v-for="account in bankAccounts" 
          :key="account.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <img 
                    v-if="account.logo" 
                    :src="account.logo" 
                    :alt="account.bankName"
                    class="w-12 h-8 object-contain"
                  >
                  <svg v-else class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                
                <div>
                  <h3 class="font-semibold text-lg">{{ account.bankName }}</h3>
                  <p class="text-gray-600">{{ account.accountNumber }}</p>
                  <p class="text-sm text-gray-500">{{ account.accountName }}</p>
                  <div class="flex items-center mt-2">
                    <span 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="account.isDefault ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                    >
                      {{ account.isDefault ? 'Mặc định' : 'Phụ' }}
                    </span>
                    <span 
                      class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getStatusClass(account.status)"
                    >
                      {{ getStatusText(account.status) }}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center space-x-2">
                <button 
                  v-if="!account.isDefault"
                  @click="setAsDefault(account.id)"
                  class="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Đặt mặc định
                </button>
                <button 
                  @click="editAccount(account)"
                  class="p-2 text-gray-400 hover:text-gray-600"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button 
                  @click="deleteAccount(account.id)"
                  class="p-2 text-red-400 hover:text-red-600"
                  :disabled="account.isDefault"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Account Details -->
            <div class="mt-4 pt-4 border-t border-gray-100">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span class="text-gray-500">Loại tài khoản:</span>
                  <div class="font-medium">{{ account.accountType }}</div>
                </div>
                <div>
                  <span class="text-gray-500">Chi nhánh:</span>
                  <div class="font-medium">{{ account.branch }}</div>
                </div>
                <div>
                  <span class="text-gray-500">Ngày thêm:</span>
                  <div class="font-medium">{{ formatDate(account.createdAt) }}</div>
                </div>
                <div>
                  <span class="text-gray-500">Lần cuối sử dụng:</span>
                  <div class="font-medium">{{ formatDate(account.lastUsed) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="bankAccounts.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Chưa có tài khoản ngân hàng</h3>
        <p class="text-gray-500 mb-4">Thêm tài khoản ngân hàng để thực hiện các giao dịch</p>
        <button 
          @click="showAddModal = true"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Thêm tài khoản ngân hàng
        </button>
      </div>
    </div>

    <!-- Add/Edit Bank Account Modal -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-screen overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold">
            {{ showEditModal ? 'Cập nhật tài khoản ngân hàng' : 'Thêm tài khoản ngân hàng' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ngân hàng *</label>
            <select 
              v-model="accountForm.bankCode"
              @change="updateBankInfo"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Chọn ngân hàng</option>
              <option v-for="bank in availableBanks" :key="bank.code" :value="bank.code">
                {{ bank.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Số tài khoản *</label>
            <input 
              v-model="accountForm.accountNumber"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập số tài khoản"
              required
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tên chủ tài khoản *</label>
            <input 
              v-model="accountForm.accountName"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập tên chủ tài khoản"
              required
            >
            <p class="text-xs text-gray-500 mt-1">Tên phải khớp với tên trên tài khoản ngân hàng</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Loại tài khoản</label>
            <select 
              v-model="accountForm.accountType"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="savings">Tiết kiệm</option>
              <option value="current">Thanh toán</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Chi nhánh</label>
            <input 
              v-model="accountForm.branch"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập tên chi nhánh"
            >
          </div>
          
          <div class="flex items-center">
            <input 
              v-model="accountForm.isDefault"
              type="checkbox" 
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            >
            <label class="ml-2 text-sm text-gray-700">Đặt làm tài khoản mặc định</label>
          </div>
        </form>
        
        <div class="flex space-x-3 mt-6">
          <button 
            @click="closeModal"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button 
            @click="submitForm"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {{ showEditModal ? 'Cập nhật' : 'Thêm' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-sm mx-4">
        <div class="text-center">
          <svg class="w-12 h-12 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Xác nhận xóa</h3>
          <p class="text-gray-600 mb-6">Bạn có chắc chắn muốn xóa tài khoản ngân hàng này?</p>
          
          <div class="flex space-x-3">
            <button 
              @click="showDeleteModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button 
              @click="confirmDelete"
              class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BankAccountView',
  data() {
    return {
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      deleteAccountId: null,
      accountForm: {
        bankCode: '',
        bankName: '',
        accountNumber: '',
        accountName: '',
        accountType: 'savings',
        branch: '',
        isDefault: false
      },
      bankAccounts: [
        {
          id: 1,
          bankCode: 'vcb',
          bankName: 'Vietcombank',
          accountNumber: '1234567890',
          accountName: 'NGUYEN VAN A',
          accountType: 'Tiết kiệm',
          branch: 'Chi nhánh Quận 1',
          isDefault: true,
          status: 'active',
          logo: 'https://via.placeholder.com/48x32/00A651/FFFFFF?text=VCB',
          createdAt: '2024-01-01',
          lastUsed: '2024-01-15'
        },
        {
          id: 2,
          bankCode: 'tcb',
          bankName: 'Techcombank',
          accountNumber: '0987654321',
          accountName: 'NGUYEN VAN A',
          accountType: 'Thanh toán',
          branch: 'Chi nhánh Tân Bình',
          isDefault: false,
          status: 'active',
          logo: 'https://via.placeholder.com/48x32/0066CC/FFFFFF?text=TCB',
          createdAt: '2024-01-05',
          lastUsed: '2024-01-10'
        },
        {
          id: 3,
          bankCode: 'mb',
          bankName: 'MB Bank',
          accountNumber: '5555666677',
          accountName: 'NGUYEN VAN A',
          accountType: 'Tiết kiệm',
          branch: 'Chi nhánh Thủ Đức',
          isDefault: false,
          status: 'pending',
          logo: 'https://via.placeholder.com/48x32/FF6B35/FFFFFF?text=MB',
          createdAt: '2024-01-12',
          lastUsed: null
        }
      ],
      availableBanks: [
        { code: 'vcb', name: 'Vietcombank', logo: 'https://via.placeholder.com/48x32/00A651/FFFFFF?text=VCB' },
        { code: 'tcb', name: 'Techcombank', logo: 'https://via.placeholder.com/48x32/0066CC/FFFFFF?text=TCB' },
        { code: 'mb', name: 'MB Bank', logo: 'https://via.placeholder.com/48x32/FF6B35/FFFFFF?text=MB' },
        { code: 'acb', name: 'ACB', logo: 'https://via.placeholder.com/48x32/1E40AF/FFFFFF?text=ACB' },
        { code: 'bid', name: 'BIDV', logo: 'https://via.placeholder.com/48x32/059669/FFFFFF?text=BIDV' },
        { code: 'vtb', name: 'Vietinbank', logo: 'https://via.placeholder.com/48x32/DC2626/FFFFFF?text=VTB' }
      ]
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return 'Chưa sử dụng'
      return new Date(date).toLocaleDateString('vi-VN')
    },
    getStatusClass(status) {
      switch (status) {
        case 'active':
          return 'bg-green-100 text-green-800'
        case 'pending':
          return 'bg-yellow-100 text-yellow-800'
        case 'inactive':
          return 'bg-red-100 text-red-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    },
    getStatusText(status) {
      switch (status) {
        case 'active':
          return 'Hoạt động'
        case 'pending':
          return 'Đang xác thực'
        case 'inactive':
          return 'Không hoạt động'
        default:
          return 'Không xác định'
      }
    },
    updateBankInfo() {
      const selectedBank = this.availableBanks.find(bank => bank.code === this.accountForm.bankCode)
      if (selectedBank) {
        this.accountForm.bankName = selectedBank.name
      }
    },
    editAccount(account) {
      this.accountForm = {
        id: account.id,
        bankCode: account.bankCode,
        bankName: account.bankName,
        accountNumber: account.accountNumber,
        accountName: account.accountName,
        accountType: account.accountType === 'Tiết kiệm' ? 'savings' : 'current',
        branch: account.branch,
        isDefault: account.isDefault
      }
      this.showEditModal = true
    },
    setAsDefault(accountId) {
      // Update default account
      this.bankAccounts.forEach(account => {
        account.isDefault = account.id === accountId
      })
      this.$toast.success('Đã đặt làm tài khoản mặc định!')
    },
    deleteAccount(accountId) {
      this.deleteAccountId = accountId
      this.showDeleteModal = true
    },
    confirmDelete() {
      this.bankAccounts = this.bankAccounts.filter(account => account.id !== this.deleteAccountId)
      this.showDeleteModal = false
      this.deleteAccountId = null
      this.$toast.success('Xóa tài khoản ngân hàng thành công!')
    },
    closeModal() {
      this.showAddModal = false
      this.showEditModal = false
      this.accountForm = {
        bankCode: '',
        bankName: '',
        accountNumber: '',
        accountName: '',
        accountType: 'savings',
        branch: '',
        isDefault: false
      }
    },
    submitForm() {
      if (!this.accountForm.bankCode || !this.accountForm.accountNumber || !this.accountForm.accountName) {
        this.$toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!')
        return
      }

      const selectedBank = this.availableBanks.find(bank => bank.code === this.accountForm.bankCode)
      
      if (this.showEditModal) {
        // Update existing account
        const index = this.bankAccounts.findIndex(account => account.id === this.accountForm.id)
        if (index !== -1) {
          this.bankAccounts[index] = {
            ...this.bankAccounts[index],
            bankCode: this.accountForm.bankCode,
            bankName: this.accountForm.bankName,
            accountNumber: this.accountForm.accountNumber,
            accountName: this.accountForm.accountName.toUpperCase(),
            accountType: this.accountForm.accountType === 'savings' ? 'Tiết kiệm' : 'Thanh toán',
            branch: this.accountForm.branch,
            isDefault: this.accountForm.isDefault,
            logo: selectedBank?.logo
          }
          
          // If set as default, update other accounts
          if (this.accountForm.isDefault) {
            this.bankAccounts.forEach(account => {
              if (account.id !== this.accountForm.id) {
                account.isDefault = false
              }
            })
          }
        }
        this.$toast.success('Cập nhật tài khoản ngân hàng thành công!')
      } else {
        // Add new account
        const newAccount = {
          id: Date.now(),
          bankCode: this.accountForm.bankCode,
          bankName: this.accountForm.bankName,
          accountNumber: this.accountForm.accountNumber,
          accountName: this.accountForm.accountName.toUpperCase(),
          accountType: this.accountForm.accountType === 'savings' ? 'Tiết kiệm' : 'Thanh toán',
          branch: this.accountForm.branch,
          isDefault: this.accountForm.isDefault,
          status: 'pending',
          logo: selectedBank?.logo,
          createdAt: new Date().toISOString().split('T')[0],
          lastUsed: null
        }
        
        // If set as default, update other accounts
        if (this.accountForm.isDefault) {
          this.bankAccounts.forEach(account => {
            account.isDefault = false
          })
        }
        
        this.bankAccounts.push(newAccount)
        this.$toast.success('Thêm tài khoản ngân hàng thành công!')
      }
      
      this.closeModal()
    }
  }
}
</script>