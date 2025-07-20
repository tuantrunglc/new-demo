<template>
  <div class="deposit-history">
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="card-title mb-0">
          <i class="fas fa-history me-2"></i>
          Lịch sử nạp tiền
        </h5>
        <button
          class="btn btn-outline-primary btn-sm"
          @click="refreshHistory"
          :disabled="loading"
        >
          <i class="fas fa-sync-alt me-1" :class="{ 'fa-spin': loading }"></i>
          Làm mới
        </button>
      </div>
      
      <div class="card-body">
        <!-- Loading State -->
        <div v-if="loading && deposits.length === 0" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
          <p class="mt-2 text-muted">Đang tải lịch sử nạp tiền...</p>
        </div>
        
        <!-- Empty State -->
        <div v-else-if="!loading && deposits.length === 0" class="text-center py-5">
          <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
          <h6 class="text-muted">Chưa có lịch sử nạp tiền</h6>
          <p class="text-muted">Bạn chưa có yêu cầu nạp tiền nào.</p>
        </div>
        
        <!-- Deposits List -->
        <div v-else class="deposits-list">
          <div
            v-for="deposit in formattedDeposits"
            :key="deposit.reference_code"
            class="deposit-item"
          >
            <div class="row align-items-center">
              <!-- Status Badge -->
              <div class="col-auto">
                <span class="badge" :class="deposit.status_class">
                  {{ deposit.status_text }}
                </span>
              </div>
              
              <!-- Deposit Info -->
              <div class="col">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 class="mb-1">{{ deposit.amount_formatted }}</h6>
                    <p class="mb-1 text-muted small">
                      <i class="fas fa-hashtag me-1"></i>
                      {{ deposit.reference_code }}
                    </p>
                    <p v-if="deposit.description" class="mb-1 text-muted small">
                      <i class="fas fa-comment me-1"></i>
                      {{ deposit.description }}
                    </p>
                    <p class="mb-0 text-muted small">
                      <i class="fas fa-clock me-1"></i>
                      {{ deposit.created_at_formatted }}
                    </p>
                  </div>
                  
                  <!-- Actions -->
                  <div class="text-end">
                    <button
                      class="btn btn-outline-info btn-sm"
                      @click="showDepositDetails(deposit)"
                    >
                      <i class="fas fa-eye me-1"></i>
                      Chi tiết
                    </button>
                  </div>
                </div>
                
                <!-- Admin Note -->
                <div v-if="deposit.admin_note" class="mt-2">
                  <div class="alert alert-sm" :class="getAdminNoteClass(deposit.status)">
                    <small>
                      <i class="fas fa-user-shield me-1"></i>
                      <strong>Ghi chú admin:</strong> {{ deposit.admin_note }}
                    </small>
                    <div v-if="deposit.processed_at_formatted" class="mt-1">
                      <small class="text-muted">
                        <i class="fas fa-clock me-1"></i>
                        Xử lý lúc: {{ deposit.processed_at_formatted }}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Pagination -->
        <div v-if="pagination.total_pages > 1" class="mt-4">
          <nav aria-label="Deposit history pagination">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
                <button
                  class="page-link"
                  @click="goToPage(pagination.current_page - 1)"
                  :disabled="pagination.current_page === 1"
                >
                  <i class="fas fa-chevron-left"></i>
                </button>
              </li>
              
              <li
                v-for="page in visiblePages"
                :key="page"
                class="page-item"
                :class="{ active: page === pagination.current_page }"
              >
                <button class="page-link" @click="goToPage(page)">
                  {{ page }}
                </button>
              </li>
              
              <li class="page-item" :class="{ disabled: pagination.current_page === pagination.total_pages }">
                <button
                  class="page-link"
                  @click="goToPage(pagination.current_page + 1)"
                  :disabled="pagination.current_page === pagination.total_pages"
                >
                  <i class="fas fa-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
          
          <div class="text-center text-muted small">
            Trang {{ pagination.current_page }} / {{ pagination.total_pages }} 
            ({{ pagination.total }} yêu cầu)
          </div>
        </div>
      </div>
    </div>
    
    <!-- Deposit Details Modal -->
    <DepositDetailsModal
      v-if="selectedDeposit"
      :deposit="selectedDeposit"
      :show="showDetailsModal"
      @close="closeDetailsModal"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useDepositStore } from '@/stores/depositStore';
import { useToast } from 'vue-toastification';
import DepositDetailsModal from './DepositDetailsModal.vue';

