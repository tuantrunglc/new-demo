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
          <h1 class="text-lg font-semibold">Rút tiền</h1>
          <div class="w-20"></div>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Withdrawal Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Wallet Balance -->
          <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-semibold mb-2">Số dư ví hiện tại</h2>
                <p class="text-3xl font-bold">{{ formatPrice(walletBalance) }}</p>
              </div>
              <div class="text-right">
                <svg class="w-12 h-12 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
            </div>
            <div class="mt-4 text-sm opacity-90">
              <p>Số tiền có thể rút: {{ formatPrice(availableBalance) }}</p>
            </div>
          </div>

          <!-- Withdrawal Form -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-semibold mb-6">Thông tin rút tiền</h2>
            
            <!-- Amount Input -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Số tiền muốn rút *</label>
              <div class="relative">
                <input 
                  v-model="withdrawalAmount"
                  type="number"
                  min="50000"
                  :max="availableBalance"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  placeholder="Nhập số tiền"
                >
                <span class="absolute right-3 top-3 text-gray-500">VND</span>
              </div>
              <div class="mt-2 flex flex-wrap gap-2">
                <button 
                  v-for="amount in quickAmounts" 
                  :key="amount"
                  @click="withdrawalAmount = amount"
                  class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {{ formatPrice(amount) }}
                </button>
                <button 
                  @click="withdrawalAmount = availableBalance"
                  class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                >
                  Tất cả
                </button>
              </div>
              <p class="mt-2 text-sm text-gray-500">
                Số tiền tối thiểu: {{ formatPrice(50000) }} - Tối đa: {{ formatPrice(availableBalance) }}
              </p>
            </div>

            <!-- Bank Account Selection -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Tài khoản ngân hàng *</label>
              <div class="space-y-3">
                <div 
                  v-for="account in bankAccounts" 
                  :key="account.id"
                  class="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                  :class="selectedAccount === account.id ? 'border-blue-500 bg-blue-50' : ''"
                  @click="selectedAccount = account.id"
                >
                  <div class="flex items-center">
                    <input 
                      :id="`account-${account.id}`"
                      v-model="selectedAccount" 
                      :value="account.id"
                      type="radio" 
                      class="text-blue-600 focus:ring-blue-500"
                    >
                    <label :for="`account-${account.id}`" class="ml-3 flex-1 cursor-pointer">
                      <div class="flex items-center justify-between">
                        <div>
                          <div class="font-medium">{{ account.bankName }}</div>
                          <div class="text-sm text-gray-500">{{ account.accountNumber }}</div>
                          <div class="text-sm text-gray-500">{{ account.accountName }}</div>
                        </div>
                        <img :src="account.logo" :alt="account.bankName" class="w-12 h-8 object-contain">
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              
              <button 
                @click="showAddBankModal = true"
                class="mt-3 flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Thêm tài khoản ngân hàng mới
              </button>
            </div>

            <!-- Withdrawal Note -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
              <textarea 
                v-model="withdrawalNote"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ghi chú cho yêu cầu rút tiền (tùy chọn)"
              ></textarea>
            </div>

            <!-- Submit Button -->
            <button 
              @click="submitWithdrawal"
              :disabled="!isFormValid"
              class="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Gửi yêu cầu rút tiền
            </button>
          </div>
        </div>

        <!-- Right Column - Info & History -->
        <div class="space-y-6">
          <!-- Withdrawal Info -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="font-semibold mb-4">Thông tin rút tiền</h3>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Phí rút tiền:</span>
                <span class="font-medium">{{ formatPrice(withdrawalFee) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Thời gian xử lý:</span>
                <span class="font-medium">1-3 ngày làm việc</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Giờ làm việc:</span>
                <span class="font-medium">8:00 - 17:00</span>
              </div>
            </div>
          </div>

          <!-- Recent Withdrawals -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="font-semibold mb-4">Lịch sử rút tiền gần đây</h3>
            <div class="space-y-3">
              <div 
                v-for="withdrawal in recentWithdrawals" 
                :key="withdrawal.id"
                class="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
              >
                <div>
                  <div class="font-medium">{{ formatPrice(withdrawal.amount) }}</div>
                  <div class="text-sm text-gray-500">{{ withdrawal.date }}</div>
                </div>
                <span 
                  class="px-2 py-1 text-xs rounded-full"
                  :class="getStatusClass(withdrawal.status)"
                >
                  {{ getStatusText(withdrawal.status) }}
                </span>
              </div>
            </div>
            
            <button 
              @click="$router.push('/withdrawal-history')"
              class="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Xem tất cả lịch sử
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Bank Account Modal -->
    <div v-if="showAddBankModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">Thêm tài khoản ngân hàng</h3>
          <button @click="showAddBankModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ngân hàng</label>
            <select 
              v-model="newBankAccount.bankCode"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Chọn ngân hàng</option>
              <option value="vcb">Vietcombank</option>
              <option value="tcb">Techcombank</option>
              <option value="mb">MB Bank</option>
              <option value="acb">ACB</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Số tài khoản</label>
            <input 
              v-model="newBankAccount.accountNumber"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập số tài khoản"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tên chủ tài khoản</label>
            <input 
              v-model="newBankAccount.accountName"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập tên chủ tài khoản"
            >
          </div>
        </div>
        
        <div class="flex space-x-3 mt-6">
          <button 
            @click="showAddBankModal = false"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Hủy
          </button>
          <button 
            @click="addBankAccount"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WithdrawalView',
  data() {
    return {
      walletBalance: 2500000,
      availableBalance: 2300000,
      withdrawalAmount: null,
      selectedAccount: null,
      withdrawalNote: '',
      withdrawalFee: 5000,
      showAddBankModal: false,
      quickAmounts: [100000, 200000, 500000, 1000000, 2000000],
      bankAccounts: [
        {
          id: 1,
          bankName: 'Vietcombank',
          bankCode: 'vcb',
          accountNumber: '1234567890',
          accountName: 'NGUYEN VAN A',
          logo: 'https://via.placeholder.com/48x32/00A651/FFFFFF?text=VCB'
        },
        {
          id: 2,
          bankName: 'Techcombank',
          bankCode: 'tcb',
          accountNumber: '0987654321',
          accountName: 'NGUYEN VAN A',
          logo: 'https://via.placeholder.com/48x32/0066CC/FFFFFF?text=TCB'
        }
      ],
      newBankAccount: {
        bankCode: '',
        accountNumber: '',
        accountName: ''
      },
      recentWithdrawals: [
        {
          id: 1,
          amount: 500000,
          date: '2024-01-15',
          status: 'completed'
        },
        {
          id: 2,
          amount: 1000000,
          date: '2024-01-10',
          status: 'pending'
        },
        {
          id: 3,
          amount: 300000,
          date: '2024-01-05',
          status: 'rejected'
        }
      ]
    }
  },
  computed: {
    isFormValid() {
      return this.withdrawalAmount && 
             this.withdrawalAmount >= 50000 && 
             this.withdrawalAmount <= this.availableBalance &&
             this.selectedAccount
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price)
    },
    getStatusClass(status) {
      switch (status) {
        case 'completed':
          return 'bg-green-100 text-green-800'
        case 'pending':
          return 'bg-yellow-100 text-yellow-800'
        case 'rejected':
          return 'bg-red-100 text-red-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    },
    getStatusText(status) {
      switch (status) {
        case 'completed':
          return 'Hoàn thành'
        case 'pending':
          return 'Đang xử lý'
        case 'rejected':
          return 'Từ chối'
        default:
          return 'Không xác định'
      }
    },
    addBankAccount() {
      if (this.newBankAccount.bankCode && this.newBankAccount.accountNumber && this.newBankAccount.accountName) {
        const newAccount = {
          id: Date.now(),
          bankName: this.getBankName(this.newBankAccount.bankCode),
          bankCode: this.newBankAccount.bankCode,
          accountNumber: this.newBankAccount.accountNumber,
          accountName: this.newBankAccount.accountName.toUpperCase(),
          logo: `https://via.placeholder.com/48x32/0066CC/FFFFFF?text=${this.newBankAccount.bankCode.toUpperCase()}`
        }
        
        this.bankAccounts.push(newAccount)
        this.selectedAccount = newAccount.id
        this.showAddBankModal = false
        this.newBankAccount = { bankCode: '', accountNumber: '', accountName: '' }
        this.$toast.success('Thêm tài khoản ngân hàng thành công!')
      }
    },
    getBankName(bankCode) {
      const banks = {
        vcb: 'Vietcombank',
        tcb: 'Techcombank',
        mb: 'MB Bank',
        acb: 'ACB'
      }
      return banks[bankCode] || bankCode.toUpperCase()
    },
    submitWithdrawal() {
      if (!this.isFormValid) {
        this.$toast.error('Vui lòng kiểm tra lại thông tin!')
        return
      }

      // const withdrawalData = {
      //   amount: this.withdrawalAmount,
      //   accountId: this.selectedAccount,
      //   note: this.withdrawalNote,
      //   fee: this.withdrawalFee
      // }

      // Call API to submit withdrawal request
      this.$toast.success('Gửi yêu cầu rút tiền thành công!')
      this.$router.push('/wallet')
    }
  }
}
</script>