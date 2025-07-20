<template>
  <div class="bg-gray-50 min-h-screen pb-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-indigo-800">
          <i class="fas fa-dharmachakra mr-3 text-indigo-600"></i>
          Quản lý vòng quay may mắn
        </h1>
        <div class="bg-white px-4 py-2 rounded-lg shadow-sm border border-indigo-100">
          <span class="text-sm font-medium text-gray-600">Trạng thái:</span>
          <span 
            class="ml-2 font-semibold"
            :class="{ 
              'text-green-600': totalProbability === 100, 
              'text-red-600': totalProbability !== 100 
            }"
          >
            {{ totalProbability === 100 ? 'Sẵn sàng' : 'Cần cấu hình' }}
          </span>
        </div>
      </div>
      
      <div v-if="loading" class="flex flex-col items-center justify-center my-12 py-12">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
        <p class="text-indigo-600 font-medium">Đang tải dữ liệu...</p>
      </div>
      
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Spin Wheel Preview -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden col-span-1 card-hover">
          <div class="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <h2 class="text-xl font-bold text-white flex items-center">
              <i class="fas fa-eye mr-2"></i>
              Xem trước vòng quay
            </h2>
          </div>
          
          <div class="p-6">
            <div class="relative w-full aspect-square max-w-sm mx-auto wheel-container">
              <!-- Wheel outer ring -->
              <div class="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-700 to-purple-700 shadow-2xl" style="transform: scale(1.05);"></div>
              
              <!-- Wheel pointer -->
              <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-20 wheel-pointer">
                <div class="w-0 h-0" style="border-left: 15px solid transparent; border-right: 15px solid transparent; border-top: 30px solid #ef4444; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));"></div>
              </div>
              
              <!-- Canvas-based wheel -->
              <div class="absolute inset-0 rounded-full overflow-hidden shadow-xl wheel" ref="wheel">
                <canvas id="wheelCanvas" ref="wheelCanvas" width="400" height="400" class="w-full h-full"></canvas>
              </div>
              
              <!-- Spin button with enhanced design -->
              <button 
                type="button"
                class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-16 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none transition-all duration-300 font-bold"
                @click="spinWheel"
                :disabled="isSpinning"
                style="box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4);"
              >
                <i class="fas fa-play-circle mr-2"></i> {{ isSpinning ? 'Đang quay...' : 'Quay thử' }}
              </button>
            </div>
            
            <!-- Probability meter -->
            <div class="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-semibold text-gray-700">Tổng xác suất:</h3>
                <span 
                  class="font-bold text-lg"
                  :class="{
                    'text-red-600': totalProbability !== 100,
                    'text-green-600': totalProbability === 100
                  }"
                >
                  {{ totalProbability }}%
                </span>
              </div>
              
              <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  class="h-4 rounded-full transition-all duration-500 ease-out"
                  :style="{ width: `${Math.min(totalProbability, 100)}%` }"
                  :class="{ 
                    'bg-red-500': totalProbability > 100, 
                    'bg-yellow-500': totalProbability < 100,
                    'bg-green-500': totalProbability === 100 
                  }"
                ></div>
              </div>
              
              <div class="flex items-center mt-2">
                <i 
                  :class="{ 
                    'fas fa-exclamation-triangle text-red-500': totalProbability !== 100,
                    'fas fa-check-circle text-green-500': totalProbability === 100 
                  }"
                ></i>
                <p class="text-sm ml-2" :class="{ 'text-red-500': totalProbability !== 100, 'text-green-500': totalProbability === 100 }">
                  {{ totalProbability === 100 ? 'Xác suất hợp lệ' : 'Tổng xác suất phải bằng 100%' }}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Spin Items Management -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden col-span-1 lg:col-span-2 card-hover">
          <div class="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 flex justify-between items-center">
            <h2 class="text-xl font-bold text-white flex items-center">
              <i class="fas fa-gift mr-2"></i>
              Danh sách phần thưởng
            </h2>
            <button 
              @click="openEditModal(null)" 
              class="px-4 py-2 bg-white text-indigo-600 rounded-lg shadow hover:bg-indigo-50 transition-colors font-medium"
            >
              <i class="fas fa-plus mr-1"></i> Thêm mới
            </button>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phần thưởng
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá trị
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Xác suất (%)
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in spinItems" :key="item.id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-10 h-10 rounded-full mr-3 flex items-center justify-center text-white shadow-md transform transition-transform hover:scale-110" 
                        :style="{ background: `linear-gradient(135deg, ${item.color}, ${adjustColor(item.color, -30)})` }">
                        <i :class="`fas fa-${item.icon} text-lg`" style="text-shadow: 0 1px 2px rgba(0,0,0,0.3);"></i>
                      </div>
                      <div class="font-medium text-gray-900 text-base">{{ item.label }}</div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm"
                      :class="{
                        'bg-gradient-to-r from-green-100 to-green-200 text-green-800': item.type === 'voucher',
                        'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800': item.type === 'freeship',
                        'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800': item.type === 'discount',
                        'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800': item.type === 'none'
                      }"
                    >
                      <i :class="{
                        'fas fa-ticket-alt mr-1': item.type === 'voucher',
                        'fas fa-truck mr-1': item.type === 'freeship',
                        'fas fa-percent mr-1': item.type === 'discount',
                        'fas fa-times-circle mr-1': item.type === 'none'
                      }"></i>
                      {{ getTypeLabel(item.type) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-base font-medium">
                      {{ formatValue(item) }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-24 bg-gray-200 rounded-full h-3 mr-3 overflow-hidden shadow-inner">
                        <div 
                          class="h-3 rounded-full transition-all duration-500 ease-out" 
                          :style="{ width: `${item.probability}%` }"
                          :class="{
                            'bg-gradient-to-r from-green-400 to-green-500': item.probability > 50,
                            'bg-gradient-to-r from-yellow-400 to-yellow-500': item.probability > 20 && item.probability <= 50,
                            'bg-gradient-to-r from-red-400 to-red-500': item.probability <= 20
                          }"
                        ></div>
                      </div>
                      <div class="font-medium text-base">{{ item.probability }}%</div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      @click="openEditModal(item)" 
                      class="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2.5 rounded-lg mr-2 transition-all hover:shadow-md"
                      title="Chỉnh sửa"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      @click="confirmDeleteItem(item.id)" 
                      class="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2.5 rounded-lg transition-all hover:shadow-md"
                      title="Xóa"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="spinItems.length === 0">
                  <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                    <i class="fas fa-info-circle mr-2"></i>
                    Chưa có phần thưởng nào. Hãy thêm phần thưởng mới để bắt đầu.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Add Spins to User -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden col-span-1 lg:col-span-3 card-hover">
          <div class="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <h2 class="text-xl font-bold text-white flex items-center">
              <i class="fas fa-user-plus mr-2"></i>
              Cấp lượt quay cho người dùng
            </h2>
          </div>
          
          <div class="p-6">
            <form @submit.prevent="addSpinsToUser" class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div class="md:col-span-1">
                <label class="block text-sm font-medium text-gray-700 mb-2">ID người dùng</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="fas fa-user text-gray-400"></i>
                  </div>
                  <input 
                    v-model="addSpinsForm.userId" 
                    type="number" 
                    required
                    placeholder="Nhập ID người dùng"
                    class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                </div>
              </div>
              
              <div class="md:col-span-1">
                <label class="block text-sm font-medium text-gray-700 mb-2">Số lượt quay</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="fas fa-sync-alt text-gray-400"></i>
                  </div>
                  <input 
                    v-model="addSpinsForm.count" 
                    type="number" 
                    min="1" 
                    required
                    placeholder="Nhập số lượt"
                    class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                </div>
              </div>
              
              <div class="md:col-span-2 flex items-end">
                <button 
                  type="submit" 
                  class="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-md transition-all font-medium"
                  :disabled="addingSpins"
                >
                  <i class="fas fa-plus-circle mr-2"></i> 
                  {{ addingSpins ? 'Đang xử lý...' : 'Cấp lượt quay' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="showEditModal = false">
          <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
        </div>
        
        <div class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form @submit.prevent="saveSpinItem">
            <div class="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
              <h3 class="text-xl font-bold text-white flex items-center">
                <i class="fas fa-gift mr-2"></i>
                {{ editingItem ? 'Chỉnh sửa phần thưởng' : 'Thêm phần thưởng mới' }}
              </h3>
            </div>
            
            <div class="bg-white px-6 pt-6 pb-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Preview -->
                <div class="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200 mb-2">
                  <div class="flex items-center">
                    <div class="w-12 h-12 rounded-full mr-4 flex items-center justify-center text-white text-xl" 
                      :style="{ backgroundColor: editForm.color }">
                      <i :class="`fas fa-${editForm.icon}`"></i>
                    </div>
                    <div>
                      <h4 class="font-bold text-lg">{{ editForm.label || 'Tên phần thưởng' }}</h4>
                      <div class="flex items-center">
                        <span 
                          class="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full mr-2"
                          :class="{
                            'bg-green-100 text-green-800': editForm.type === 'voucher',
                            'bg-blue-100 text-blue-800': editForm.type === 'freeship',
                            'bg-purple-100 text-purple-800': editForm.type === 'discount',
                            'bg-gray-100 text-gray-800': editForm.type === 'none'
                          }"
                        >
                          {{ getTypeLabel(editForm.type) }}
                        </span>
                        <span class="text-sm text-gray-600">
                          {{ editForm.probability }}% xác suất
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Tên phần thưởng</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i class="fas fa-tag text-gray-400"></i>
                    </div>
                    <input 
                      v-model="editForm.label" 
                      type="text" 
                      required
                      placeholder="Nhập tên phần thưởng"
                      class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Loại phần thưởng</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i class="fas fa-list text-gray-400"></i>
                    </div>
                    <select 
                      v-model="editForm.type" 
                      required
                      class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                    >
                      <option value="voucher">Voucher</option>
                      <option value="discount">Giảm giá %</option>
                      <option value="freeship">Miễn phí vận chuyển</option>
                      <option value="none">Không trúng thưởng</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <i class="fas fa-chevron-down text-gray-400"></i>
                    </div>
                  </div>
                </div>
                
                <div v-if="editForm.type !== 'freeship' && editForm.type !== 'none'">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ editForm.type === 'voucher' ? 'Giá trị voucher (VND)' : 'Phần trăm giảm giá (%)' }}
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i :class="`fas fa-${editForm.type === 'voucher' ? 'money-bill-wave' : 'percent'} text-gray-400`"></i>
                    </div>
                    <input 
                      v-model="editForm.value" 
                      type="number" 
                      min="0"
                      required
                      :placeholder="editForm.type === 'voucher' ? 'Nhập giá trị' : 'Nhập phần trăm'"
                      class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Xác suất (%)</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i class="fas fa-chart-pie text-gray-400"></i>
                    </div>
                    <input 
                      v-model="editForm.probability" 
                      type="number" 
                      min="1" 
                      max="100"
                      required
                      placeholder="Nhập xác suất"
                      class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                  </div>
                  <div class="mt-1 flex">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-indigo-600 h-2 rounded-full" :style="{ width: `${editForm.probability}%` }"></div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Màu sắc</label>
                  <div class="grid grid-cols-6 gap-2 mb-2">
                    <button 
                      v-for="color in ['#FF5733', '#33FF57', '#3357FF', '#F033FF', '#FF33F0', '#33FFF0']" 
                      :key="color"
                      type="button"
                      class="w-8 h-8 rounded-full border-2 focus:outline-none"
                      :class="{ 'border-gray-800': editForm.color === color, 'border-transparent': editForm.color !== color }"
                      :style="{ backgroundColor: color }"
                      @click="editForm.color = color"
                    ></button>
                  </div>
                  <input 
                    v-model="editForm.color" 
                    type="color" 
                    required
                    class="w-full h-10 px-1 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i class="fas fa-icons text-gray-400"></i>
                    </div>
                    <select 
                      v-model="editForm.icon" 
                      required
                      class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                    >
                      <option value="ticket">Ticket</option>
                      <option value="percent">Percent</option>
                      <option value="truck">Truck</option>
                      <option value="gift">Gift</option>
                      <option value="frown">Frown</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <i class="fas fa-chevron-down text-gray-400"></i>
                    </div>
                  </div>
                  <div class="grid grid-cols-5 gap-2 mt-2">
                    <button 
                      v-for="icon in ['ticket', 'percent', 'truck', 'gift', 'frown']" 
                      :key="icon"
                      type="button"
                      class="w-10 h-10 rounded-lg flex items-center justify-center focus:outline-none"
                      :class="{ 
                        'bg-indigo-100 text-indigo-600 border border-indigo-300': editForm.icon === icon, 
                        'bg-gray-100 text-gray-600 border border-transparent hover:bg-gray-200': editForm.icon !== icon 
                      }"
                      @click="editForm.icon = icon"
                    >
                      <i :class="`fas fa-${icon}`"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button 
                type="button" 
                @click="showEditModal = false" 
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium transition-colors"
              >
                <i class="fas fa-times mr-1"></i> Hủy
              </button>
              <button 
                type="submit" 
                class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium shadow-md transition-colors"
              >
                <i class="fas fa-save mr-1"></i> {{ editingItem ? 'Cập nhật' : 'Thêm mới' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useSpinStore } from '../stores/spinStore'
import Swal from 'sweetalert2'

export default {
  name: 'SpinManagement',
  setup() {
    const spinStore = useSpinStore()
    const showEditModal = ref(false)
    const editingItem = ref(null)
    const addingSpins = ref(false)
    
    const editForm = ref({
      label: '',
      type: 'voucher',
      value: 0,
      probability: 5,
      color: '#FF5733',
      icon: 'ticket'
    })
    
    const addSpinsForm = ref({
      userId: '',
      count: 1
    })
    
    const loading = computed(() => spinStore.loading)
    const spinItems = computed(() => spinStore.spinItems)
    const totalProbability = computed(() => spinStore.getTotalProbability)
    
    // For wheel animation
    const isSpinning = ref(false)
    const spinDuration = ref(5000) // 5 seconds
    const currentRotation = ref(0)
    const canvas = ref(null)
    const ctx = ref(null)
    
    // Draw the wheel using canvas
    const drawWheel = () => {
      if (!canvas.value || !ctx.value || spinItems.value.length === 0) return
      
      const canvasEl = canvas.value
      const context = ctx.value
      const centerX = canvasEl.width / 2
      const centerY = canvasEl.height / 2
      const radius = canvasEl.width / 2 - 20
      const items = spinItems.value
      const totalItems = items.length
      const arc = Math.PI * 2 / totalItems
      
      // Clear canvas
      context.clearRect(0, 0, canvasEl.width, canvasEl.height)
      
      // Draw wheel segments
      for (let i = 0; i < totalItems; i++) {
        const angle = i * arc
        const item = items[i]
        
        // Draw segment
        context.beginPath()
        context.fillStyle = item.color
        context.moveTo(centerX, centerY)
        context.arc(centerX, centerY, radius, angle, angle + arc)
        context.lineTo(centerX, centerY)
        context.fill()
        
        // Add gradient overlay
        const gradient = context.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, radius
        )
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)')
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)')
        
        context.beginPath()
        context.fillStyle = gradient
        context.moveTo(centerX, centerY)
        context.arc(centerX, centerY, radius, angle, angle + arc)
        context.lineTo(centerX, centerY)
        context.fill()
        
        // Add segment border
        context.beginPath()
        context.lineWidth = 2
        context.strokeStyle = '#ffffff'
        context.moveTo(centerX, centerY)
        context.arc(centerX, centerY, radius, angle, angle + arc)
        context.lineTo(centerX, centerY)
        context.stroke()
        
        // Draw text
        context.save()
        context.translate(centerX, centerY)
        context.rotate(angle + arc / 2)
        context.textAlign = 'right'
        context.fillStyle = '#ffffff'
        context.font = 'bold 16px Arial'
        context.shadowColor = 'rgba(0, 0, 0, 0.5)'
        context.shadowBlur = 4
        context.shadowOffsetX = 1
        context.shadowOffsetY = 1
        context.fillText(item.label, radius - 30, 5)
        
        // Draw icon
        context.fillText(String.fromCharCode(parseInt('f' + getIconCode(item.icon), 16)), radius - 50, 5)
        context.restore()
      }
      
      // Draw center circle
      context.beginPath()
      context.fillStyle = '#ffffff'
      context.arc(centerX, centerY, 30, 0, Math.PI * 2)
      context.fill()
      
      // Add gradient to center circle
      const centerGradient = context.createLinearGradient(
        centerX - 30, centerY - 30,
        centerX + 30, centerY + 30
      )
      centerGradient.addColorStop(0, '#6366f1')
      centerGradient.addColorStop(1, '#a855f7')
      
      context.beginPath()
      context.fillStyle = centerGradient
      context.arc(centerX, centerY, 25, 0, Math.PI * 2)
      context.fill()
      
      // Add icon to center
      context.fillStyle = '#ffffff'
      context.font = 'bold 20px "Font Awesome 5 Free"'
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.fillText(String.fromCharCode(parseInt('f5e1', 16)), centerX, centerY)
    }
    
    // Helper function to get icon code
    const getIconCode = (iconName) => {
      const iconCodes = {
        'ticket': '3ff',
        'percent': '295',
        'truck': 'f0d1',
        'gift': 'f06b',
        'frown': 'f119'
      }
      return iconCodes[iconName] || '06b'
    }
    
    const spinWheel = () => {
      if (isSpinning.value || spinItems.value.length === 0) return
      
      isSpinning.value = true
      
      // Get wheel element
      const wheel = document.querySelector('.wheel')
      if (!wheel) {
        isSpinning.value = false
        return
      }
      
      // Randomly select a reward based on probability
      const random = Math.random()
      let cumulativeProbability = 0
      let selectedIndex = 0
      
      for (let i = 0; i < spinItems.value.length; i++) {
        cumulativeProbability += spinItems.value[i].probability / 100
        if (random < cumulativeProbability) {
          selectedIndex = i
          break
        }
      }
      
      // Calculate rotation angle
      const totalItems = spinItems.value.length
      const arc = 360 / totalItems
      // Add to current rotation to ensure continuous spinning in the same direction
      currentRotation.value += 1800 + (totalItems - selectedIndex - 1) * arc
      
      // Apply animation
      wheel.style.transition = `transform ${spinDuration.value / 1000}s cubic-bezier(0.17, 0.67, 0.83, 0.67)`
      wheel.style.transform = `rotate(${currentRotation.value}deg)`
      
      // After animation completes
      setTimeout(() => {
        // Get the selected item
        const selectedItem = spinItems.value[selectedIndex]
        
        // Show result
        if (selectedItem) {
          Swal.fire({
            title: 'Chúc mừng!',
            html: `
              <div class="flex flex-col items-center">
                <div class="w-24 h-24 rounded-full mb-6 flex items-center justify-center text-white text-3xl relative" 
                  style="background: linear-gradient(135deg, ${selectedItem.color}, ${adjustColor(selectedItem.color, -30)}); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);">
                  <i class="fas fa-${selectedItem.icon}" style="text-shadow: 0 2px 4px rgba(0,0,0,0.3);"></i>
                  <div class="absolute inset-0 rounded-full" style="background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%);"></div>
                </div>
                <h3 class="text-2xl font-bold mb-3 text-gray-800" style="text-shadow: 0 1px 2px rgba(0,0,0,0.1);">${selectedItem.label}</h3>
                <div class="px-4 py-2 rounded-full mb-3 inline-flex items-center justify-center text-sm font-semibold"
                  style="background: linear-gradient(to right, ${selectedItem.type === 'voucher' ? '#10B981, #059669' : 
                    selectedItem.type === 'freeship' ? '#3B82F6, #2563EB' : 
                    selectedItem.type === 'discount' ? '#8B5CF6, #7C3AED' : 
                    '#9CA3AF, #6B7280'}); color: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                  <i class="fas fa-${selectedItem.type === 'voucher' ? 'ticket-alt' : 
                    selectedItem.type === 'freeship' ? 'truck' : 
                    selectedItem.type === 'discount' ? 'percent' : 
                    'times-circle'} mr-2"></i>
                  ${getTypeLabel(selectedItem.type)}
                </div>
                <p class="text-2xl font-bold mt-2 gradient-text" style="font-size: 28px;">${formatValue(selectedItem)}</p>
                <div class="mt-4 w-full max-w-xs">
                  <div class="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse" style="width: 100%;"></div>
                  </div>
                </div>
              </div>
            `,
            showConfirmButton: true,
            confirmButtonText: '<i class="fas fa-check-circle mr-2"></i>Nhận thưởng',
            confirmButtonColor: '#4F46E5',
            showCancelButton: true,
            cancelButtonText: 'Đóng',
            cancelButtonColor: '#9CA3AF',
            background: 'rgba(255, 255, 255, 0.95)',
            backdrop: `
              rgba(0,0,123,0.4)
              url("/images/confetti.gif")
              left top
              no-repeat
            `,
            customClass: {
              popup: 'animated bounceIn'
            }
          })
        }
        
        // Reset
        isSpinning.value = false
        wheel.style.transition = 'none'
        wheel.style.transform = 'rotate(0deg)'
      }, spinDuration.value + 500)
    }
    
    const getTypeLabel = (type) => {
      switch (type) {
        case 'voucher': return 'Voucher'
        case 'discount': return 'Giảm giá %'
        case 'freeship': return 'Miễn phí vận chuyển'
        case 'none': return 'Không trúng thưởng'
        default: return type
      }
    }
    
    const formatValue = (item) => {
      switch (item.type) {
        case 'voucher':
          return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(item.value)
        case 'discount':
          return `${item.value}%`
        case 'freeship':
          return 'Miễn phí vận chuyển'
        case 'none':
          return '-'
        default:
          return item.value
      }
    }
    
    // Hàm điều chỉnh màu sắc (làm tối hoặc sáng hơn)
    const adjustColor = (hex, percent) => {
      // Chuyển đổi hex sang RGB
      let r = parseInt(hex.substring(1, 3), 16)
      let g = parseInt(hex.substring(3, 5), 16)
      let b = parseInt(hex.substring(5, 7), 16)
      
      // Điều chỉnh màu
      r = Math.max(0, Math.min(255, r + percent))
      g = Math.max(0, Math.min(255, g + percent))
      b = Math.max(0, Math.min(255, b + percent))
      
      // Chuyển đổi trở lại hex
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
    }
    
    const openEditModal = (item) => {
      if (item) {
        editingItem.value = item
        editForm.value = { ...item }
      } else {
        editingItem.value = null
        editForm.value = {
          label: '',
          type: 'voucher',
          value: 0,
          probability: 5,
          color: '#FF5733',
          icon: 'ticket'
        }
      }
      showEditModal.value = true
    }
    
    const saveSpinItem = async () => {
      try {
        const itemData = { ...editForm.value }
        
        if (editingItem.value) {
          itemData.id = editingItem.value.id
          await spinStore.updateSpinItem(itemData)
        } else {
          // For new items, generate an ID
          itemData.id = Date.now()
          await spinStore.updateSpinItem(itemData)
        }
        
        showEditModal.value = false
      } catch (error) {
        console.error('Error saving spin item:', error)
      }
    }
    
    const confirmDeleteItem = (id) => {
      Swal.fire({
        title: 'Xác nhận xóa?',
        text: 'Bạn có chắc chắn muốn xóa phần thưởng này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
      }).then((result) => {
        if (result.isConfirmed) {
          // In a real app, you would call an API to delete the item
          // For now, we'll just remove it from the local state
          spinStore.spinItems = spinStore.spinItems.filter(item => item.id !== id)
          
          Swal.fire(
            'Đã xóa!',
            'Phần thưởng đã được xóa.',
            'success'
          )
        }
      })
    }
    
    const addSpinsToUser = async () => {
      addingSpins.value = true
      
      try {
        await spinStore.addUserSpins(
          parseInt(addSpinsForm.value.userId),
          parseInt(addSpinsForm.value.count)
        )
        
        // Reset form
        addSpinsForm.value = {
          userId: '',
          count: 1
        }
      } catch (error) {
        console.error('Error adding spins:', error)
      } finally {
        addingSpins.value = false
      }
    }
    
    onMounted(async () => {
      await spinStore.fetchSpinItems()
      
      // Initialize canvas after DOM is ready
      nextTick(() => {
        if (document.querySelector('.wheel')) {
          canvas.value = document.querySelector('#wheelCanvas')
          if (canvas.value) {
            ctx.value = canvas.value.getContext('2d')
            drawWheel()
          }
        }
      })
    })
    
    return {
      loading,
      spinItems,
      totalProbability,
      showEditModal,
      editingItem,
      editForm,
      addSpinsForm,
      addingSpins,
      isSpinning,
      canvas,
      ctx,
      currentRotation,
      getTypeLabel,
      formatValue,
      adjustColor,
      drawWheel,
      getIconCode,
      openEditModal,
      saveSpinItem,
      confirmDeleteItem,
      addSpinsToUser,
      spinWheel
    }
  }
}
</script>

