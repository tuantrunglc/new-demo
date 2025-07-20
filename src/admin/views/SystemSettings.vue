<template>
  <div class="bg-gray-50 min-h-screen pb-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-indigo-800">
          <i class="fas fa-cogs mr-3 text-indigo-600"></i>
          Cài đặt hệ thống
        </h1>
        <button 
          @click="saveAllSettings"
          :disabled="saving"
          class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          <i class="fas fa-save mr-2"></i>
          {{ saving ? 'Đang lưu...' : 'Lưu tất cả' }}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Main Settings -->
        <div class="lg:col-span-2 space-y-6">
          <!-- General Settings -->
          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-lg font-semibold flex items-center">
                <i class="fas fa-store mr-2 text-indigo-600"></i>
                Thông tin chung
              </h2>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Tên website *</label>
                  <input 
                    v-model="settings.general.siteName"
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="ShopVN"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Slogan</label>
                  <input 
                    v-model="settings.general.slogan"
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Mua sắm thông minh, tiết kiệm hơn"
                  >
                </div>
              </div>
              
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Mô tả website</label>
                <textarea 
                  v-model="settings.general.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Mô tả ngắn gọn về website"
                ></textarea>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email liên hệ</label>
                  <input 
                    v-model="settings.general.contactEmail"
                    type="email" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="support@shopvn.com"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                  <input 
                    v-model="settings.general.contactPhone"
                    type="tel" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0123456789"
                  >
                </div>
              </div>
              
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                <textarea 
                  v-model="settings.general.address"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Địa chỉ công ty"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Business Settings -->
          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-lg font-semibold flex items-center">
                <i class="fas fa-business-time mr-2 text-indigo-600"></i>
                Cài đặt kinh doanh
              </h2>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Phí giao dịch (%)</label>
                  <input 
                    v-model.number="settings.business.transactionFee"
                    type="number" 
                    step="0.1"
                    min="0"
                    max="100"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="2.5"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Hoa hồng mặc định (%)</label>
                  <input 
                    v-model.number="settings.business.defaultCommission"
                    type="number" 
                    step="0.1"
                    min="0"
                    max="100"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="5.0"
                  >
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Số tiền nạp tối thiểu (VND)</label>
                  <input 
                    v-model.number="settings.business.minDepositAmount"
                    type="number" 
                    step="10000"
                    min="0"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="50000"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Số tiền rút tối thiểu (VND)</label>
                  <input 
                    v-model.number="settings.business.minWithdrawAmount"
                    type="number" 
                    step="10000"
                    min="0"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="100000"
                  >
                </div>
              </div>
              
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Thời gian xử lý giao dịch (phút)</label>
                <input 
                  v-model.number="settings.business.processingTime"
                  type="number" 
                  min="1"
                  max="1440"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="10"
                >
              </div>
            </div>
          </div>

          <!-- Security Settings -->
          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-lg font-semibold flex items-center">
                <i class="fas fa-shield-alt mr-2 text-indigo-600"></i>
                Cài đặt bảo mật
              </h2>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Yêu cầu xác thực email</label>
                    <p class="text-sm text-gray-500">Bắt buộc xác thực email khi đăng ký</p>
                  </div>
                  <button 
                    @click="settings.security.requireEmailVerification = !settings.security.requireEmailVerification"
                    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    :class="settings.security.requireEmailVerification ? 'bg-indigo-600' : 'bg-gray-200'"
                  >
                    <span 
                      class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                      :class="settings.security.requireEmailVerification ? 'translate-x-6' : 'translate-x-1'"
                    ></span>
                  </button>
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Yêu cầu xác thực số điện thoại</label>
                    <p class="text-sm text-gray-500">Bắt buộc xác thực SMS khi đăng ký</p>
                  </div>
                  <button 
                    @click="settings.security.requirePhoneVerification = !settings.security.requirePhoneVerification"
                    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    :class="settings.security.requirePhoneVerification ? 'bg-indigo-600' : 'bg-gray-200'"
                  >
                    <span 
                      class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                      :class="settings.security.requirePhoneVerification ? 'translate-x-6' : 'translate-x-1'"
                    ></span>
                  </button>
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Cho phép đăng ký mới</label>
                    <p class="text-sm text-gray-500">Cho phép người dùng đăng ký tài khoản mới</p>
                  </div>
                  <button 
                    @click="settings.security.allowRegistration = !settings.security.allowRegistration"
                    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    :class="settings.security.allowRegistration ? 'bg-indigo-600' : 'bg-gray-200'"
                  >
                    <span 
                      class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                      :class="settings.security.allowRegistration ? 'translate-x-6' : 'translate-x-1'"
                    ></span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Notification Settings -->
          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-lg font-semibold flex items-center">
                <i class="fas fa-bell mr-2 text-indigo-600"></i>
                Cài đặt thông báo
              </h2>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Email thông báo đơn hàng mới</label>
                    <p class="text-sm text-gray-500">Gửi email khi có đơn hàng mới</p>
                  </div>
                  <button 
                    @click="settings.notifications.emailNewOrder = !settings.notifications.emailNewOrder"
                    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    :class="settings.notifications.emailNewOrder ? 'bg-indigo-600' : 'bg-gray-200'"
                  >
                    <span 
                      class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                      :class="settings.notifications.emailNewOrder ? 'translate-x-6' : 'translate-x-1'"
                    ></span>
                  </button>
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <label class="text-sm font-medium text-gray-700">SMS thông báo</label>
                    <p class="text-sm text-gray-500">Gửi SMS cho các thông báo quan trọng</p>
                  </div>
                  <button 
                    @click="settings.notifications.smsNotification = !settings.notifications.smsNotification"
                    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    :class="settings.notifications.smsNotification ? 'bg-indigo-600' : 'bg-gray-200'"
                  >
                    <span 
                      class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                      :class="settings.notifications.smsNotification ? 'translate-x-6' : 'translate-x-1'"
                    ></span>
                  </button>
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Push notification</label>
                    <p class="text-sm text-gray-500">Gửi thông báo đẩy trên trình duyệt</p>
                  </div>
                  <button 
                    @click="settings.notifications.pushNotification = !settings.notifications.pushNotification"
                    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    :class="settings.notifications.pushNotification ? 'bg-indigo-600' : 'bg-gray-200'"
                  >
                    <span 
                      class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                      :class="settings.notifications.pushNotification ? 'translate-x-6' : 'translate-x-1'"
                    ></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Side Settings -->
        <div class="space-y-6">
          <!-- Logo & Images -->
          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-lg font-semibold flex items-center">
                <i class="fas fa-image mr-2 text-indigo-600"></i>
                Logo & Hình ảnh
              </h2>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Logo chính</label>
                  <div class="flex items-center space-x-4">
                    <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <i class="fas fa-image text-gray-400 text-2xl"></i>
                    </div>
                    <div>
                      <button class="px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
                        Chọn file
                      </button>
                      <p class="text-xs text-gray-500 mt-1">PNG, JPG (tối đa 2MB)</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
                  <div class="flex items-center space-x-4">
                    <div class="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                      <i class="fas fa-star text-gray-400 text-sm"></i>
                    </div>
                    <div>
                      <button class="px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
                        Chọn file
                      </button>
                      <p class="text-xs text-gray-500 mt-1">ICO, PNG (32x32px)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Social Media -->
          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-lg font-semibold flex items-center">
                <i class="fas fa-share-alt mr-2 text-indigo-600"></i>
                Mạng xã hội
              </h2>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                  <input 
                    v-model="settings.social.facebook"
                    type="url" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://facebook.com/shopvn"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Zalo</label>
                  <input 
                    v-model="settings.social.zalo"
                    type="url" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://zalo.me/shopvn"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">YouTube</label>
                  <input 
                    v-model="settings.social.youtube"
                    type="url" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://youtube.com/shopvn"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">TikTok</label>
                  <input 
                    v-model="settings.social.tiktok"
                    type="url" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://tiktok.com/@shopvn"
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Maintenance Mode -->
          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-lg font-semibold flex items-center">
                <i class="fas fa-tools mr-2 text-indigo-600"></i>
                Chế độ bảo trì
              </h2>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Bật chế độ bảo trì</label>
                    <p class="text-sm text-gray-500">Tạm thời đóng website để bảo trì</p>
                  </div>
                  <button 
                    @click="settings.maintenance.enabled = !settings.maintenance.enabled"
                    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    :class="settings.maintenance.enabled ? 'bg-red-600' : 'bg-gray-200'"
                  >
                    <span 
                      class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                      :class="settings.maintenance.enabled ? 'translate-x-6' : 'translate-x-1'"
                    ></span>
                  </button>
                </div>
                
                <div v-if="settings.maintenance.enabled">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Thông báo bảo trì</label>
                  <textarea 
                    v-model="settings.maintenance.message"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Website đang được bảo trì, vui lòng quay lại sau..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- System Status -->
          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-lg font-semibold flex items-center">
                <i class="fas fa-server mr-2 text-indigo-600"></i>
                Trạng thái hệ thống
              </h2>
            </div>
            <div class="p-6">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Database</span>
                  <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    <i class="fas fa-check mr-1"></i>Hoạt động
                  </span>
                </div>
                
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Cache</span>
                  <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    <i class="fas fa-check mr-1"></i>Hoạt động
                  </span>
                </div>
                
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Storage</span>
                  <span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    <i class="fas fa-exclamation-triangle mr-1"></i>75% đầy
                  </span>
                </div>
                
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Email Service</span>
                  <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    <i class="fas fa-check mr-1"></i>Hoạt động
                  </span>
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
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'

