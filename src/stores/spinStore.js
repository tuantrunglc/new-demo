import { defineStore } from 'pinia'
import api from '../services/api'
import Swal from 'sweetalert2'

export const useSpinStore = defineStore('spin', {
  state: () => ({
    spinItems: [],
    userSpins: [],
    loading: false,
    error: null
  }),
  
  getters: {
    getSpinItemById: (state) => (id) => {
      return state.spinItems.find(item => item.id === id)
    },
    
    getUserSpinById: (state) => (userId) => {
      return state.userSpins.find(spin => spin.userId === userId)
    },
    
    getTotalProbability: (state) => {
      return state.spinItems.reduce((sum, item) => sum + item.probability, 0)
    }
  },
  
  actions: {
    async fetchSpinItems() {
      this.loading = true
      
      try {
        const response = await api.getSpinItems()
        this.spinItems = response.data
      } catch (error) {
        this.error = error.message || 'Failed to fetch spin items'
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
    
    async updateSpinItem(itemData) {
      this.loading = true
      
      try {
        const response = await api.updateSpinItem(itemData)
        
        // Update local state
        const index = this.spinItems.findIndex(item => item.id === itemData.id)
        if (index !== -1) {
          this.spinItems[index] = { ...this.spinItems[index], ...itemData }
        }
        
        Swal.fire({
          title: 'Success!',
          text: 'Spin item updated successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        })
        
        return response.data
      } catch (error) {
        this.error = error.message || 'Failed to update spin item'
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
    
    async fetchUserSpins(userId) {
      try {
        const response = await api.getUserSpins(userId)
        
        // Update local state
        const index = this.userSpins.findIndex(spin => spin.userId === userId)
        if (index !== -1) {
          this.userSpins[index] = response.data
        } else {
          this.userSpins.push(response.data)
        }
        
        return response.data
      } catch (error) {
        this.error = error.message || 'Failed to fetch user spins'
        Swal.fire({
          title: 'Error!',
          text: this.error,
          icon: 'error',
          confirmButtonText: 'OK'
        })
        return null
      }
    },
    
    async addUserSpins(userId, count) {
      this.loading = true
      
      try {
        await api.addUserSpins(userId, count)
        
        // Update local state
        const index = this.userSpins.findIndex(spin => spin.userId === userId)
        if (index !== -1) {
          this.userSpins[index].spinsRemaining += count
        } else {
          // Fetch user spins first if not in state
          await this.fetchUserSpins(userId)
          const newIndex = this.userSpins.findIndex(spin => spin.userId === userId)
          if (newIndex !== -1) {
            this.userSpins[newIndex].spinsRemaining += count
          }
        }
        
        Swal.fire({
          title: 'Success!',
          text: `Added ${count} spins to user`,
          icon: 'success',
          confirmButtonText: 'OK'
        })
        
        return true
      } catch (error) {
        this.error = error.message || 'Failed to add user spins'
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