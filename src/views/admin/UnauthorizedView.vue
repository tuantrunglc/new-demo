<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <div class="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
      <div class="text-red-500 text-6xl mb-4">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <h1 class="text-2xl font-bold text-gray-800 mb-4">Không có quyền truy cập</h1>
      <p class="text-gray-600 mb-6">
        Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn cần hỗ trợ.
      </p>
      <div class="flex justify-center space-x-4">
        <router-link to="/admin" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          Quay lại Dashboard
        </router-link>
        <button @click="logout" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
          Đăng xuất
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/userStore'

export default {
  name: 'UnauthorizedView',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    
    const logout = () => {
      userStore.logout()
      router.push('/admin/login')
    }
    
    return {
      logout
    }
  }
}
</script>