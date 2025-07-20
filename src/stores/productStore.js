import { defineStore } from 'pinia'
import backendApiService from '../services/backendApi'
import Swal from 'sweetalert2'
import apiAdapter from '../services/apiAdapter'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    categories: [],
    featuredProducts: [],
    loading: false,
    error: null
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
    async fetchProducts(params = {}) {
      this.loading = true
      
      try {
        const response = await backendApiService.getProducts(params)
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

    async fetchCategories() {
      this.loading = true
      
      try {
        const response = await backendApiService.getCategories()
        this.categories = response.data || response
      } catch (error) {
        this.error = error.message || 'Failed to fetch categories'
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

    async fetchFeaturedProducts() {
      this.loading = true
      
      try {
        const response = await backendApiService.getFeaturedProducts()
        this.featuredProducts = response.data || response
      } catch (error) {
        this.error = error.message || 'Failed to fetch featured products'
        console.error('Featured products error:', error)
      } finally {
        this.loading = false
      }
    },
    
    async getProductById(id) {
      try {
        const response = await backendApiService.getProduct(id)
        return response.data || response
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
    
    async updateProduct(id, productData) {
      this.loading = true
      
      try {
        const response = await backendApiService.adminUpdateProduct(id, productData)
        
        // Update local state
        const index = this.products.findIndex(product => product.id === id)
        if (index !== -1) {
          this.products[index] = { ...this.products[index], ...productData }
        }
        
        Swal.fire({
          title: 'Success!',
          text: 'Product updated successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        })
        
        return response.data || response
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
        await apiAdapter.approveProduct(id)
        
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
        await apiAdapter.deleteProduct(id)
        
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
        // Call API to create product
        const response = await backendApiService.adminCreateProduct(productData)
        
        // Add to local state
        this.products.push(response.data || response)
        
        Swal.fire({
          title: 'Success!',
          text: 'Product created successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        })
        
        return response.data || response
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
    },

    async adminDeleteProduct(id) {
      this.loading = true
      
      try {
        await backendApiService.adminDeleteProduct(id)
        
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

    async searchProducts(query, params = {}) {
      this.loading = true
      
      try {
        const response = await backendApiService.searchProducts(query, params)
        return response.data || response
      } catch (error) {
        this.error = error.message || 'Failed to search products'
        Swal.fire({
          title: 'Error!',
          text: this.error,
          icon: 'error',
          confirmButtonText: 'OK'
        })
        return []
      } finally {
        this.loading = false
      }
    }
  }
})