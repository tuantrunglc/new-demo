import { defineStore } from 'pinia'
import api from '../services/api'
import Swal from 'sweetalert2'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    loading: false,
    error: null,
    nextId: 100 // For generating new product IDs
  }),
  
  getters: {
    getProductsBySeller: (state) => (sellerId) => {
      if (!sellerId) return state.products
      return state.products.filter(product => product.sellerId === sellerId)
    },
    
    getProductsByStatus: (state) => (status) => {
      if (!status) return state.products
      return state.products.filter(product => product.status === status)
    },
    
    getPendingProducts: (state) => {
      return state.products.filter(product => product.status === 'pending')
    },
    
    getApprovedProducts: (state) => {
      return state.products.filter(product => product.status === 'approved')
    }
  },
  
  actions: {
    async fetchProducts() {
      this.loading = true
      
      try {
        const response = await api.getProducts()
        this.products = response.data
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
    
    async getProductById(id) {
      try {
        const response = await api.getProductById(id)
        return response.data
      } catch (error) {
        this.error = error.message || 'Failed to fetch product'
        Swal.fire({
          title: 'Error!',
          text: this.error,
          icon: 'error',
          confirmButtonText: 'OK'
        })
        return null
      }
    },
    
    async updateProduct(productData) {
      this.loading = true
      
      try {
        const response = await api.updateProduct(productData)
        
        // Update local state
        const index = this.products.findIndex(product => product.id === productData.id)
        if (index !== -1) {
          this.products[index] = { ...this.products[index], ...productData }
        }
        
        Swal.fire({
          title: 'Success!',
          text: 'Product updated successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        })
        
        return response.data
      } catch (error) {
        this.error = error.message || 'Failed to update product'
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
    
    async approveProduct(id) {
      this.loading = true
      
      try {
        await api.approveProduct(id)
        
        // Update local state
        const index = this.products.findIndex(product => product.id === id)
        if (index !== -1) {
          this.products[index].status = 'approved'
        }
        
        Swal.fire({
          title: 'Success!',
          text: 'Product approved successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        })
        
        return true
      } catch (error) {
        this.error = error.message || 'Failed to approve product'
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
    
    async deleteProduct(id) {
      this.loading = true
      
      try {
        await api.deleteProduct(id)
        
        // Update local state
        this.products = this.products.filter(product => product.id !== id)
        
        Swal.fire({
          title: 'Success!',
          text: 'Product deleted successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        })
        
        return true
      } catch (error) {
        this.error = error.message || 'Failed to delete product'
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
    
    async createProduct(productData) {
      this.loading = true
      
      try {
        // Generate a new ID for the product
        const newId = this.nextId++
        const newProduct = {
          id: newId,
          ...productData
        }
        
        // Call API to create product
        const response = await api.createProduct(newProduct)
        
        // Add to local state
        this.products.push(response.data)
        
        Swal.fire({
          title: 'Success!',
          text: 'Product created successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        })
        
        return response.data
      } catch (error) {
        this.error = error.message || 'Failed to create product'
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