<style scoped>
/* Wheel animation and effects */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-8px) rotate(-2deg); }
  75% { transform: translateY(3px) rotate(2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes glow {
  0% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5); }
  50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.8); }
  100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5); }
}

@keyframes bounceIn {
  from, 20%, 40%, 60%, 80%, to {
    animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
  }
  0% {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
  20% {
    transform: scale3d(1.1, 1.1, 1.1);
  }
  40% {
    transform: scale3d(0.9, 0.9, 0.9);
  }
  60% {
    opacity: 1;
    transform: scale3d(1.03, 1.03, 1.03);
  }
  80% {
    transform: scale3d(0.97, 0.97, 0.97);
  }
  to {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}

.wheel-container:hover .wheel {
  animation: pulse 3s infinite ease-in-out;
}

.wheel {
  transform-style: preserve-3d;
  transition: transform 5s cubic-bezier(0.17, 0.67, 0.83, 0.67);
  will-change: transform;
  backface-visibility: hidden;
}

.wheel-pointer {
  animation: float 4s infinite ease-in-out;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
}

.animated {
  animation-duration: 0.75s;
  animation-fill-mode: both;
}

.bounceIn {
  animation-name: bounceIn;
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

/* Form input focus effects */
input:focus, select:focus {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

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

/* Gradient text */
.gradient-text {
  background: linear-gradient(to right, #6366f1, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>