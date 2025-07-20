import { defineStore } from 'pinia'
import backendApiService from '../services/backendApi'
import Swal from 'sweetalert2'
import apiAdapter from '../services/apiAdapter'

export const useUserStore = defineStore('user', {
  state: () => ({
    isAuthenticated: !!localStorage.getItem('userToken'),
    currentUser: JSON.parse(localStorage.getItem('currentUser') || 'null'),
    users: [],
    loading: false,
    error: null
  }),
  
  getters: {
    user() {
      return this.currentUser
    },
    
    isAdmin() {
      return this.currentUser?.role === 'admin'
    },
    
    isSubAdmin() {
      return this.currentUser?.role === 'subadmin'
    },
    
    hasAdminAccess() {
      return this.isAdmin || this.isSubAdmin
    },
    
    isUser() {
      return this.currentUser?.role === 'user'
    },
    
    fullName() {
      if (!this.currentUser) return ''
      return `${this.currentUser.firstName || ''} ${this.currentUser.lastName || ''}`.trim()
    },
    
    getUsersByRole: (state) => (role) => {
      if (!role) return state.users
      return state.users.filter(user => user.role === role)
    }
  },
  
  actions: {
    async login(email, password) {
      this.loading = true
      this.error = null
      
      try {
        const result = await backendApiService.userLogin(email, password)
        
        if (result && result.success && result.data && result.data.token) {
          this.isAuthenticated = true
          this.currentUser = result.data.user
          
          // Save to localStorage
          localStorage.setItem('userToken', result.data.token)
          localStorage.setItem('currentUser', JSON.stringify(result.data.user))
          
          return true
        } else {
          this.error = 'Email hoặc mật khẩu không đúng'
          return false
        }
      } catch (error) {
        this.error = error.message || 'Đã xảy ra lỗi khi đăng nhập'
        return false
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      this.error = null
      
      try {
        const result = await backendApiService.userRegister(userData)
        
        if (result && result.success && result.data && result.data.token) {
          this.isAuthenticated = true
          this.currentUser = result.data.user
          
          // Save to localStorage
          localStorage.setItem('userToken', result.data.token)
          localStorage.setItem('currentUser', JSON.stringify(result.data.user))
          
          return true
        } else {
          this.error = 'Đăng ký thất bại'
          return false
        }
      } catch (error) {
        this.error = error.message || 'Đã xảy ra lỗi khi đăng ký'
        return false
      } finally {
        this.loading = false
      }
    },
    
    async logout() {
      try {
        await backendApiService.logout()
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.isAuthenticated = false
        this.currentUser = null
        
        // Remove from localStorage
        localStorage.removeItem('userToken')
        localStorage.removeItem('currentUser')
        // Don't remove admin tokens when user logs out
      }
    },
    
    // Check if current user has admin privileges
    checkAdminAccess() {
      const adminToken = localStorage.getItem('adminToken')
      const adminUser = JSON.parse(localStorage.getItem('adminUser') || 'null')
      
      if (adminToken && adminUser) {
        return ['admin', 'subadmin'].includes(adminUser.role)
      }
      return false
    },
    
    // Check if current user is regular user
    checkUserAccess() {
      const userToken = localStorage.getItem('userToken')
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
      
      if (userToken && currentUser) {
        return currentUser.role === 'user'
      }
      return false
    },
    
    // Get current authentication type
    getCurrentAuthType() {
      if (this.checkAdminAccess()) return 'admin'
      if (this.checkUserAccess()) return 'user'
      return null
    },
    
    async fetchUsers() {
      this.loading = true
      
      try {
        const response = await backendApiService.adminGetUsers()
        this.users = response.data || response
      } catch (error) {
        this.error = error.message || 'Failed to fetch users'
        Swal.fire({
          title: 'Error!',
          text: this.error,
          icon: 'error',
          confirmButtonText: 'OK'
        })
      } finally {
        this.loading = false
      }
    },
    
    async getUserById(id) {
      try {
        const response = await backendApiService.getUserById(id)
        return response.data
      } catch (error) {
        this.error = error.message || 'Failed to fetch user'
        Swal.fire({
          title: 'Error!',
          text: this.error,
          icon: 'error',
          confirmButtonText: 'OK'
        })
        return null
      }
    },
    
    async updateUser(userData) {
      this.loading = true
      
      try {
        const response = await backendApiService.updateUser(userData)
        
        // Update local state
        const index = this.users.findIndex(user => user.id === userData.id)
        if (index !== -1) {
          this.users[index] = { ...this.users[index], ...userData }
        }
        
        Swal.fire({
          title: 'Success!',
          text: 'User updated successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        })
        
        return response.data
      } catch (error) {
        this.error = error.message || 'Failed to update user'
        Swal.fire({
          title: 'Error!',
          text: this.error,
          icon: 'error',
          confirmButtonText: 'OK'
        })
        return null
      } finally {
        this.loading = false
      }
    },
    
    async deleteUser(id) {
      this.loading = true
      
      try {
        await backendApiService.deleteUser(id)
        
        // Update local state
        this.users = this.users.filter(user => user.id !== id)
        
        Swal.fire({
          title: 'Success!',
          text: 'User deleted successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        })
        
        return true
      } catch (error) {
        this.error = error.message || 'Failed to delete user'
        Swal.fire({
          title: 'Error!',
          text: this.error,
          icon: 'error',
          confirmButtonText: 'OK'
        })
        return false
      } finally {
        this.loading = false
      }
    },
    
    async changeUserPassword(userId, newPassword) {
      this.loading = true
      
      try {
        await apiAdapter.changeUserPassword(userId, newPassword)
        
        Swal.fire({
          title: 'Thành công!',
          text: 'Mật khẩu đã được cập nhật thành công',
          icon: 'success',
          confirmButtonText: 'OK'
        })
        
        return true
      } catch (error) {
        this.error = error.message || 'Không thể cập nhật mật khẩu'
        Swal.fire({
          title: 'Lỗi!',
          text: this.error,
          icon: 'error',
          confirmButtonText: 'OK'
        })
        return false
      } finally {
        this.loading = false
      }
    },

    async fetchProfile() {
      this.loading = true
      this.error = null
      
      try {
        const result = await backendApiService.getProfile()
        
        if (result && result.success && result.data && result.data.user) {
          this.currentUser = result.data.user
          localStorage.setItem('currentUser', JSON.stringify(result.data.user))
          return result.data.user
        } else {
          this.error = 'Không thể lấy thông tin profile'
          return null
        }
      } catch (error) {
        this.error = error.message || 'Đã xảy ra lỗi khi lấy thông tin profile'
        return null
      } finally {
        this.loading = false
      }
    },

    async updateProfile(profileData) {
      this.loading = true
      this.error = null
      
      try {
        const result = await backendApiService.updateProfile(profileData)
        
        if (result && result.success) {
          // Update current user data
          if (result.data && result.data.user) {
            this.currentUser = result.data.user
            localStorage.setItem('currentUser', JSON.stringify(result.data.user))
          }
          return result
        } else {
          this.error = 'Cập nhật profile thất bại'
          return null
        }
      } catch (error) {
        this.error = error.message || 'Đã xảy ra lỗi khi cập nhật profile'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})