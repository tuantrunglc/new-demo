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
          <h1 class="text-lg font-semibold">Nạp tiền vào ví</h1>
          <div class="w-20"></div>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Deposit Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Current Balance -->
          <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-medium opacity-90">Số dư hiện tại</h2>
                <p class="text-3xl font-bold mt-2">{{ formatPrice(currentBalance) }}</p>
              </div>
              <div class="text-right">
                <svg class="w-12 h-12 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Deposit Form -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-semibold mb-4">Yêu cầu nạp tiền</h2>
            
            <form @submit.prevent="submitDepositRequest">
              <div class="space-y-4">
                <!-- Amount Input -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Số tiền cần nạp *</label>
                  <div class="relative">
                    <input 
                      v-model="depositAmount"
                      type="number" 
                      min="50000"
                      step="10000"
                      class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                      placeholder="Nhập số tiền (tối thiểu 50,000đ)"
                      required
                    >
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span class="text-gray-500 text-sm">VND</span>
                    </div>
                  </div>
                  <div class="mt-2 flex flex-wrap gap-2">
                    <button 
                      v-for="amount in quickAmounts" 
                      :key="amount"
                      type="button"
                      @click="depositAmount = amount"
                      class="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                    >
                      {{ formatPrice(amount) }}
                    </button>
                  </div>
                </div>

                <!-- Description -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Mô tả (tùy chọn)</label>
                  <textarea 
                    v-model="description"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập mô tả cho yêu cầu nạp tiền..."
                  ></textarea>
                </div>

                <!-- Upload Receipt -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Ảnh chứng từ chuyển khoản
                    <span class="text-red-500">*</span>
                  </label>
                  <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input 
                      ref="fileInput"
                      type="file" 
                      accept="image/*"
                      @change="handleFileUpload"
                      class="hidden"
                    >
                    
                    <!-- Upload Area -->
                    <div v-if="!uploadedImage" @click="$refs.fileInput.click()" class="cursor-pointer">
                      <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      <p class="text-gray-600 mb-2">Nhấp để tải lên ảnh chứng từ</p>
                      <p class="text-sm text-gray-500">PNG, JPG, JPEG (tối đa 5MB)</p>
                    </div>
                    
                    <!-- Preview Image -->
                    <div v-else class="relative">
                      <img :src="uploadedImage.preview" :alt="uploadedImage.name" class="max-w-full h-48 object-contain mx-auto rounded-lg">
                      <div class="mt-3 flex items-center justify-center space-x-4">
                        <div class="text-sm text-gray-600">
                          <i class="fas fa-file-image mr-1"></i>
                          {{ uploadedImage.name }}
                        </div>
                        <button @click="removeImage" type="button" class="text-red-600 hover:text-red-800 text-sm">
                          <i class="fas fa-trash mr-1"></i>
                          Xóa
                        </button>
                        <button @click="$refs.fileInput.click()" type="button" class="text-blue-600 hover:text-blue-800 text-sm">
                          <i class="fas fa-edit mr-1"></i>
                          Thay đổi
                        </button>
                      </div>
                    </div>
                  </div>
                  <p class="text-xs text-gray-500 mt-2">
                    <i class="fas fa-info-circle mr-1"></i>
                    Vui lòng chụp ảnh rõ nét biên lai chuyển khoản để được xử lý nhanh chóng
                  </p>
                </div>

                <!-- Submit Button -->
                <button 
                  type="submit"
                  :disabled="!depositAmount || depositAmount < 50000 || !uploadedImage || loading"
                  class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  <div v-if="loading" class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </div>
                  <span v-else>Gửi yêu cầu nạp tiền</span>
                </button>
              </div>
            </form>
          </div>

          <!-- Bank Transfer Info -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold mb-4">Thông tin chuyển khoản</h3>
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <span class="text-sm text-yellow-800">Vui lòng chuyển khoản chính xác số tiền và nội dung</span>
              </div>
            </div>
            
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-gray-50 rounded-lg p-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Số tài khoản</label>
                  <div class="flex items-center justify-between">
                    <span class="font-mono text-lg font-semibold">1234567890</span>
                    <button 
                      @click="copyToClipboard('1234567890')"
                      class="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Chủ tài khoản</label>
                  <span class="font-semibold">CÔNG TY TNHH ECOMMERCE</span>
                </div>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Ngân hàng</label>
                <span class="font-semibold">Ngân hàng Thương mại Cổ phần Á Châu (ACB)</span>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Nội dung chuyển khoản</label>
                <div class="flex items-center justify-between">
                  <span class="font-mono text-lg font-semibold text-blue-600">NAP {{ userInfo.id || 'USER' }}</span>
                  <button 
                    @click="copyToClipboard(`NAP ${userInfo.id || 'USER'}`)"
                    class="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Instructions -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold mb-4">Hướng dẫn nạp tiền</h3>
            <div class="space-y-3">
              <div class="flex items-start">
                <div class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</div>
                <div>
                  <p class="font-medium">Gửi yêu cầu nạp tiền</p>
                  <p class="text-sm text-gray-600">Điền số tiền cần nạp và gửi yêu cầu trên trang này</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</div>
                <div>
                  <p class="font-medium">Chuyển khoản</p>
                  <p class="text-sm text-gray-600">Chuyển khoản chính xác số tiền và nội dung theo thông tin trên</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</div>
                <div>
                  <p class="font-medium">Liên hệ CSKH</p>
                  <p class="text-sm text-gray-600">Gửi ảnh chụp biên lai cho CSKH qua Zalo: <span class="font-semibold text-blue-600">0123456789</span></p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</div>
                <div>
                  <p class="font-medium">Chờ xác nhận</p>
                  <p class="text-sm text-gray-600">CSKH sẽ xác nhận và nạp tiền vào ví trong vòng 5-10 phút</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Deposit History -->
        <div class="space-y-6">
          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-4 border-b border-gray-200">
              <h3 class="font-semibold">Lịch sử nạp tiền</h3>
            </div>
            
            <div class="p-4">
              <div v-if="depositHistory.length === 0" class="text-center py-8">
                <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                <p class="text-gray-500">Chưa có lịch sử nạp tiền</p>
              </div>
              
              <div v-else class="space-y-3">
                <div 
                  v-for="request in depositHistory" 
                  :key="request.id"
                  class="border border-gray-200 rounded-lg p-4"
                >
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <p class="font-medium">{{ formatPrice(request.amount) }}</p>
                      <p class="text-sm text-gray-500">{{ formatDateTime(request.createdAt) }}</p>
                    </div>
                    <span 
                      class="px-2 py-1 text-xs rounded-full"
                      :class="getStatusClass(request.status)"
                    >
                      {{ getStatusText(request.status) }}
                    </span>
                  </div>
                  
                  <div v-if="request.description" class="text-sm text-gray-600 mb-2">
                    {{ request.description }}
                  </div>
                  
                  <div class="text-xs text-gray-400">
                    Mã yêu cầu: {{ request.id }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Support -->
          <div class="bg-white rounded-lg shadow-sm p-4">
            <h3 class="font-semibold mb-3">Hỗ trợ nhanh</h3>
            <div class="space-y-2">
              <a 
                href="tel:0123456789" 
                class="flex items-center p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <div>
                  <div class="font-medium">Hotline</div>
                  <div class="text-sm">0123 456 789</div>
                </div>
              </a>
              
              <a 
                href="https://zalo.me/0123456789" 
                target="_blank"
                class="flex items-center p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                </svg>
                <div>
                  <div class="font-medium">Zalo CSKH</div>
                  <div class="text-sm">0123 456 789</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useUserStore } from '../../stores/userStore'

