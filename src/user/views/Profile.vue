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
          <h1 class="text-lg font-semibold">Thông tin thành viên</h1>
          <div class="w-20"></div>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Profile Header -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center space-x-6">
          <div class="relative">
            <img 
              :src="userProfile.avatar" 
              :alt="userProfile.fullName"
              class="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            >
            <button 
              @click="showAvatarModal = true"
              class="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </button>
          </div>
          
          <div class="flex-1">
            <h2 class="text-2xl font-bold text-gray-900">{{ user?.name || 'Chưa cập nhật' }}</h2>
            <p class="text-gray-600">{{ user?.email || 'Chưa cập nhật' }}</p>
            <div class="flex items-center mt-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {{ getUserRole(user?.roles) }}
              </span>
              <span class="ml-4 text-sm text-gray-500">
                Thành viên từ {{ formatDate(user?.created_at) }}
              </span>
            </div>
          </div>
          
          <div class="text-right">
            <div class="text-sm text-gray-500">Điểm tích lũy</div>
            <div class="text-2xl font-bold text-blue-600">{{ userProfile.points.toLocaleString() }}</div>
          </div>
        </div>
      </div>

      <!-- Profile Tabs -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8 px-6">
            <button 
              @click="activeTab = 'personal'"
              :class="activeTab === 'personal' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            >
              Thông tin cá nhân
            </button>
            <button 
              @click="activeTab = 'security'"
              :class="activeTab === 'security' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            >
              Bảo mật
            </button>
            <button 
              @click="activeTab = 'preferences'"
              :class="activeTab === 'preferences' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            >
              Tùy chọn
            </button>
            <button 
              @click="activeTab = 'wallet'"
              :class="activeTab === 'wallet' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            >
              Ví & Giao dịch
            </button>
            <button 
              @click="activeTab = 'statistics'"
              :class="activeTab === 'statistics' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            >
              Thống kê
            </button>
          </nav>
        </div>

        <div class="p-6">
          <!-- Personal Information Tab -->
          <div v-if="activeTab === 'personal'" class="space-y-6">
            <form @submit.prevent="updatePersonalInfo">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Họ và tên *</label>
                  <input 
                    v-model="editProfile.fullName"
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input 
                    v-model="editProfile.email"
                    type="email" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                  <input 
                    v-model="editProfile.phone"
                    type="tel" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
                  <input 
                    v-model="editProfile.birthDate"
                    type="date" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
                  <select 
                    v-model="editProfile.gender"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nghề nghiệp</label>
                  <input 
                    v-model="editProfile.occupation"
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                </div>
              </div>
              
              <div class="mt-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                <textarea 
                  v-model="editProfile.address"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              
              <div class="mt-6">
                <button 
                  type="submit"
                  class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Cập nhật thông tin
                </button>
              </div>
            </form>
          </div>

          <!-- Security Tab -->
          <div v-if="activeTab === 'security'" class="space-y-6">
            <!-- Change Password -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h3 class="font-semibold mb-4">Đổi mật khẩu</h3>
              <form @submit.prevent="changePassword" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Mật khẩu hiện tại</label>
                  <input 
                    v-model="passwordForm.currentPassword"
                    type="password" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Mật khẩu mới</label>
                  <input 
                    v-model="passwordForm.newPassword"
                    type="password" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
                  <input 
                    v-model="passwordForm.confirmPassword"
                    type="password" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                </div>
                <button 
                  type="submit"
                  class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Đổi mật khẩu
                </button>
              </form>
            </div>

            <!-- Two-Factor Authentication -->
            <div class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-semibold">Xác thực hai yếu tố (2FA)</h3>
                  <p class="text-sm text-gray-600">Tăng cường bảo mật cho tài khoản của bạn</p>
                </div>
                <button 
                  @click="toggle2FA"
                  :class="userProfile.twoFactorEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'"
                  class="px-4 py-2 text-white rounded-lg transition-colors"
                >
                  {{ userProfile.twoFactorEnabled ? 'Tắt 2FA' : 'Bật 2FA' }}
                </button>
              </div>
            </div>

            <!-- Login Sessions -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h3 class="font-semibold mb-4">Phiên đăng nhập</h3>
              <div class="space-y-3">
                <div 
                  v-for="session in loginSessions" 
                  :key="session.id"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div class="font-medium">{{ session.device }}</div>
                    <div class="text-sm text-gray-600">{{ session.location }} • {{ session.lastActive }}</div>
                  </div>
                  <button 
                    v-if="!session.current"
                    @click="terminateSession(session.id)"
                    class="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Kết thúc
                  </button>
                  <span v-else class="text-green-600 text-sm font-medium">Hiện tại</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Preferences Tab -->
          <div v-if="activeTab === 'preferences'" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Notification Settings -->
              <div class="border border-gray-200 rounded-lg p-4">
                <h3 class="font-semibold mb-4">Thông báo</h3>
                <div class="space-y-3">
                  <label class="flex items-center">
                    <input 
                      v-model="preferences.emailNotifications"
                      type="checkbox" 
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    >
                    <span class="ml-2 text-sm">Thông báo qua email</span>
                  </label>
                  <label class="flex items-center">
                    <input 
                      v-model="preferences.smsNotifications"
                      type="checkbox" 
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    >
                    <span class="ml-2 text-sm">Thông báo qua SMS</span>
                  </label>
                  <label class="flex items-center">
                    <input 
                      v-model="preferences.pushNotifications"
                      type="checkbox" 
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    >
                    <span class="ml-2 text-sm">Thông báo đẩy</span>
                  </label>
                </div>
              </div>

              <!-- Privacy Settings -->
              <div class="border border-gray-200 rounded-lg p-4">
                <h3 class="font-semibold mb-4">Quyền riêng tư</h3>
                <div class="space-y-3">
                  <label class="flex items-center">
                    <input 
                      v-model="preferences.profilePublic"
                      type="checkbox" 
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    >
                    <span class="ml-2 text-sm">Hồ sơ công khai</span>
                  </label>
                  <label class="flex items-center">
                    <input 
                      v-model="preferences.showOnlineStatus"
                      type="checkbox" 
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    >
                    <span class="ml-2 text-sm">Hiển thị trạng thái online</span>
                  </label>
                  <label class="flex items-center">
                    <input 
                      v-model="preferences.allowMessages"
                      type="checkbox" 
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    >
                    <span class="ml-2 text-sm">Cho phép nhận tin nhắn</span>
                  </label>
                </div>
              </div>
            </div>

            <button 
              @click="updatePreferences"
              class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Lưu tùy chọn
            </button>
          </div>

          <!-- Wallet & Transactions Tab -->
          <div v-if="activeTab === 'wallet'" class="space-y-6">
            <!-- Wallet Balance -->
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
              <div class="text-center">
                <h3 class="text-xl font-semibold mb-2">Số dư ví</h3>
                <div class="text-4xl font-bold mb-4">{{ formatPrice(walletBalance) }}</div>
                <div class="flex justify-center space-x-4">
                  <router-link 
                    to="/deposit" 
                    class="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-lg font-medium hover:bg-opacity-30 transition-all"
                  >
                    Nạp tiền
                  </router-link>
                  <router-link 
                    to="/withdrawal" 
                    class="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                  >
                    Rút tiền
                  </router-link>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <router-link 
                to="/wallet" 
                class="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow group"
              >
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                </div>
                <h4 class="font-medium text-gray-900">Ví chi tiết</h4>
              </router-link>

              <router-link 
                to="/bank-account" 
                class="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow group"
              >
                <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <h4 class="font-medium text-gray-900">Ngân hàng</h4>
              </router-link>

              <router-link 
                to="/orders" 
                class="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow group"
              >
                <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-200 transition-colors">
                  <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  </svg>
                </div>
                <h4 class="font-medium text-gray-900">Đơn hàng</h4>
              </router-link>

              <router-link 
                to="/support" 
                class="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow group"
              >
                <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-200 transition-colors">
                  <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                </div>
                <h4 class="font-medium text-gray-900">Hỗ trợ</h4>
              </router-link>
            </div>

            <!-- Recent Transactions -->
            <div class="bg-white border border-gray-200 rounded-lg">
              <div class="px-6 py-4 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold">Giao dịch gần đây</h3>
                  <router-link 
                    to="/wallet" 
                    class="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Xem tất cả →
                  </router-link>
                </div>
              </div>
              <div class="divide-y divide-gray-200">
                <div 
                  v-for="transaction in recentTransactions" 
                  :key="transaction.id"
                  class="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                      <div 
                        class="w-10 h-10 rounded-full flex items-center justify-center"
                        :class="getTransactionIconClass(transaction.type)"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path 
                            stroke-linecap="round" 
                            stroke-linejoin="round" 
                            stroke-width="2" 
                            :d="getTransactionIcon(transaction.type)"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <div class="font-medium">{{ transaction.description }}</div>
                        <div class="text-sm text-gray-500">{{ formatDateTime(transaction.createdAt) }}</div>
                      </div>
                    </div>
                    <div 
                      class="font-semibold"
                      :class="transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'"
                    >
                      {{ transaction.amount >= 0 ? '+' : '' }}{{ formatPrice(transaction.amount) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Statistics Tab -->
          <div v-if="activeTab === 'statistics'" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-blue-50 rounded-lg p-4">
                <div class="text-2xl font-bold text-blue-600">{{ statistics.totalOrders }}</div>
                <div class="text-sm text-gray-600">Tổng đơn hàng</div>
              </div>
              <div class="bg-green-50 rounded-lg p-4">
                <div class="text-2xl font-bold text-green-600">{{ formatPrice(statistics.totalSpent) }}</div>
                <div class="text-sm text-gray-600">Tổng chi tiêu</div>
              </div>
              <div class="bg-purple-50 rounded-lg p-4">
                <div class="text-2xl font-bold text-purple-600">{{ statistics.totalPoints }}</div>
                <div class="text-sm text-gray-600">Điểm tích lũy</div>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h3 class="font-semibold mb-4">Hoạt động gần đây</h3>
              <div class="space-y-3">
                <div 
                  v-for="activity in recentActivities" 
                  :key="activity.id"
                  class="flex items-center space-x-3 py-2"
                >
                  <div class="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div class="flex-1">
                    <div class="text-sm">{{ activity.description }}</div>
                    <div class="text-xs text-gray-500">{{ activity.date }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Avatar Upload Modal -->
    <div v-if="showAvatarModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">Cập nhật ảnh đại diện</h3>
          <button @click="showAvatarModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="text-center">
          <input 
            ref="avatarInput"
            type="file" 
            accept="image/*" 
            @change="handleAvatarUpload"
            class="hidden"
          >
          <button 
            @click="$refs.avatarInput.click()"
            class="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
          >
            <svg class="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <span class="text-sm text-gray-600">Chọn ảnh từ máy tính</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../../stores/userStore'
import { mapState, mapActions } from 'pinia'

export default {
  name: 'ProfileView',
  data() {
    return {
      activeTab: 'personal',
      showAvatarModal: false,
      userProfile: {
        fullName: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        phone: '0123456789',
        birthDate: '1990-01-01',
        gender: 'male',
        occupation: 'Kỹ sư phần mềm',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        avatar: 'https://via.placeholder.com/96x96/3B82F6/FFFFFF?text=A',
        membershipLevel: 'gold',
        points: 12500,
        joinDate: '2023-01-15',
        twoFactorEnabled: false
      },
      editProfile: {},
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        profilePublic: false,
        showOnlineStatus: true,
        allowMessages: true
      },
      statistics: {
        totalOrders: 45,
        totalSpent: 25000000,
        totalPoints: 12500
      },
      loginSessions: [
        {
          id: 1,
          device: 'Chrome trên Windows',
          location: 'TP.HCM, Việt Nam',
          lastActive: '2 phút trước',
          current: true
        },
        {
          id: 2,
          device: 'Safari trên iPhone',
          location: 'Hà Nội, Việt Nam',
          lastActive: '2 giờ trước',
          current: false
        }
      ],
      recentActivities: [
        {
          id: 1,
          description: 'Đặt hàng thành công #12345',
          date: '2 giờ trước'
        },
        {
          id: 2,
          description: 'Cập nhật thông tin cá nhân',
          date: '1 ngày trước'
        },
        {
          id: 3,
          description: 'Đăng nhập từ thiết bị mới',
          date: '3 ngày trước'
        }
      ],
      walletBalance: 2500000,
      recentTransactions: [
        {
          id: 1,
          type: 'deposit',
          description: 'Nạp tiền vào ví',
          amount: 500000,
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          type: 'payment',
          description: 'Thanh toán đơn hàng #12345',
          amount: -299000,
          createdAt: '2024-01-14T15:45:00Z'
        },
        {
          id: 3,
          type: 'withdrawal',
          description: 'Rút tiền về tài khoản ngân hàng',
          amount: -1000000,
          createdAt: '2024-01-13T09:15:00Z'
        },
        {
          id: 4,
          type: 'refund',
          description: 'Hoàn tiền đơn hàng #12340',
          amount: 150000,
          createdAt: '2024-01-12T14:20:00Z'
        }
      ]
    }
  },
  computed: {
    ...mapState(useUserStore, ['user', 'loading'])
  },
  methods: {
    ...mapActions(useUserStore, ['fetchProfile', 'updateProfile']),
    
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price)
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('vi-VN')
    },
    getMembershipClass(level) {
      switch (level) {
        case 'bronze':
          return 'bg-orange-100 text-orange-800'
        case 'silver':
          return 'bg-gray-100 text-gray-800'
        case 'gold':
          return 'bg-yellow-100 text-yellow-800'
        case 'platinum':
          return 'bg-purple-100 text-purple-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    },
    getMembershipText(level) {
      switch (level) {
        case 'bronze':
          return 'Thành viên Đồng'
        case 'silver':
          return 'Thành viên Bạc'
        case 'gold':
          return 'Thành viên Vàng'
        case 'platinum':
          return 'Thành viên Bạch Kim'
        default:
          return 'Thành viên'
      }
    },
    getUserRole(roles) {
      if (!roles || roles.length === 0) return 'Người dùng'
      const role = roles[0]
      switch (role.name) {
        case 'admin':
          return 'Quản trị viên'
        case 'subadmin':
          return 'Sub Admin'
        case 'seller':
          return 'Người bán'
        default:
          return 'Người dùng'
      }
    },
    async updatePersonalInfo() {
      try {
        await this.updateProfile(this.editProfile)
        this.userProfile = { ...this.editProfile }
        this.$toast.success('Cập nhật thông tin thành công!')
      } catch (error) {
        console.error('Error updating profile:', error)
        this.$toast.error('Có lỗi xảy ra khi cập nhật thông tin')
      }
    },
    async changePassword() {
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        this.$toast.error('Mật khẩu xác nhận không khớp!')
        return
      }
      
      try {
        await this.updateProfile({
          current_password: this.passwordForm.currentPassword,
          password: this.passwordForm.newPassword,
          password_confirmation: this.passwordForm.confirmPassword
        })
        
        this.passwordForm = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
        
        this.$toast.success('Đổi mật khẩu thành công!')
      } catch (error) {
        console.error('Error changing password:', error)
        this.$toast.error('Có lỗi xảy ra khi đổi mật khẩu')
      }
    },
    toggle2FA() {
      this.userProfile.twoFactorEnabled = !this.userProfile.twoFactorEnabled
      this.$toast.success(`${this.userProfile.twoFactorEnabled ? 'Bật' : 'Tắt'} 2FA thành công!`)
    },
    terminateSession(sessionId) {
      this.loginSessions = this.loginSessions.filter(session => session.id !== sessionId)
      this.$toast.success('Kết thúc phiên đăng nhập thành công!')
    },
    updatePreferences() {
      // Call API to update preferences
      this.$toast.success('Cập nhật tùy chọn thành công!')
    },
    formatDateTime(dateTime) {
      return new Date(dateTime).toLocaleString('vi-VN')
    },
    getTransactionIconClass(type) {
      switch (type) {
        case 'deposit':
          return 'bg-green-100 text-green-600'
        case 'withdrawal':
          return 'bg-red-100 text-red-600'
        case 'transfer':
          return 'bg-blue-100 text-blue-600'
        case 'payment':
          return 'bg-purple-100 text-purple-600'
        case 'refund':
          return 'bg-yellow-100 text-yellow-600'
        default:
          return 'bg-gray-100 text-gray-600'
      }
    },
    getTransactionIcon(type) {
      switch (type) {
        case 'deposit':
          return 'M12 6v6m0 0v6m0-6h6m-6 0H6'
        case 'withdrawal':
          return 'M20 12H4m16 0l-4-4m4 4l-4 4'
        case 'transfer':
          return 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'
        case 'payment':
          return 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
        case 'refund':
          return 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6'
        default:
          return 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
      }
    },
    handleAvatarUpload(event) {
      const file = event.target.files[0]
      if (file) {
        // Handle file upload
        const reader = new FileReader()
        reader.onload = (e) => {
          this.userProfile.avatar = e.target.result
          this.showAvatarModal = false
          this.$toast.success('Cập nhật ảnh đại diện thành công!')
        }
        reader.readAsDataURL(file)
      }
    }
  },
  async mounted() {
    this.editProfile = { ...this.userProfile }
    await this.fetchProfile()
    if (this.user) {
      this.editProfile = {
        name: this.user.name || '',
        email: this.user.email || '',
        phone: this.user.phone || '',
        address: this.user.address || ''
      }
    }
  }
}
</script>