export default {
  name: 'SystemSettings',
  setup() {
    const saving = ref(false)
    
    const settings = ref({
      general: {
        siteName: 'ShopVN',
        slogan: 'Mua sắm thông minh, tiết kiệm hơn',
        description: 'Nền tảng thương mại điện tử hàng đầu Việt Nam',
        contactEmail: 'support@shopvn.com',
        contactPhone: '0123456789',
        address: '123 Đường ABC, Phường DEF, Quận GHI, TP.HCM'
      },
      business: {
        transactionFee: 2.5,
        defaultCommission: 5.0,
        minDepositAmount: 50000,
        minWithdrawAmount: 100000,
        processingTime: 10
      },
      security: {
        requireEmailVerification: true,
        requirePhoneVerification: false,
        allowRegistration: true
      },
      notifications: {
        emailNewOrder: true,
        smsNotification: false,
        pushNotification: true
      },
      social: {
        facebook: 'https://facebook.com/shopvn',
        zalo: 'https://zalo.me/shopvn',
        youtube: 'https://youtube.com/shopvn',
        tiktok: 'https://tiktok.com/@shopvn'
      },
      maintenance: {
        enabled: false,
        message: 'Website đang được bảo trì, vui lòng quay lại sau ít phút. Xin cảm ơn!'
      }
    })

    const loadSettings = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Load settings from localStorage or API
        const savedSettings = localStorage.getItem('systemSettings')
        if (savedSettings) {
          settings.value = { ...settings.value, ...JSON.parse(savedSettings) }
        }
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    }

    const saveAllSettings = async () => {
      const result = await Swal.fire({
        title: 'Xác nhận lưu cài đặt?',
        text: 'Tất cả các thay đổi sẽ được áp dụng ngay lập tức.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#4f46e5',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Lưu ngay',
        cancelButtonText: 'Hủy'
      })

      if (result.isConfirmed) {
        saving.value = true
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 2000))
          
          // Save to localStorage (in real app, this would be API call)
          localStorage.setItem('systemSettings', JSON.stringify(settings.value))
          
          await Swal.fire({
            title: 'Đã lưu!',
            text: 'Cài đặt hệ thống đã được lưu thành công.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          })
          
        } catch (error) {
          await Swal.fire({
            title: 'Lỗi!',
            text: 'Có lỗi xảy ra khi lưu cài đặt.',
            icon: 'error'
          })
        } finally {
          saving.value = false
        }
      }
    }

    onMounted(() => {
      loadSettings()
    })

    return {
      saving,
      settings,
      saveAllSettings
    }
  }
}
</script>

<style scoped>
/* Custom toggle button styles */
.toggle-button {
  transition: all 0.3s ease;
}
</style>