export default {
  name: 'DepositHistory',
  components: {
    DepositDetailsModal
  },
  
  setup() {
    const depositStore = useDepositStore();
    const toast = useToast();
    
    // State
    const selectedDeposit = ref(null);
    const showDetailsModal = ref(false);
    
    // Computed
    const loading = computed(() => depositStore.loading);
    const deposits = computed(() => depositStore.userDeposits);
    const pagination = computed(() => depositStore.userDepositsPagination);
    
    const formattedDeposits = computed(() => {
      return deposits.value.map(deposit => depositStore.formatDepositForDisplay(deposit));
    });
    
    const visiblePages = computed(() => {
      const current = pagination.value.current_page;
      const total = pagination.value.total_pages;
      const pages = [];
      
      // Show max 5 pages
      let start = Math.max(1, current - 2);
      let end = Math.min(total, start + 4);
      
      // Adjust start if we're near the end
      if (end - start < 4) {
        start = Math.max(1, end - 4);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      return pages;
    });
    
    // Methods
    const loadHistory = async (page = 1) => {
      try {
        await depositStore.fetchUserDeposits({ page, limit: 10 });
      } catch (error) {
        toast.error('Không thể tải lịch sử nạp tiền');
      }
    };
    
    const refreshHistory = async () => {
      await loadHistory(1);
      toast.success('Đã làm mới lịch sử nạp tiền');
    };
    
    const goToPage = async (page) => {
      if (page < 1 || page > pagination.value.total_pages) return;
      await loadHistory(page);
    };
    
    const showDepositDetails = (deposit) => {
      selectedDeposit.value = deposit;
      showDetailsModal.value = true;
    };
    
    const closeDetailsModal = () => {
      showDetailsModal.value = false;
      selectedDeposit.value = null;
    };
    
    const getAdminNoteClass = (status) => {
      const classes = {
        approved: 'alert-success',
        rejected: 'alert-danger',
        pending: 'alert-warning'
      };
      return classes[status] || 'alert-info';
    };
    
    // Lifecycle
    onMounted(() => {
      loadHistory();
    });
    
    return {
      loading,
      deposits,
      pagination,
      formattedDeposits,
      visiblePages,
      selectedDeposit,
      showDetailsModal,
      loadHistory,
      refreshHistory,
      goToPage,
      showDepositDetails,
      closeDetailsModal,
      getAdminNoteClass
    };
  }
};
</script>

<style scoped>
.deposit-history {
  max-width: 800px;
  margin: 0 auto;
}

.deposit-item {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  transition: background-color 0.2s ease;
}

.deposit-item:hover {
  background-color: #f8f9fa;
}

.deposit-item:last-child {
  border-bottom: none;
}

.badge {
  font-size: 0.75em;
  padding: 0.375rem 0.75rem;
}

.badge-warning {
  background-color: #ffc107;
  color: #212529;
}

.badge-success {
  background-color: #198754;
  color: white;
}

.badge-danger {
  background-color: #dc3545;
  color: white;
}

.badge-secondary {
  background-color: #6c757d;
  color: white;
}

.alert-sm {
  padding: 0.5rem 0.75rem;
  margin-bottom: 0;
  font-size: 0.875rem;
}

.alert-success {
  background-color: #d1edff;
  border-color: #b8daff;
  color: #004085;
}

.alert-danger {
  background-color: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
}

.alert-warning {
  background-color: #fff3cd;
  border-color: #ffecb5;
  color: #856404;
}

.alert-info {
  background-color: #d1ecf1;
  border-color: #bee5eb;
  color: #0c5460;
}

.page-link {
  color: #007bff;
  border-color: #dee2e6;
}

.page-link:hover {
  color: #0056b3;
  background-color: #e9ecef;
  border-color: #dee2e6;
}

.page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
  color: white;
}

.page-item.disabled .page-link {
  color: #6c757d;
  background-color: white;
  border-color: #dee2e6;
}

.btn-outline-primary {
  color: #007bff;
  border-color: #007bff;
}

.btn-outline-primary:hover {
  color: white;
  background-color: #007bff;
  border-color: #007bff;
}

.btn-outline-info {
  color: #17a2b8;
  border-color: #17a2b8;
}

.btn-outline-info:hover {
  color: white;
  background-color: #17a2b8;
  border-color: #17a2b8;
}

.fa-spin {
  animation: fa-spin 2s infinite linear;
}

@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>