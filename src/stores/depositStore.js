import { defineStore } from 'pinia';
import { depositService } from '@/services/depositService';

export const useDepositStore = defineStore('deposit', {
  state: () => ({
    // User deposits
    userDeposits: [],
    userDepositsPagination: {
      current_page: 1,
      per_page: 10,
      total: 0,
      total_pages: 0
    },
    
    // Admin deposits
    allDeposits: [],
    allDepositsPagination: {
      current_page: 1,
      per_page: 10,
      total: 0,
      total_pages: 0,
      has_next: false,
      has_prev: false
    },
    
    // Statistics (for admin)
    statistics: {
      pending_count: 0,
      approved_count: 0,
      rejected_count: 0,
      today_total: 0,
      today_approved: 0
    },
    
    // UI state
    loading: false,
    error: null,
    
    // Filters
    filters: {
      status: 'all',
      search: '',
      from_date: '',
      to_date: '',
      page: 1,
      limit: 10
    }
  }),

  getters: {
    // Get deposits by status
    pendingDeposits: (state) => state.allDeposits.filter(d => d.status === 'pending'),
    approvedDeposits: (state) => state.allDeposits.filter(d => d.status === 'approved'),
    rejectedDeposits: (state) => state.allDeposits.filter(d => d.status === 'rejected'),
    
    // Get formatted statistics
    formattedStatistics: (state) => ({
      ...state.statistics,
      today_total_formatted: depositService.formatCurrency(state.statistics.today_total),
      today_approved_formatted: depositService.formatCurrency(state.statistics.today_approved)
    }),
    
    // Check if there are more pages
    hasMorePages: (state) => state.allDepositsPagination.has_next,
    hasPrevPages: (state) => state.allDepositsPagination.has_prev,
    
    // Get current filters
    activeFilters: (state) => {
      const filters = { ...state.filters };
      // Remove empty filters
      Object.keys(filters).forEach(key => {
        if (filters[key] === '' || filters[key] === 'all') {
          delete filters[key];
        }
      });
      return filters;
    }
  },

  actions: {
    // Set loading state
    setLoading(loading) {
      this.loading = loading;
    },

    // Set error state
    setError(error) {
      this.error = error;
    },

    // Clear error
    clearError() {
      this.error = null;
    },

    // Update filters
    updateFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters };
    },

    // Reset filters
    resetFilters() {
      this.filters = {
        status: 'all',
        search: '',
        from_date: '',
        to_date: '',
        page: 1,
        limit: 10
      };
    },

    // Create new deposit
    async createDeposit(depositData) {
      this.setLoading(true);
      this.clearError();
      
      try {
        const response = await depositService.createDeposit(depositData);
        
        // Add to user deposits if successful
        if (response.success) {
          this.userDeposits.unshift(response.data);
        }
        
        return response;
      } catch (error) {
        this.setError(error.message);
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    // Fetch user deposits
    async fetchUserDeposits(params = {}) {
      this.setLoading(true);
      this.clearError();
      
      try {
        const response = await depositService.getUserDeposits(params);
        
        if (response.success) {
          this.userDeposits = response.data.deposits;
          this.userDepositsPagination = response.data.pagination;
        }
        
        return response;
      } catch (error) {
        this.setError(error.message);
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    // Fetch all deposits (Admin)
    async fetchAllDeposits(params = {}) {
      this.setLoading(true);
      this.clearError();
      
      try {
        const mergedParams = { ...this.activeFilters, ...params };
        const response = await depositService.getAllDeposits(mergedParams);
        
        if (response.success) {
          this.allDeposits = response.data.deposits;
          this.allDepositsPagination = response.data.pagination;
          this.statistics = response.data.statistics;
        }
        
        return response;
      } catch (error) {
        this.setError(error.message);
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    // Update deposit status (Admin)
    async updateDepositStatus(depositId, updateData) {
      this.setLoading(true);
      this.clearError();
      
      try {
        const response = await depositService.updateDepositStatus(depositId, updateData);
        
        if (response.success) {
          // Update the deposit in the list
          const index = this.allDeposits.findIndex(d => d.reference_code === depositId);
          if (index !== -1) {
            this.allDeposits[index] = {
              ...this.allDeposits[index],
              status: response.data.status,
              admin_note: response.data.admin_note,
              processed_by: response.data.processed_by,
              processed_at: response.data.processed_at
            };
          }
          
          // Update statistics
          await this.fetchAllDeposits({ page: this.filters.page });
        }
        
        return response;
      } catch (error) {
        this.setError(error.message);
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    // Approve deposit
    async approveDeposit(depositId, adminNote = '') {
      return await this.updateDepositStatus(depositId, {
        status: 'approved',
        admin_note: adminNote || 'Đã xác nhận chuyển khoản thành công'
      });
    },

    // Reject deposit
    async rejectDeposit(depositId, adminNote = '') {
      return await this.updateDepositStatus(depositId, {
        status: 'rejected',
        admin_note: adminNote || 'Không tìm thấy giao dịch chuyển khoản'
      });
    },

    // Load more deposits (pagination)
    async loadMoreDeposits() {
      if (!this.hasMorePages || this.loading) return;
      
      const nextPage = this.allDepositsPagination.current_page + 1;
      this.updateFilters({ page: nextPage });
      
      return await this.fetchAllDeposits();
    },

    // Go to specific page
    async goToPage(page) {
      this.updateFilters({ page });
      return await this.fetchAllDeposits();
    },

    // Search deposits
    async searchDeposits(searchTerm) {
      this.updateFilters({ search: searchTerm, page: 1 });
      return await this.fetchAllDeposits();
    },

    // Filter by status
    async filterByStatus(status) {
      this.updateFilters({ status, page: 1 });
      return await this.fetchAllDeposits();
    },

    // Filter by date range
    async filterByDateRange(fromDate, toDate) {
      this.updateFilters({ 
        from_date: fromDate, 
        to_date: toDate, 
        page: 1 
      });
      return await this.fetchAllDeposits();
    },

    // Refresh deposits
    async refreshDeposits() {
      this.updateFilters({ page: 1 });
      return await this.fetchAllDeposits();
    },

    // Get deposit by reference code
    getDepositByReferenceCode(referenceCode) {
      return this.allDeposits.find(d => d.reference_code === referenceCode) ||
             this.userDeposits.find(d => d.reference_code === referenceCode);
    },

    // Format deposit for display
    formatDepositForDisplay(deposit) {
      return {
        ...deposit,
        amount_formatted: depositService.formatCurrency(deposit.amount),
        created_at_formatted: depositService.formatDate(deposit.created_at),
        processed_at_formatted: deposit.processed_at 
          ? depositService.formatDate(deposit.processed_at) 
          : null,
        status_text: depositService.getStatusText(deposit.status),
        status_class: depositService.getStatusBadgeClass(deposit.status)
      };
    }
  }
});

export default useDepositStore;