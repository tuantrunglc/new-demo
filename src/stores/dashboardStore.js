import { defineStore } from 'pinia'
import api from '../services/api'
import Swal from 'sweetalert2'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    totalUsers: 0,
    totalSellers: 0,
    totalOrders: 0,
    todayRevenue: 0,
    topSellers: [],
    ordersByDay: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchDashboardData() {
      this.loading = true
      
      try {
        const response = await api.getDashboardData()
        const data = response.data
        
        this.totalUsers = data.totalUsers
        this.totalSellers = data.totalSellers
        this.totalOrders = data.totalOrders
        this.todayRevenue = data.todayRevenue
        this.topSellers = data.topSellers
        this.ordersByDay = data.ordersByDay
      } catch (error) {
        this.error = error.message || 'Failed to fetch dashboard data'
        Swal.fire({
          title: 'Error!',
          text: this.error,
          icon: 'error',
          confirmButtonText: 'OK'
        })
      } finally {
        this.loading = false
      }
    }
  }
})