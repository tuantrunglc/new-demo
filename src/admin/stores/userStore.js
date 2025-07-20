import { defineStore } from 'pinia'
import api from '../services/api'
import Swal from 'sweetalert2'

export const useUserStore = defineStore('user', {
  state: () => ({
    isAuthenticated: !!localStorage.getItem('adminToken'),
    currentUser: JSON.parse(localStorage.getItem('adminUser') || 'null'),
    users: [],
    loading: false,
    error: null
  }),
  
  getters: {
    isAdmin() {
      return this.currentUser?.role === 'admin'
    },
    
    isSubAdmin() {
      return this.currentUser?.role === 'sub_admin'
    },
    
    hasAdminAccess() {
      return this.isAdmin || this.isSubAdmin
    },
    
    getUsersByRole: (state) => (role) => {
      if (!role) return state.users
      return state.users.filter(user => user.role === role)
    }
  },
  
  actions: {
    async login(username, password) {
      this.loading = true
      this.error = null
      
      try {
        const result = await api.login(username, password)
        
        if (result) {
          this.isAuthenticated = true
          this.currentUser = result.user
          
          // Save to localStorage
          localStorage.setItem('adminToken', result.token)
          localStorage.setItem('adminUser', JSON.stringify(result.user))
          
          return true
        } else {
          this.error = 'Tên đăng nhập hoặc mật khẩu không đúng'
          return false
        }
      } catch (error) {
        this.error = error.message || 'Đã xảy ra lỗi khi đăng nhập'
        return false
      } finally {
        this.loading = false
      }
    },
    
    logout() {
      this.isAuthenticated = false
      this.currentUser = null
      
      // Remove from localStorage
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminUser')
    },
    
    async fetchUsers() {
      this.loading = true
      
      try {
        const response = await api.getUsers()
        this.users = response.data
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
        const response = await api.getUserById(id)
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
        const response = await api.updateUser(userData)
        
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
        await api.deleteUser(id)
        
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
        await api.changeUserPassword(userId, newPassword)
        
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
    }
  }
})