import { defineStore } from 'pinia'
import backendApiService from '../services/backendApi'
import Swal from 'sweetalert2'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    isAuthenticated: !!localStorage.getItem('adminToken'),
    adminUser: JSON.parse(localStorage.getItem('adminUser') || 'null'),
    users: [],
    orders: [],
    products: [],
    dashboard: null,
    loading: false,
    error: null
  }),
  
  actions: {
    async login(email, password) {
      this.loading = true
      this.error = null
      
      try {
        const result = await backendApiService.adminLogin(email, password)
        
        if (result && result.success && result.data && result.data.token) {
          // Standardize role checking - use consistent role names from backend
          const user = result.data.user
          const userRole = user.role || (user.roles && user.roles[0]?.name)
          
          // Check if user has admin or subadmin role (correct backend role names)
          const allowedRoles = ['admin', 'subadmin']
          const hasAdminRole = allowedRoles.includes(userRole)
          
          if (hasAdminRole) {
            this.isAuthenticated = true
            // Ensure consistent role naming
            this.adminUser = {
              ...user,
              role: userRole // Keep original role name from backend
            }
            
            // Save to localStorage
            localStorage.setItem('adminToken', result.data.token)
            localStorage.setItem('adminUser', JSON.stringify(this.adminUser))
            
            // Debug logging
            console.log('✅ Admin login successful:', {
              userRole,
              adminUser: this.adminUser,
              token: result.data.token.substring(0, 20) + '...'
            })
            
            return true
          } else {
            this.error = 'Bạn không có quyền truy cập admin'
            console.error('❌ Admin login failed: Invalid role', { userRole, allowedRoles })
            return false
          }
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
    
    async logout() {
      try {
        await backendApiService.logout()
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.isAuthenticated = false
        this.adminUser = null
        
        // Remove from localStorage
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        // Don't remove user tokens when admin logs out
      }
    },
    
    // Check if current admin has specific role
    hasRole(requiredRole) {
      if (!this.adminUser) return false
      
      const currentRole = this.adminUser.role
      
      if (requiredRole === 'admin') {
        return currentRole === 'admin'
      }
      
      if (requiredRole === 'subadmin') {
        return currentRole === 'subadmin'
      }
      
      if (requiredRole === 'admin_or_subadmin') {
        return ['admin', 'subadmin'].includes(currentRole)
      }
      
      return false
    },

    // Get current admin permissions
    getPermissions() {
      if (!this.adminUser) return {}
      
      const role = this.adminUser.role
      return {
        canManageUsers: ['admin', 'subadmin'].includes(role),
        canManageProducts: ['admin', 'subadmin'].includes(role),
        canManageOrders: ['admin', 'subadmin'].includes(role),
        canManageDeposits: ['admin', 'subadmin'].includes(role),
        canManageCommissions: ['admin', 'subadmin'].includes(role),
        canManageSpins: role === 'admin',
        canManageWallets: role === 'admin',
        canManageSettings: role === 'admin',
        canManageBanks: role === 'admin',
        canViewReports: ['admin', 'subadmin'].includes(role),
        canViewFinancialReports: role === 'admin'
      }
    },
    
    // Dashboard
    async fetchDashboard() {
      this.loading = true
      try {
        const response = await backendApiService.adminGetDashboard()
        this.dashboard = response.data || response
      } catch (error) {
        this.error = error.message || 'Failed to fetch dashboard'
        console.error('Dashboard error:', error)
      } finally {
        this.loading = false
      }
    },
    
    // User management actions
    async fetchUsers(params = {}) {
      this.loading = true
      try {
        const response = await backendApiService.adminGetUsers(params)
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
        const response = await backendApiService.adminGetUser(id)
        return response.data || response
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
    
    async updateUser(id, userData) {
      this.loading = true
      try {
        const response = await backendApiService.adminUpdateUser(id, userData)
        
        // Update local state
        const index = this.users.findIndex(user => user.id === id)
        if (index !== -1) {
          this.users[index] = { ...this.users[index], ...userData }
        }
        
        Swal.fire({
          title: 'Success!',
          text: 'User updated successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        })
        
        return response.data || response
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
        await backendApiService.adminDeleteUser(id)
        
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
    
    // Product management actions
    async fetchProducts(params = {}) {
      this.loading = true
      try {
        const response = await backendApiService.adminGetProducts(params)
        this.products = response.data || response
      } catch (error) {
        this.error = error.message || 'Failed to fetch products'
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
    
    // Order management actions
    async fetchOrders(params = {}) {
      this.loading = true
      try {
        const response = await backendApiService.adminGetOrders(params)
        this.orders = response.data || response
      } catch (error) {
        this.error = error.message || 'Failed to fetch orders'
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
    
    async updateOrderStatus(orderId, status) {
      this.loading = true
      try {
        await backendApiService.adminUpdateOrderStatus(orderId, status)
        
        // Update local state
        const index = this.orders.findIndex(order => order.id === orderId)
        if (index !== -1) {
          this.orders[index] = { 
            ...this.orders[index], 
            status: status 
          }
        }
        
        Swal.fire({
          title: 'Success!',
          text: 'Order status updated successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        })
        
        return true
      } catch (error) {
        this.error = error.message || 'Failed to update order status'
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
    }
  }
})