export default {
  name: 'DepositView',
  setup() {
    const toast = useToast()
    const userStore = useUserStore()
    
    const loading = ref(false)
    const depositAmount = ref('')
    const description = ref('')
    const uploadedImage = ref(null)
    const currentBalance = ref(1500000)
    const userInfo = ref({
      id: 'USER123',
      name: 'Nguyễn Văn A'
    })
    
    const quickAmounts = ref([
      50000, 100000, 200000, 500000, 1000000, 2000000
    ])
    
    const depositHistory = ref([
      {
        id: 'DEP001',
        amount: 500000,
        status: 'completed',
        description: 'Nạp tiền vào ví',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 'DEP002',
        amount: 200000,
        status: 'pending',
        description: 'Nạp tiền khẩn cấp',
        createdAt: '2024-01-14T15:45:00Z'
      },
      {
        id: 'DEP003',
        amount: 100000,
        status: 'rejected',
        description: 'Nạp tiền test',
        createdAt: '2024-01-13T09:15:00Z'
      }
    ])
    
    const formatPrice = (price) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
      }).format(price)
    }
    
    const formatDateTime = (dateString) => {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    }
    
    const getStatusClass = (status) => {
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
    }
    
    const getStatusText = (status) => {
      switch (status) {
        case 'completed':
          return 'Hoàn thành'
        case 'pending':
          return 'Chờ xử lý'
        case 'rejected':
          return 'Từ chối'
        default:
          return 'Không xác định'
      }
    }
    
    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text).then(() => {
        toast.success('Đã sao chép vào clipboard!')
      }).catch(() => {
        toast.error('Không thể sao chép!')
      })
    }
    
    const handleFileUpload = (event) => {
      const file = event.target.files[0]
      if (!file) return
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file ảnh (PNG, JPG, JPEG)')
        return
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước file không được vượt quá 5MB')
        return
      }
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        uploadedImage.value = {
          file: file,
          name: file.name,
          size: file.size,
          preview: e.target.result
        }
      }
      reader.readAsDataURL(file)
    }
    
    const removeImage = () => {
      uploadedImage.value = null
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]')
      if (fileInput) {
        fileInput.value = ''
      }
    }
    
    const submitDepositRequest = async () => {
      if (!depositAmount.value || depositAmount.value < 50000) {
        toast.error('Số tiền nạp phải tối thiểu 50,000đ')
        return
      }
      
      if (!uploadedImage.value) {
        toast.error('Vui lòng tải lên ảnh chứng từ chuyển khoản')
        return
      }
      
      loading.value = true
      
      try {
        // Simulate API call with image upload
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const newRequest = {
          id: `DEP${Date.now()}`,
          amount: depositAmount.value,
          status: 'pending',
          description: description.value || 'Yêu cầu nạp tiền',
          receiptImage: uploadedImage.value.preview,
          receiptFileName: uploadedImage.value.name,
          createdAt: new Date().toISOString()
        }
        
        depositHistory.value.unshift(newRequest)
        
        toast.success('Yêu cầu nạp tiền đã được gửi thành công!')
        
        // Reset form
        depositAmount.value = ''
        description.value = ''
        uploadedImage.value = null
        
      } catch (error) {
        toast.error('Có lỗi xảy ra, vui lòng thử lại!')
      } finally {
        loading.value = false
      }
    }
    
    onMounted(() => {
      // Load user info and current balance
      if (userStore.currentUser) {
        userInfo.value = userStore.currentUser
      }
    })
    
    return {
      loading,
      depositAmount,
      description,
      uploadedImage,
      currentBalance,
      userInfo,
      quickAmounts,
      depositHistory,
      formatPrice,
      formatDateTime,
      getStatusClass,
      getStatusText,
      copyToClipboard,
      handleFileUpload,
      removeImage,
      submitDepositRequest
    }
  }
}
</script>

<style scoped>
/* Custom styles if needed */
</style>