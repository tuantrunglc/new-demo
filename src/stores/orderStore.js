import { defineStore } from 'pinia'
import api from '../services/api'
import Swal from 'sweetalert2'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
    loading: false,
    error: null
  }),
  
  getters: {
    getOrdersByStatus: (state) => (status) => {
      if (!status) return state.orders
      return state.orders.filter(order => order.status === status)
    },
    
    getOrdersByDate: (state) => (date) => {
      if (!date) return state.orders
      return state.orders.filter(order => order.createdAt.startsWith(date))
    },
    
    getOrdersBySeller: (state) => (sellerId) => {
      if (!sellerId) return state.orders
      return state.orders.filter(order => order.sellerId === sellerId)
    },
    
    getOrdersByUser: (state) => (userId) => {
      if (!userId) return state.orders
      return state.orders.filter(order => order.userId === userId)
    }
  },
  
  actions: {
    async fetchOrders() {
      this.loading = true
      
      try {
        const response = await api.getOrders()
        this.orders = response.data
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
    
    async getOrderById(id) {
      try {
        const response = await api.getOrderById(id)
        return response.data
      } catch (error) {
        this.error = error.message || 'Failed to fetch order'
        Swal.fire({
          title: 'Error!',
          text: this.error,
          icon: 'error',
          confirmButtonText: 'OK'
        })
        return null
      }
    },
    
    async updateOrderStatus({ orderId, status, paymentStatus }) {
      this.loading = true
      
      try {
        await api.updateOrderStatus(orderId, status)
        
        // Update local state
        const index = this.orders.findIndex(order => order.id === orderId)
        if (index !== -1) {
          this.orders[index].status = status
          
          if (paymentStatus) {
            this.orders[index].paymentStatus = paymentStatus
          }
          
          this.orders[index].updatedAt = new Date().toISOString()
        }
        
        Swal.fire({
          title: 'Success!',
          text: `Order status updated successfully`,
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
    },
    
    async createOrder(orderData) {
      this.loading = true
      
      try {
        const response = await api.createOrder(orderData)
        
        // Add to local state
        this.orders.push(response.data)
        
        Swal.fire({
          title: 'Success!',
          text: 'Order created successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        })
        
        return response.data
      } catch (error) {
        this.error = error.message || 'Failed to create order'
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
    }
  }
})