<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Quản lý người dùng</h1>
    
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
          <select 
            v-model="roleFilter" 
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Tất cả vai trò</option>
            <option value="admin">Admin</option>
            <option value="sub_admin">Sub Admin</option>
            <option value="seller">Người bán</option>
            <option value="user">Người dùng</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
          <select 
            v-model="statusFilter" 
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
          <div class="relative">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Tìm kiếm theo tên, email..." 
              class="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
            <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="loading" class="flex justify-center my-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
    
    <div v-else-if="filteredUsers.length === 0" class="bg-white rounded-lg shadow p-8 text-center">
      <div class="text-gray-500 text-6xl mb-4">
        <i class="fas fa-users"></i>
      </div>
      <h2 class="text-xl font-semibold mb-2">Không tìm thấy người dùng nào</h2>
      <p class="text-gray-500">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
    </div>
    
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Người dùng
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Liên hệ
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vai trò
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quản lý bởi
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ngày đăng ký
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in filteredUsers" :key="user.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span class="text-indigo-700 font-medium">{{ getInitials(user.fullName) }}</span>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ user.fullName }}</div>
                  <div class="text-sm text-gray-500">@{{ user.username }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ user.email }}</div>
              <div class="text-sm text-gray-500">{{ user.phone }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-purple-100 text-purple-800': user.role === 'admin',
                  'bg-indigo-100 text-indigo-800': user.role === 'sub_admin',
                  'bg-green-100 text-green-800': user.role === 'seller',
                  'bg-blue-100 text-blue-800': user.role === 'user'
                }"
              >
                {{ getRoleLabel(user.role) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-green-100 text-green-800': user.status === 'active',
                  'bg-red-100 text-red-800': user.status === 'inactive'
                }"
              >
                {{ user.status === 'active' ? 'Hoạt động' : 'Không hoạt động' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div v-if="user.managed_by" class="text-sm text-gray-900">
                {{ getManagerName(user.managed_by) }}
              </div>
              <div v-else class="text-sm text-gray-500">-</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ formatDate(user.registeredDate) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button 
                @click="viewUserDetails(user)" 
                class="text-indigo-600 hover:text-indigo-900 mr-2"
              >
                <i class="fas fa-eye"></i>
              </button>
              <button 
                @click="openEditModal(user)" 
                class="text-blue-600 hover:text-blue-900 mr-2"
                title="Chỉnh sửa thông tin"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button 
                @click="openPasswordModal(user)" 
                class="text-green-600 hover:text-green-900 mr-2"
                title="Đổi mật khẩu"
              >
                <i class="fas fa-key"></i>
              </button>
              <button 
                @click="confirmDeleteUser(user.id)" 
                class="text-red-600 hover:text-red-900"
                title="Xóa người dùng"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- User Details Modal -->
    <div v-if="showUserDetailsModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="showUserDetailsModal = false">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex justify-between items-start">
              <h3 class="text-lg font-medium text-gray-900">Chi tiết người dùng</h3>
              <button 
                @click="showUserDetailsModal = false" 
                class="text-gray-400 hover:text-gray-500"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
            
            <div v-if="selectedUser" class="mt-4">
              <div class="flex items-center mb-4">
                <div class="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span class="text-indigo-700 text-xl font-medium">{{ getInitials(selectedUser.fullName) }}</span>
                </div>
                <div class="ml-4">
                  <h4 class="text-lg font-medium">{{ selectedUser.fullName }}</h4>
                  <p class="text-gray-500">@{{ selectedUser.username }}</p>
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p class="text-sm text-gray-500">Email</p>
                  <p class="font-medium">{{ selectedUser.email }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Số điện thoại</p>
                  <p class="font-medium">{{ selectedUser.phone }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Vai trò</p>
                  <p class="font-medium">{{ getRoleLabel(selectedUser.role) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Trạng thái</p>
                  <p class="font-medium">{{ selectedUser.status === 'active' ? 'Hoạt động' : 'Không hoạt động' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Ngày đăng ký</p>
                  <p class="font-medium">{{ formatDate(selectedUser.registeredDate) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Số đơn hàng</p>
                  <p class="font-medium">{{ selectedUser.orders }}</p>
                </div>
                <div class="col-span-2">
                  <p class="text-sm text-gray-500">Địa chỉ</p>
                  <p class="font-medium">{{ selectedUser.address }}</p>
                </div>
                <div v-if="selectedUser.managed_by" class="col-span-2">
                  <p class="text-sm text-gray-500">Quản lý bởi</p>
                  <p class="font-medium">{{ getManagerName(selectedUser.managed_by) }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              @click="openEditModal(selectedUser)" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Chỉnh sửa
            </button>
            <button 
              type="button" 
              @click="showUserDetailsModal = false" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Change Password Modal -->
    <div v-if="showPasswordModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="showPasswordModal = false">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form @submit.prevent="changePassword">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="flex justify-between items-start">
                <h3 class="text-lg font-medium text-gray-900">Đổi mật khẩu người dùng</h3>
                <button 
                  @click="showPasswordModal = false" 
                  class="text-gray-400 hover:text-gray-500"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
              
              <div v-if="passwordUser" class="mt-4">
                <div class="flex items-center mb-4">
                  <div class="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span class="text-indigo-700 font-medium">{{ getInitials(passwordUser.fullName) }}</span>
                  </div>
                  <div class="ml-4">
                    <h4 class="text-lg font-medium">{{ passwordUser.fullName }}</h4>
                    <p class="text-gray-500">@{{ passwordUser.username }}</p>
                  </div>
                </div>
                
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i class="fas fa-lock text-gray-400"></i>
                      </div>
                      <input 
                        v-model="passwordForm.newPassword" 
                        :type="showPassword ? 'text' : 'password'" 
                        required
                        minlength="6"
                        class="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Nhập mật khẩu mới"
                      >
                      <button 
                        type="button"
                        @click="showPassword = !showPassword"
                        class="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-gray-400"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i class="fas fa-lock text-gray-400"></i>
                      </div>
                      <input 
                        v-model="passwordForm.confirmPassword" 
                        :type="showConfirmPassword ? 'text' : 'password'" 
                        required
                        minlength="6"
                        class="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Xác nhận mật khẩu mới"
                        :class="{'border-red-500': passwordError}"
                      >
                      <button 
                        type="button"
                        @click="showConfirmPassword = !showConfirmPassword"
                        class="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-gray-400"></i>
                      </button>
                    </div>
                    <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                type="submit" 
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                :disabled="loading || passwordForm.newPassword !== passwordForm.confirmPassword"
              >
                Cập nhật mật khẩu
              </button>
              <button 
                type="button" 
                @click="showPasswordModal = false" 
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- Edit User Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="showEditModal = false">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form @submit.prevent="saveUser">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                {{ editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới' }}
              </h3>
              
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                  <input 
                    v-model="editForm.fullName" 
                    type="text" 
                    required
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                  <input 
                    v-model="editForm.username" 
                    type="text" 
                    required
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    v-model="editForm.email" 
                    type="email" 
                    required
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input 
                    v-model="editForm.phone" 
                    type="text" 
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                  <select 
                    v-model="editForm.role" 
                    required
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="user">Người dùng</option>
                    <option value="seller">Người bán</option>
                    <option value="sub_admin">Sub Admin</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                  <select 
                    v-model="editForm.status" 
                    required
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                  </select>
                </div>
                
                <div v-if="editForm.role === 'seller' || editForm.role === 'sub_admin'">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Quản lý bởi</label>
                  <select 
                    v-model="editForm.managed_by" 
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option :value="null">Không có</option>
                    <option 
                      v-for="admin in adminUsers" 
                      :key="admin.id" 
                      :value="admin.id"
                    >
                      {{ admin.fullName }}
                    </option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                  <textarea 
                    v-model="editForm.address" 
                    rows="2"
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                type="submit" 
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {{ editingUser ? 'Cập nhật' : 'Thêm mới' }}
              </button>
              <button 
                type="button" 
                @click="showEditModal = false" 
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Hủy
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
import { useAdminStore } from '../stores/adminStore'
import Swal from 'sweetalert2'

export default {
  name: 'UserManagement',
  setup() {
    const adminStore = useAdminStore()
    const searchQuery = ref('')
    const roleFilter = ref('')
    const statusFilter = ref('')
    
    const showUserDetailsModal = ref(false)
    const showEditModal = ref(false)
    const showPasswordModal = ref(false)
    const selectedUser = ref(null)
    const editingUser = ref(null)
    const passwordUser = ref(null)
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)
    const passwordError = ref('')
    
    const passwordForm = ref({
      newPassword: '',
      confirmPassword: ''
    })
    
    const editForm = ref({
      fullName: '',
      username: '',
      email: '',
      phone: '',
      role: 'user',
      status: 'active',
      address: '',
      managed_by: null
    })
    
    const loading = computed(() => adminStore.loading)
    const users = computed(() => adminStore.users)
    
    const adminUsers = computed(() => 
      users.value.filter(user => {
        const userRoles = user.roles || []
        return userRoles.some(role => ['admin', 'subadmin'].includes(role.name))
      })
    )
    
    const filteredUsers = computed(() => {
      let result = users.value
      
      // Apply role filter
      if (roleFilter.value) {
        result = result.filter(user => user.role === roleFilter.value)
      }
      
      // Apply status filter
      if (statusFilter.value) {
        result = result.filter(user => user.status === statusFilter.value)
      }
      
      // Apply search query
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(user => 
          user.fullName.toLowerCase().includes(query) || 
          user.email.toLowerCase().includes(query) ||
          user.username.toLowerCase().includes(query)
        )
      }
      
      return result
    })
    
    const getInitials = (name) => {
      if (!name) return '?'
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    }
    
    const getRoleLabel = (role) => {
      switch (role) {
        case 'admin': return 'Admin'
        case 'sub_admin': return 'Sub Admin'
        case 'seller': return 'Người bán'
        case 'user': return 'Người dùng'
        default: return role
      }
    }
    
    const getManagerName = (managerId) => {
      const manager = users.value.find(user => user.id === managerId)
      return manager ? manager.fullName : 'Unknown'
    }
    
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(date)
    }
    
    const viewUserDetails = (user) => {
      selectedUser.value = user
      showUserDetailsModal.value = true
    }
    
    const openEditModal = (user) => {
      if (user) {
        editingUser.value = user
        editForm.value = { ...user }
      } else {
        editingUser.value = null
        editForm.value = {
          fullName: '',
          username: '',
          email: '',
          phone: '',
          role: 'user',
          status: 'active',
          address: '',
          managed_by: null
        }
      }
      showEditModal.value = true
    }
    
    const openPasswordModal = (user) => {
      passwordUser.value = user
      passwordForm.value = {
        newPassword: '',
        confirmPassword: ''
      }
      passwordError.value = ''
      showPassword.value = false
      showConfirmPassword.value = false
      showPasswordModal.value = true
    }
    
    const changePassword = async () => {
      // Validate passwords match
      if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        passwordError.value = 'Mật khẩu xác nhận không khớp'
        return
      }
      
      if (passwordForm.value.newPassword.length < 6) {
        passwordError.value = 'Mật khẩu phải có ít nhất 6 ký tự'
        return
      }
      
      passwordError.value = ''
      
      try {
        const success = await adminStore.changeUserPassword(
          passwordUser.value.id, 
          passwordForm.value.newPassword
        )
        
        if (success) {
          showPasswordModal.value = false
        }
      } catch (error) {
        console.error('Error changing password:', error)
      }
    }
    
    const saveUser = async () => {
      try {
        if (editingUser.value) {
          await adminStore.updateUser(editForm.value)
          
          // Update selected user if it's open
          if (selectedUser.value && selectedUser.value.id === editingUser.value.id) {
            selectedUser.value = { ...editForm.value }
          }
        } else {
          // For new users, we would add them here
          // This is not implemented in the mock API
        }
        
        showEditModal.value = false
      } catch (error) {
        console.error('Error saving user:', error)
      }
    }
    
    const confirmDeleteUser = (id) => {
      Swal.fire({
        title: 'Xác nhận xóa?',
        text: 'Bạn có chắc chắn muốn xóa người dùng này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
      }).then((result) => {
        if (result.isConfirmed) {
          deleteUser(id)
        }
      })
    }
    
    const deleteUser = async (id) => {
      try {
        await adminStore.deleteUser(id)
        
        // Close modals if the deleted user was selected
        if (selectedUser.value && selectedUser.value.id === id) {
          showUserDetailsModal.value = false
        }
        if (editingUser.value && editingUser.value.id === id) {
          showEditModal.value = false
        }
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
    
    onMounted(async () => {
      await adminStore.fetchUsers()
    })
    
    return {
      loading,
      users,
      adminUsers,
      searchQuery,
      roleFilter,
      statusFilter,
      filteredUsers,
      showUserDetailsModal,
      showEditModal,
      showPasswordModal,
      selectedUser,
      editingUser,
      passwordUser,
      editForm,
      passwordForm,
      passwordError,
      showPassword,
      showConfirmPassword,
      getInitials,
      getRoleLabel,
      getManagerName,
      formatDate,
      viewUserDetails,
      openEditModal,
      openPasswordModal,
      saveUser,
      changePassword,
      confirmDeleteUser
    }
  }
}
</script>