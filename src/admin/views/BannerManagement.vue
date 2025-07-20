<template>
  <div class="bg-gray-50 min-h-screen pb-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-indigo-800">
          <i class="fas fa-images mr-3 text-indigo-600"></i>
          Quản lý Banner & Khuyến mãi
        </h1>
        <button 
          @click="showCreateModal = true"
          class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <i class="fas fa-plus mr-2"></i>
          Thêm banner
        </button>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center my-12 py-12">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
        <p class="text-indigo-600 font-medium">Đang tải dữ liệu...</p>
      </div>

      <div v-else>
        <!-- Filters -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Vị trí</label>
              <select 
                v-model="filters.position" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Tất cả vị trí</option>
                <option value="home-slider">Slider trang chủ</option>
                <option value="home-banner">Banner trang chủ</option>
                <option value="category-banner">Banner danh mục</option>
                <option value="sidebar">Sidebar</option>
                <option value="popup">Popup</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
              <select 
                v-model="filters.status" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm dừng</option>
                <option value="scheduled">Đã lên lịch</option>
                <option value="expired">Hết hạn</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
              <input 
                v-model="filters.search" 
                type="text" 
                placeholder="Tên banner, nội dung..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
            </div>
            
            <div class="flex items-end">
              <button 
                @click="resetFilters"
                class="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <i class="fas fa-refresh mr-2"></i>
                Đặt lại
              </button>
            </div>
          </div>
        </div>

        <!-- Banners Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="banner in filteredBanners" 
            :key="banner.id"
            class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <!-- Banner Image -->
            <div class="relative h-48 bg-gray-200">
              <img 
                v-if="banner.image" 
                :src="banner.image" 
                :alt="banner.title"
                class="w-full h-full object-cover"
              >
              <div v-else class="w-full h-full flex items-center justify-center">
                <i class="fas fa-image text-gray-400 text-4xl"></i>
              </div>
              
              <!-- Status Badge -->
              <div class="absolute top-4 right-4">
                <span 
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusClass(banner.status)"
                >
                  {{ getStatusText(banner.status) }}
                </span>
              </div>
              
              <!-- Priority Badge -->
              <div v-if="banner.priority > 0" class="absolute top-4 left-4">
                <span class="px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">
                  Ưu tiên {{ banner.priority }}
                </span>
              </div>
            </div>
            
            <!-- Banner Content -->
            <div class="p-6">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-lg font-semibold text-gray-900 truncate">{{ banner.title }}</h3>
                <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {{ getPositionText(banner.position) }}
                </span>
              </div>
              
              <p class="text-sm text-gray-600 mb-4 line-clamp-2">{{ banner.description }}</p>
              
              <div class="space-y-2 text-sm text-gray-500">
                <div class="flex items-center">
                  <i class="fas fa-calendar-alt mr-2"></i>
                  <span>{{ formatDateRange(banner.startDate, banner.endDate) }}</span>
                </div>
                
                <div class="flex items-center">
                  <i class="fas fa-eye mr-2"></i>
                  <span>{{ banner.views || 0 }} lượt xem</span>
                </div>
                
                <div class="flex items-center">
                  <i class="fas fa-mouse-pointer mr-2"></i>
                  <span>{{ banner.clicks || 0 }} lượt click</span>
                </div>
              </div>
              
              <!-- Action Buttons -->
              <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div class="flex items-center space-x-2">
                  <button 
                    @click="toggleBannerStatus(banner)"
                    :class="banner.status === 'active' ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'"
                    class="p-2 rounded-lg transition-colors"
                    :title="banner.status === 'active' ? 'Tạm dừng' : 'Kích hoạt'"
                  >
                    <i :class="banner.status === 'active' ? 'fas fa-pause' : 'fas fa-play'"></i>
                  </button>
                  
                  <button 
                    @click="editBanner(banner)"
                    class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  
                  <button 
                    @click="duplicateBanner(banner)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Sao chép"
                  >
                    <i class="fas fa-copy"></i>
                  </button>
                  
                  <button 
                    @click="deleteBanner(banner)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
                
                <div class="text-xs text-gray-400">
                  CTR: {{ getCTR(banner) }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Banner Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">
              {{ isEditing ? 'Chỉnh sửa banner' : 'Thêm banner mới' }}
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
          <form @submit.prevent="saveBanner">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Left Column -->
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Tiêu đề *</label>
                  <input 
                    v-model="bannerForm.title"
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Nhập tiêu đề banner"
                    required
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                  <textarea 
                    v-model="bannerForm.description"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Nhập mô tả banner"
                  ></textarea>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Hình ảnh *</label>
                  <div class="flex items-center space-x-4">
                    <div class="w-32 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                      <i class="fas fa-image text-gray-400 text-2xl"></i>
                    </div>
                    <div>
                      <button 
                        type="button"
                        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Chọn hình ảnh
                      </button>
                      <p class="text-xs text-gray-500 mt-1">PNG, JPG (tối đa 5MB)</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Đường dẫn</label>
                  <input 
                    v-model="bannerForm.link"
                    type="url" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://example.com"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nội dung HTML</label>
                  <textarea 
                    v-model="bannerForm.content"
                    rows="4"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="<div>Nội dung HTML tùy chỉnh</div>"
                  ></textarea>
                </div>
              </div>
              
              <!-- Right Column -->
              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Vị trí *</label>
                    <select 
                      v-model="bannerForm.position"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">Chọn vị trí</option>
                      <option value="home-slider">Slider trang chủ</option>
                      <option value="home-banner">Banner trang chủ</option>
                      <option value="category-banner">Banner danh mục</option>
                      <option value="sidebar">Sidebar</option>
                      <option value="popup">Popup</option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                    <select 
                      v-model="bannerForm.status"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Tạm dừng</option>
                      <option value="scheduled">Đã lên lịch</option>
                    </select>
                  </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Ngày bắt đầu</label>
                    <input 
                      v-model="bannerForm.startDate"
                      type="datetime-local" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Ngày kết thúc</label>
                    <input 
                      v-model="bannerForm.endDate"
                      type="datetime-local" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                  </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Độ ưu tiên</label>
                    <input 
                      v-model.number="bannerForm.priority"
                      type="number" 
                      min="0"
                      max="100"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="0"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Thứ tự sắp xếp</label>
                    <input 
                      v-model.number="bannerForm.sortOrder"
                      type="number" 
                      min="0"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="0"
                    >
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Thiết bị hiển thị</label>
                  <div class="space-y-2">
                    <label class="flex items-center">
                      <input 
                        v-model="bannerForm.devices"
                        type="checkbox" 
                        value="desktop"
                        class="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      >
                      <span class="ml-2 text-sm text-gray-700">Desktop</span>
                    </label>
                    <label class="flex items-center">
                      <input 
                        v-model="bannerForm.devices"
                        type="checkbox" 
                        value="tablet"
                        class="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      >
                      <span class="ml-2 text-sm text-gray-700">Tablet</span>
                    </label>
                    <label class="flex items-center">
                      <input 
                        v-model="bannerForm.devices"
                        type="checkbox" 
                        value="mobile"
                        class="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      >
                      <span class="ml-2 text-sm text-gray-700">Mobile</span>
                    </label>
                  </div>
                </div>
                
                <div class="space-y-3">
                  <label class="flex items-center">
                    <input 
                      v-model="bannerForm.isClickable"
                      type="checkbox" 
                      class="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    >
                    <span class="ml-2 text-sm text-gray-700">Cho phép click</span>
                  </label>
                  
                  <label class="flex items-center">
                    <input 
                      v-model="bannerForm.openInNewTab"
                      type="checkbox" 
                      class="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    >
                    <span class="ml-2 text-sm text-gray-700">Mở trong tab mới</span>
                  </label>
                  
                  <label class="flex items-center">
                    <input 
                      v-model="bannerForm.trackingEnabled"
                      type="checkbox" 
                      class="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    >
                    <span class="ml-2 text-sm text-gray-700">Bật theo dõi thống kê</span>
                  </label>
                </div>
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
  name: 'BannerManagement',
  setup() {
    const loading = ref(false)
    const saving = ref(false)
    const showCreateModal = ref(false)
    const showEditModal = ref(false)
    const isEditing = ref(false)
    
    const filters = ref({
      position: '',
      status: '',
      search: ''
    })
    
    const bannerForm = ref({
      id: null,
      title: '',
      description: '',
      image: null,
      link: '',
      content: '',
      position: '',
      status: 'active',
      startDate: '',
      endDate: '',
      priority: 0,
      sortOrder: 0,
      devices: ['desktop', 'tablet', 'mobile'],
      isClickable: true,
      openInNewTab: false,
      trackingEnabled: true
    })
    
    // Mock banners data
    const banners = ref([
      {
        id: 1,
        title: 'Khuyến mãi Black Friday',
        description: 'Giảm giá lên đến 70% cho tất cả sản phẩm',
        image: 'https://via.placeholder.com/800x400/1f2937/ffffff?text=Black+Friday+Sale',
        link: 'https://example.com/black-friday',
        content: '<div>HTML content</div>',
        position: 'home-slider',
        status: 'active',
        startDate: '2024-01-01T00:00:00',
        endDate: '2024-01-31T23:59:59',
        priority: 10,
        sortOrder: 1,
        devices: ['desktop', 'tablet', 'mobile'],
        isClickable: true,
        openInNewTab: false,
        trackingEnabled: true,
        views: 15420,
        clicks: 892
      },
      {
        id: 2,
        title: 'Sản phẩm mới 2024',
        description: 'Khám phá những sản phẩm mới nhất',
        image: 'https://via.placeholder.com/800x400/3b82f6/ffffff?text=New+Products+2024',
        link: 'https://example.com/new-products',
        content: '<div>HTML content</div>',
        position: 'home-banner',
        status: 'active',
        startDate: '2024-01-01T00:00:00',
        endDate: '2024-12-31T23:59:59',
        priority: 5,
        sortOrder: 2,
        devices: ['desktop', 'tablet'],
        isClickable: true,
        openInNewTab: true,
        trackingEnabled: true,
        views: 8234,
        clicks: 456
      },
      {
        id: 3,
        title: 'Popup khuyến mãi',
        description: 'Nhận voucher giảm giá 50K',
        image: 'https://via.placeholder.com/600x400/10b981/ffffff?text=Voucher+50K',
        link: 'https://example.com/voucher',
        content: '<div>Popup content</div>',
        position: 'popup',
        status: 'inactive',
        startDate: '2024-01-15T00:00:00',
        endDate: '2024-01-20T23:59:59',
        priority: 8,
        sortOrder: 1,
        devices: ['desktop', 'tablet', 'mobile'],
        isClickable: true,
        openInNewTab: false,
        trackingEnabled: true,
        views: 5678,
        clicks: 234
      }
    ])
    
    const filteredBanners = computed(() => {
      let filtered = banners.value
      
      if (filters.value.position) {
        filtered = filtered.filter(banner => banner.position === filters.value.position)
      }
      
      if (filters.value.status) {
        filtered = filtered.filter(banner => banner.status === filters.value.status)
      }
      
      if (filters.value.search) {
        const search = filters.value.search.toLowerCase()
        filtered = filtered.filter(banner => 
          banner.title.toLowerCase().includes(search) ||
          banner.description.toLowerCase().includes(search)
        )
      }
      
      return filtered.sort((a, b) => b.priority - a.priority || a.sortOrder - b.sortOrder)
    })
    
    const getStatusClass = (status) => {
      switch (status) {
        case 'active':
          return 'bg-green-100 text-green-800'
        case 'inactive':
          return 'bg-red-100 text-red-800'
        case 'scheduled':
          return 'bg-yellow-100 text-yellow-800'
        case 'expired':
          return 'bg-gray-100 text-gray-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }
    
    const getStatusText = (status) => {
      switch (status) {
        case 'active':
          return 'Hoạt động'
        case 'inactive':
          return 'Tạm dừng'
        case 'scheduled':
          return 'Đã lên lịch'
        case 'expired':
          return 'Hết hạn'
        default:
          return 'Không xác định'
      }
    }
    
    const getPositionText = (position) => {
      switch (position) {
        case 'home-slider':
          return 'Slider trang chủ'
        case 'home-banner':
          return 'Banner trang chủ'
        case 'category-banner':
          return 'Banner danh mục'
        case 'sidebar':
          return 'Sidebar'
        case 'popup':
          return 'Popup'
        default:
          return 'Không xác định'
      }
    }
    
    const formatDateRange = (startDate, endDate) => {
      const start = new Date(startDate).toLocaleDateString('vi-VN')
      const end = new Date(endDate).toLocaleDateString('vi-VN')
      return `${start} - ${end}`
    }
    
    const getCTR = (banner) => {
      if (!banner.views || banner.views === 0) return 0
      return ((banner.clicks || 0) / banner.views * 100).toFixed(1)
    }
    
    const resetForm = () => {
      bannerForm.value = {
        id: null,
        title: '',
        description: '',
        image: null,
        link: '',
        content: '',
        position: '',
        status: 'active',
        startDate: '',
        endDate: '',
        priority: 0,
        sortOrder: 0,
        devices: ['desktop', 'tablet', 'mobile'],
        isClickable: true,
        openInNewTab: false,
        trackingEnabled: true
      }
    }
    
    const resetFilters = () => {
      filters.value = {
        position: '',
        status: '',
        search: ''
      }
    }
    
    const closeModal = () => {
      showCreateModal.value = false
      showEditModal.value = false
      isEditing.value = false
      resetForm()
    }
    
    const editBanner = (banner) => {
      bannerForm.value = { ...banner }
      isEditing.value = true
      showEditModal.value = true
    }
    
    const duplicateBanner = (banner) => {
      const duplicated = {
        ...banner,
        id: Date.now(),
        title: banner.title + ' (Copy)',
        views: 0,
        clicks: 0
      }
      banners.value.push(duplicated)
    }
    
    const toggleBannerStatus = async (banner) => {
      const newStatus = banner.status === 'active' ? 'inactive' : 'active'
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        banner.status = newStatus
        
        Swal.fire({
          title: 'Thành công!',
          text: `Banner đã được ${newStatus === 'active' ? 'kích hoạt' : 'tạm dừng'}.`,
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
    
    const deleteBanner = async (banner) => {
      const result = await Swal.fire({
        title: 'Xác nhận xóa?',
        text: `Bạn có chắc chắn muốn xóa banner "${banner.title}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
      })
      
      if (result.isConfirmed) {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          banners.value = banners.value.filter(b => b.id !== banner.id)
          
          Swal.fire({
            title: 'Đã xóa!',
            text: 'Banner đã được xóa thành công.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          })
          
        } catch (error) {
          Swal.fire({
            title: 'Lỗi!',
            text: 'Có lỗi xảy ra khi xóa banner.',
            icon: 'error'
          })
        }
      }
    }
    
    const saveBanner = async () => {
      saving.value = true
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        if (isEditing.value) {
          // Update existing banner
          const index = banners.value.findIndex(b => b.id === bannerForm.value.id)
          if (index !== -1) {
            banners.value[index] = { ...bannerForm.value }
          }
        } else {
          // Add new banner
          const newBanner = {
            ...bannerForm.value,
            id: Date.now(),
            views: 0,
            clicks: 0
          }
          banners.value.push(newBanner)
        }
        
        Swal.fire({
          title: 'Thành công!',
          text: `Banner đã được ${isEditing.value ? 'cập nhật' : 'thêm'} thành công.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
        
        closeModal()
        
      } catch (error) {
        Swal.fire({
          title: 'Lỗi!',
          text: `Có lỗi xảy ra khi ${isEditing.value ? 'cập nhật' : 'thêm'} banner.`,
          icon: 'error'
        })
      } finally {
        saving.value = false
      }
    }
    
    onMounted(() => {
      // Load banners from API
      loading.value = true
      setTimeout(() => {
        loading.value = false
      }, 1000)
    })
    
    return {
      loading,
      saving,
      showCreateModal,
      showEditModal,
      isEditing,
      filters,
      bannerForm,
      banners,
      filteredBanners,
      getStatusClass,
      getStatusText,
      getPositionText,
      formatDateRange,
      getCTR,
      resetFilters,
      closeModal,
      editBanner,
      duplicateBanner,
      toggleBannerStatus,
      deleteBanner,
      saveBanner
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>