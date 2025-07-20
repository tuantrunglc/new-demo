<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="bg-indigo-600 py-4">
        <h2 class="text-center text-white text-2xl font-bold">Admin Login</h2>
      </div>
      
      <div class="p-6">
        <div v-if="error" class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>
        
        <form @submit.prevent="handleLogin">
          <div class="mb-4">
            <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              required
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Nhập email"
            >
          </div>
          
          <div class="mb-6">
            <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Mật khẩu</label>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              required
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Nhập mật khẩu"
            >
          </div>
          
          <div class="flex items-center justify-between">
            <button 
              type="submit" 
              class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              :disabled="loading"
            >
              <span v-if="loading" class="inline-block animate-spin h-4 w-4 border-t-2 border-white rounded-full mr-2"></span>
              Đăng nhập
            </button>
          </div>
        </form>
        
        <div class="mt-6 text-center">
          <router-link to="/" class="text-indigo-600 hover:text-indigo-800 text-sm">
            <i class="fas fa-arrow-left mr-1"></i> Quay lại trang chủ
          </router-link>
        </div>
        
        <div class="mt-4 text-center text-gray-500 text-xs">
          <p>Admin: admin@ecoman.com / admin123</p>
          <p>SubAdmin: subadmin@ecoman.com / subadmin123</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '../stores/adminStore'

export default {
  name: 'AdminLogin',
  setup() {
    const router = useRouter()
    const adminStore = useAdminStore()
    
    const email = ref('')
    const password = ref('')
    
    const loading = computed(() => adminStore.loading)
    const error = computed(() => adminStore.error)
    
    const handleLogin = async () => {
      const success = await adminStore.login(email.value, password.value)
      if (success) {
        router.push('/admin')
      }
    }
    
    return {
      email,
      password,
      handleLogin,
      loading,
      error
    }
  }
}
</script>