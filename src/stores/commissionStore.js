import { defineStore } from 'pinia'
import api from '../services/api'
import Swal from 'sweetalert2'

export const useCommissionStore = defineStore('commission', {
  state: () => ({
    commissions: [],
    wallets: [],
    loading: false,
    error: null
  }),
  
  getters: {
    getCommissionsBySeller: (state) => (sellerId) => {
      if (!sellerId) return state.commissions
      return state.commissions.filter(commission => commission.sellerId === sellerId)
    },
    
    getCommissionsByOrder: (state) => (orderId) => {
      if (!orderId) return state.commissions
      return state.commissions.filter(commission => commission.orderId === orderId)
    },
    
    getWalletBySeller: (state) => (sellerId) => {
      return state.wallets.find(wallet => wallet.sellerId === sellerId)
    },
    
    getTotalCommissions: (state) => {
      return state.commissions.reduce((sum, commission) => {
        return commission.status === 'paid' ? sum + commission.amount : sum
      }, 0)
    },
    
    getTotalPendingCommissions: (state) => {
      return state.commissions.reduce((sum, commission) => {
        return commission.status === 'pending' ? sum + commission.amount : sum
      }, 0)
    }
  },
  
  actions: {
    async fetchCommissions() {
      this.loading = true
      
      try {
        const response = await api.getCommissions()
        this.commissions = response.data
      } catch (error) {
        this.error = error.message || 'Failed to fetch commissions'
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
    
    async fetchWallets() {
      this.loading = true
      
      try {
        const response = await api.getWallets()
        this.wallets = response.data
      } catch (error) {
        this.error = error.message || 'Failed to fetch wallets'
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
    
    async updateWalletBalance({ sellerId, amount, type, description }) {
      this.loading = true
      
      try {
        const response = await api.updateWalletBalance(sellerId, amount, type, description)
        
        // Update local state
        const index = this.wallets.findIndex(wallet => wallet.sellerId === sellerId)
        if (index !== -1) {
          if (type === 'add') {
            this.wallets[index].balance += amount
          } else if (type === 'subtract') {
            this.wallets[index].balance -= amount
          }
          
          this.wallets[index].lastUpdated = new Date().toISOString()
        }
        
        // Add transaction to history if needed
        if (response.data.transaction) {
          // If we had a transactions array, we would push it here
        }
        
        Swal.fire({
          title: 'Thành công!',
          text: `Đã ${type === 'add' ? 'cộng' : 'trừ'} ${new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(amount)} vào ví của người bán`,
          icon: 'success',
          confirmButtonText: 'OK'
        })
        
        return true
      } catch (error) {
        this.error = error.message || 'Failed to update wallet balance'
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