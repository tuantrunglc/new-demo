import { defineStore } from 'pinia'
import { authenticateAdmin } from '../data/users'
import { users } from '../data/users'
import { orders } from '../data/orders'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    isAuthenticated: !!localStorage.getItem('adminToken'),
    adminUser: JSON.parse(localStorage.getItem('adminUser') || 'null'),
    users: [...users],
    orders: [...orders],
    loading: false,
    error: null
  }),
  
  actions: {
    async login(username, password) {
      this.loading = true
      this.error = null
      
      try {
        // Simulate API call with a delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const result = authenticateAdmin(username, password)
        
        if (result) {
          this.isAuthenticated = true
          this.adminUser = result.user
          
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
      this.adminUser = null
      
      // Remove from localStorage
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminUser')
    },
    
    // User management actions
    getUsers() {
      return this.users
    },
    
    getUserById(id) {
      return this.users.find(user => user.id === id)
    },
    
    updateUser(updatedUser) {
      const index = this.users.findIndex(user => user.id === updatedUser.id)
      if (index !== -1) {
        this.users[index] = { ...this.users[index], ...updatedUser }
      }
    },
    
    deleteUser(id) {
      this.users = this.users.filter(user => user.id !== id)
    },
    
    // Order management actions
    getOrders() {
      return this.orders
    },
    
    getOrderById(id) {
      return this.orders.find(order => order.id === id)
    },
    
    updateOrderStatus(orderId, status) {
      const index = this.orders.findIndex(order => order.id === orderId)
      if (index !== -1) {
        this.orders[index] = { 
          ...this.orders[index], 
          status: status 
        }
      }
    },
    
    updatePaymentStatus(orderId, status) {
      const index = this.orders.findIndex(order => order.id === orderId)
      if (index !== -1) {
        this.orders[index] = { 
          ...this.orders[index], 
          paymentStatus: status 
        }
      }
    }
  }
})