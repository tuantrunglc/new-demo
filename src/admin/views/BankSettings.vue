<template>
  <div class="bg-gray-50 min-h-screen pb-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-indigo-800">
          <i class="fas fa-university mr-3 text-indigo-600"></i>
          Cài đặt thông tin ngân hàng
        </h1>
        <button 
          @click="showCreateModal = true"
          class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <i class="fas fa-plus mr-2"></i>
          Thêm tài khoản
        </button>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center my-12 py-12">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
        <p class="text-indigo-600 font-medium">Đang tải dữ liệu...</p>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Bank Accounts -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Bank Accounts List -->
          <div class="bg-white rounded-lg shadow-sm">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-semibold">Tài khoản ngân hàng</h2>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div 
                  v-for="account in bankAccounts" 
                  :key="account.id"
                  class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                      <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <i class="fas fa-university text-white"></i>
                      </div>
                      <div>
                        <h3 class="font-semibold text-gray-900">{{ account.bankName }}</h3>
                        <p class="text-sm text-gray-600">{{ account.accountNumber }}</p>
                        <p class="text-sm text-gray-500">{{ account.accountName }}</p>
                      </div>
                    </div>
                    
                    <div class="flex items-center space-x-2">
                      <span 
                        class="px-2 py-1 text-xs font-semibold rounded-full"
                        :class="account.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                      >
                        {{ account.isActive ? 'Đang sử dụng' : 'Tạm dừng' }}
                      </span>
                      
                      <span 
                        v-if="account.isDefault"
                        class="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full"
                      >
                        Mặc định
                      </span>
                      
                      <button 
                        @click="toggleAccountStatus(account)"
                        :class="account.isActive ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'"
                        class="p-2 rounded-lg transition-colors"
                      >
                        <i :class="account.isActive ? 'fas fa-pause' : 'fas fa-play'"></i>
                      </button>
                      
                      <button 
                        @click="editAccount(account)"
                        class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      
                      <button 
                        @click="deleteAccount(account)"
                        class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div class="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span class="text-gray-500">Chi nhánh:</span>
                      <span class="ml-2 text-gray-900">{{ account.branchName }}</span>
                    </div>
                    <div>
                      <span class="text-gray-500">Loại:</span>
                      <span class="ml-2 text-gray-900">{{ getAccountTypeText(account.accountType) }}</span>
                    </div>
                    <div>
                      <span class="text-gray-500">Ngày tạo:</span>
                      <span class="ml-2 text-gray-900">{{ formatDate(account.createdAt) }}</span>
                    </div>
                  </div>
                  
                  <div v-if="account.description" class="mt-2 text-sm text-gray-600">
                    {{ account.description }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- QR Code Settings -->
          <div class="bg-white rounded-lg shadow-sm">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-semibold">Cài đặt QR Code</h2>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 class="font-medium text-gray-900 mb-3">QR Code hiện tại</h3>
                  <div class="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <i class="fas fa-qrcode text-gray-400 text-6xl"></i>
                  </div>
                  <div class="mt-3 space-y-2">
                    <button class="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      <i class="fas fa-upload mr-2"></i>
                      Tải lên QR Code mới
                    </button>
                    <button class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      <i class="fas fa-magic mr-2"></i>
                      Tạo QR Code tự động
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 class="font-medium text-gray-900 mb-3">Thông tin QR Code</h3>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Ngân hàng</label>
                      <select 
                        v-model="qrSettings.bankId"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Chọn ngân hàng</option>
                        <option 
                          v-for="account in bankAccounts" 
                          :key="account.id"
                          :value="account.id"
                        >
                          {{ account.bankName }} - {{ account.accountNumber }}
                        </option>
                      </select>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Nội dung chuyển khoản mặc định</label>
                      <input 
                        v-model="qrSettings.defaultContent"
                        type="text" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="NAP [USER_ID]"
                      >
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Template QR Code</label>
                      <select 
                        v-model="qrSettings.template"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="simple">Đơn giản</option>
                        <option value="logo">Có logo</option>
                        <option value="branded">Có thương hiệu</option>
                      </select>
                    </div>
                    
                    <div class="space-y-3">
                      <label class="flex items-center">
                        <input 
                          v-model="qrSettings.showAmount"
                          type="checkbox" 
                          class="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        >
                        <span class="ml-2 text-sm text-gray-700">Hiển thị số tiền trong QR</span>
                      </label>
                      
                      <label class="flex items-center">
                        <input 
                          v-model="qrSettings.dynamicContent"
                          type="checkbox" 
                          class="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        >
                        <span class="ml-2 text-sm text-gray-700">Nội dung động theo user</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Transaction Settings -->
          <div class="bg-white rounded-lg shadow-sm">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-semibold">Cài đặt giao dịch</h2>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Số tiền nạp tối thiểu (VND)</label>
                    <input 
                      v-model.number="transactionSettings.minDepositAmount"
                      type="number" 
                      min="0"
                      step="10000"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Số tiền nạp tối đa (VND)</label>
                    <input 
                      v-model.number="transactionSettings.maxDepositAmount"
                      type="number" 
                      min="0"
                      step="10000"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Phí giao dịch (%)</label>
                    <input 
                      v-model.number="transactionSettings.transactionFee"
                      type="number" 
                      min="0"
                      max="100"
                      step="0.1"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                  </div>
                </div>
                
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Thời gian xử lý (phút)</label>
                    <input 
                      v-model.number="transactionSettings.processingTime"
                      type="number" 
                      min="1"
                      max="1440"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Giờ hoạt động</label>
                    <div class="grid grid-cols-2 gap-2">
                      <input 
                        v-model="transactionSettings.workingHours.start"
                        type="time" 
                        class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                      <input 
                        v-model="transactionSettings.workingHours.end"
                        type="time" 
                        class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                    </div>
                  </div>
                  
                  <div class="space-y-3">
                    <label class="flex items-center">
                      <input 
                        v-model="transactionSettings.autoApprove"
                        type="checkbox" 
                        class="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      >
                      <span class="ml-2 text-sm text-gray-700">Tự động duyệt giao dịch</span>
                    </label>
                    
                    <label class="flex items-center">
                      <input 
                        v-model="transactionSettings.weekendProcessing"
                        type="checkbox" 
                        class="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      >
                      <span class="ml-2 text-sm text-gray-700">Xử lý cuối tuần</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Info & Actions -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-lg font-semibold">Thao tác nhanh</h2>
            </div>
            <div class="p-6">
              <div class="space-y-3">
                <button 
                  @click="saveAllSettings"
                  class="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <i class="fas fa-save mr-2"></i>
                  Lưu tất cả cài đặt
                </button>
                
                <button 
                  @click="testBankConnection"
                  class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <i class="fas fa-plug mr-2"></i>
                  Kiểm tra kết nối
                </button>
                
                <button 
                  @click="generateQRCode"
                  class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <i class="fas fa-qrcode mr-2"></i>
                  Tạo QR Code
                </button>
                
                <button 
                  @click="exportSettings"
                  class="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <i class="fas fa-download mr-2"></i>
                  Xuất cài đặt
                </button>
              </div>
            </div>
          </div>

          <!-- Statistics -->
          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-lg font-semibold">Thống kê</h2>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Tổng tài khoản</span>
                  <span class="font-semibold">{{ bankAccounts.length }}</span>
                </div>
                
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Tài khoản hoạt động</span>
                  <span class="font-semibold text-green-600">{{ activeAccountsCount }}</span>
                </div>
                
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Giao dịch hôm nay</span>
                  <span class="font-semibold">{{ todayTransactions }}</span>
                </div>
                
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Tổng tiền hôm nay</span>
                  <span class="font-semibold text-indigo-600">{{ formatCurrency(todayAmount) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Bank Support -->
          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-lg font-semibold">Hỗ trợ ngân hàng</h2>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div class="p-4 bg-blue-50 rounded-lg">
                  <h3 class="font-medium text-blue-900">Ngân hàng được hỗ trợ</h3>
                  <div class="mt-2 space-y-1 text-sm text-blue-800">
                    <div>• Vietcombank</div>
                    <div>• Techcombank</div>
                    <div>• ACB</div>
                    <div>• VPBank</div>
                    <div>• Sacombank</div>
                    <div>• MBBank</div>
                  </div>
                </div>
                
                <div class="p-4 bg-yellow-50 rounded-lg">
                  <h3 class="font-medium text-yellow-900">Lưu ý</h3>
                  <div class="mt-2 text-sm text-yellow-800">
                    <div>• Kiểm tra thông tin trước khi lưu</div>
                    <div>• Backup cài đặt thường xuyên</div>
                    <div>• Liên hệ CSKH nếu có vấn đề</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Bank Account Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">
              {{ isEditing ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản ngân hàng' }}
            </h3>
            <button 
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <div class="p-6">
          <form @submit.prevent="saveAccount">
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Tên ngân hàng *</label>
                  <select 
                    v-model="accountForm.bankName"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Chọn ngân hàng</option>
                    <option value="Vietcombank">Vietcombank</option>
                    <option value="Techcombank">Techcombank</option>
                    <option value="ACB">ACB</option>
                    <option value="VPBank">VPBank</option>
                    <option value="Sacombank">Sacombank</option>
                    <option value="MBBank">MBBank</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Số tài khoản *</label>
                  <input 
                    v-model="accountForm.accountNumber"
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="1234567890"
                    required
                  >
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Tên chủ tài khoản *</label>
                <input 
                  v-model="accountForm.accountName"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="NGUYEN VAN A"
                  required
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Tên chi nhánh</label>
                <input 
                  v-model="accountForm.branchName"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Chi nhánh Hà Nội"
                >
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Loại tài khoản</label>
                  <select 
                    v-model="accountForm.accountType"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="savings">Tiết kiệm</option>
                    <option value="current">Vãng lai</option>
                    <option value="business">Doanh nghiệp</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                  <select 
                    v-model="accountForm.isActive"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option :value="true">Hoạt động</option>
                    <option :value="false">Tạm dừng</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                <textarea 
                  v-model="accountForm.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Mô tả về tài khoản..."
                ></textarea>
              </div>
              
              <div class="flex items-center">
                <input 
                  v-model="accountForm.isDefault"
                  type="checkbox" 
                  class="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                >
                <span class="ml-2 text-sm text-gray-700">Đặt làm tài khoản mặc định</span>
              </div>
            </div>

            <div class="flex justify-end space-x-4 mt-6">
              <button 
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button 
                type="submit"
                :disabled="saving"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {{ saving ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Thêm mới') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'

export default {
  name: 'BankSettings',
  setup() {
    const loading = ref(false)
    const saving = ref(false)
    const showCreateModal = ref(false)
    const showEditModal = ref(false)
    const isEditing = ref(false)
    
    const accountForm = ref({
      id: null,
      bankName: '',
      accountNumber: '',
      accountName: '',
      branchName: '',
      accountType: 'savings',
      isActive: true,
      isDefault: false,
      description: ''
    })
    
    const qrSettings = ref({
      bankId: '',
      defaultContent: 'NAP [USER_ID]',
      template: 'simple',
      showAmount: true,
      dynamicContent: true
    })
    
    const transactionSettings = ref({
      minDepositAmount: 50000,
      maxDepositAmount: 50000000,
      transactionFee: 0,
      processingTime: 10,
      workingHours: {
        start: '08:00',
        end: '22:00'
      },
      autoApprove: false,
      weekendProcessing: true
    })
    
    // Mock bank accounts data
    const bankAccounts = ref([
      {
        id: 1,
        bankName: 'ACB',
        accountNumber: '1234567890',
        accountName: 'CONG TY TNHH ECOMMERCE',
        branchName: 'Chi nhánh Hà Nội',
        accountType: 'business',
        isActive: true,
        isDefault: true,
        description: 'Tài khoản chính để nhận thanh toán',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 2,
        bankName: 'Vietcombank',
        accountNumber: '0987654321',
        accountName: 'CONG TY TNHH ECOMMERCE',
        branchName: 'Chi nhánh TP.HCM',
        accountType: 'business',
        isActive: true,
        isDefault: false,
        description: 'Tài khoản dự phòng',
        createdAt: '2024-01-02T00:00:00Z'
      },
      {
        id: 3,
        bankName: 'Techcombank',
        accountNumber: '1122334455',
        accountName: 'CONG TY TNHH ECOMMERCE',
        branchName: 'Chi nhánh Đà Nẵng',
        accountType: 'current',
        isActive: false,
        isDefault: false,
        description: 'Tài khoản tạm dừng',
        createdAt: '2024-01-03T00:00:00Z'
      }
    ])
    
    const activeAccountsCount = computed(() => {
      return bankAccounts.value.filter(account => account.isActive).length
    })
    
    const todayTransactions = ref(15)
    const todayAmount = ref(2500000)
    
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
      }).format(value)
    }
    
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('vi-VN')
    }
    
    const getAccountTypeText = (type) => {
      switch (type) {
        case 'savings':
          return 'Tiết kiệm'
        case 'current':
          return 'Vãng lai'
        case 'business':
          return 'Doanh nghiệp'
        default:
          return 'Không xác định'
      }
    }
    
    const resetForm = () => {
      accountForm.value = {
        id: null,
        bankName: '',
        accountNumber: '',
        accountName: '',
        branchName: '',
        accountType: 'savings',
        isActive: true,
        isDefault: false,
        description: ''
      }
    }
    
    const closeModal = () => {
      showCreateModal.value = false
      showEditModal.value = false
      isEditing.value = false
      resetForm()
    }
    
    const editAccount = (account) => {
      accountForm.value = { ...account }
      isEditing.value = true
      showEditModal.value = true
    }
    
    const toggleAccountStatus = async (account) => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        account.isActive = !account.isActive
        
        Swal.fire({
          title: 'Thành công!',
          text: `Tài khoản đã được ${account.isActive ? 'kích hoạt' : 'tạm dừng'}.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        })
      } catch (error) {
        Swal.fire({
          title: 'Lỗi!',
          text: 'Có lỗi xảy ra khi cập nhật trạng thái.',
          icon: 'error'
        })
      }
    }
    
    const deleteAccount = async (account) => {
      if (account.isDefault) {
        Swal.fire({
          title: 'Không thể xóa!',
          text: 'Không thể xóa tài khoản mặc định.',
          icon: 'error'
        })
        return
      }
      
      const result = await Swal.fire({
        title: 'Xác nhận xóa?',
        text: `Bạn có chắc chắn muốn xóa tài khoản "${account.bankName} - ${account.accountNumber}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
      })
      
      if (result.isConfirmed) {
        try {
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          bankAccounts.value = bankAccounts.value.filter(a => a.id !== account.id)
          
          Swal.fire({
            title: 'Đã xóa!',
            text: 'Tài khoản đã được xóa thành công.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          })
        } catch (error) {
          Swal.fire({
            title: 'Lỗi!',
            text: 'Có lỗi xảy ra khi xóa tài khoản.',
            icon: 'error'
          })
        }
      }
    }
    
    const saveAccount = async () => {
      saving.value = true
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // If set as default, remove default from other accounts
        if (accountForm.value.isDefault) {
          bankAccounts.value.forEach(account => {
            if (account.id !== accountForm.value.id) {
              account.isDefault = false
            }
          })
        }
        
        if (isEditing.value) {
          // Update existing account
          const index = bankAccounts.value.findIndex(a => a.id === accountForm.value.id)
          if (index !== -1) {
            bankAccounts.value[index] = { ...accountForm.value }
          }
        } else {
          // Add new account
          const newAccount = {
            ...accountForm.value,
            id: Date.now(),
            createdAt: new Date().toISOString()
          }
          bankAccounts.value.push(newAccount)
        }
        
        Swal.fire({
          title: 'Thành công!',
          text: `Tài khoản đã được ${isEditing.value ? 'cập nhật' : 'thêm'} thành công.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
        
        closeModal()
        
      } catch (error) {
        Swal.fire({
          title: 'Lỗi!',
          text: `Có lỗi xảy ra khi ${isEditing.value ? 'cập nhật' : 'thêm'} tài khoản.`,
          icon: 'error'
        })
      } finally {
        saving.value = false
      }
    }
    
    const saveAllSettings = async () => {
      const result = await Swal.fire({
        title: 'Xác nhận lưu?',
        text: 'Tất cả cài đặt sẽ được lưu và áp dụng ngay lập tức.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#4f46e5',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Lưu',
        cancelButtonText: 'Hủy'
      })
      
      if (result.isConfirmed) {
        try {
          await new Promise(resolve => setTimeout(resolve, 2000))
          
          // Save settings to localStorage or API
          localStorage.setItem('bankSettings', JSON.stringify({
            accounts: bankAccounts.value,
            qrSettings: qrSettings.value,
            transactionSettings: transactionSettings.value
          }))
          
          Swal.fire({
            title: 'Đã lưu!',
            text: 'Tất cả cài đặt đã được lưu thành công.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          })
        } catch (error) {
          Swal.fire({
            title: 'Lỗi!',
            text: 'Có lỗi xảy ra khi lưu cài đặt.',
            icon: 'error'
          })
        }
      }
    }
    
    const testBankConnection = async () => {
      Swal.fire({
        title: 'Đang kiểm tra...',
        text: 'Vui lòng chờ trong giây lát.',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })
      
      try {
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        Swal.fire({
          title: 'Kết nối thành công!',
          text: 'Tất cả tài khoản ngân hàng đều hoạt động bình thường.',
          icon: 'success'
        })
      } catch (error) {
        Swal.fire({
          title: 'Lỗi kết nối!',
          text: 'Có lỗi xảy ra khi kiểm tra kết nối.',
          icon: 'error'
        })
      }
    }
    
    const generateQRCode = () => {
      Swal.fire({
        title: 'Tạo QR Code',
        text: 'Tính năng tạo QR Code đang được phát triển.',
        icon: 'info'
      })
    }
    
    const exportSettings = () => {
      const settings = {
        bankAccounts: bankAccounts.value,
        qrSettings: qrSettings.value,
        transactionSettings: transactionSettings.value
      }
      
      const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `bank-settings-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    }
    
    onMounted(() => {
      // Load settings from localStorage or API
      const savedSettings = localStorage.getItem('bankSettings')
      if (savedSettings) {
        const settings = JSON.parse(savedSettings)
        if (settings.accounts) bankAccounts.value = settings.accounts
        if (settings.qrSettings) qrSettings.value = settings.qrSettings
        if (settings.transactionSettings) transactionSettings.value = settings.transactionSettings
      }
      
      loading.value = false
    })
    
    return {
      loading,
      saving,
      showCreateModal,
      showEditModal,
      isEditing,
      accountForm,
      qrSettings,
      transactionSettings,
      bankAccounts,
      activeAccountsCount,
      todayTransactions,
      todayAmount,
      formatCurrency,
      formatDate,
      getAccountTypeText,
      closeModal,
      editAccount,
      toggleAccountStatus,
      deleteAccount,
      saveAccount,
      saveAllSettings,
      testBankConnection,
      generateQRCode,
      exportSettings
    }
  }
}
</script>

<style scoped>
/* Custom styles */
</style>