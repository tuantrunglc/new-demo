<template>
  <div class="admin-deposit-management">
    <!-- Statistics Cards -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card bg-warning text-dark">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h6 class="card-title">Đang chờ</h6>
                <h4 class="mb-0">{{ statistics.pending_count }}</h4>
              </div>
              <div class="align-self-center">
                <i class="fas fa-clock fa-2x"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-3">
        <div class="card bg-success text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h6 class="card-title">Đã duyệt</h6>
                <h4 class="mb-0">{{ statistics.approved_count }}</h4>
              </div>
              <div class="align-self-center">
                <i class="fas fa-check-circle fa-2x"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-3">
        <div class="card bg-danger text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h6 class="card-title">Từ chối</h6>
                <h4 class="mb-0">{{ statistics.rejected_count }}</h4>
              </div>
              <div class="align-self-center">
                <i class="fas fa-times-circle fa-2x"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-3">
        <div class="card bg-info text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h6 class="card-title">Hôm nay</h6>
                <h4 class="mb-0">{{ statistics.today_total_formatted }}</h4>
              </div>
              <div class="align-self-center">
                <i class="fas fa-calendar-day fa-2x"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Filters -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label">Trạng thái</label>
            <select
              v-model="filters.status"
              class="form-select"
              @change="applyFilters"
            >
              <option value="all">Tất cả</option>
              <option value="pending">Đang chờ</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>
          
          <div class="col-md-3">
            <label class="form-label">Tìm kiếm</label>
            <input
              v-model="filters.search"
              type="text"
              class="form-control"
              placeholder="Mã, tên, email..."
              @input="debounceSearch"
            >
          </div>
          
          <div class="col-md-3">
            <label class="form-label">Từ ngày</label>
            <input
              v-model="filters.from_date"
              type="date"
              class="form-control"
              @change="applyFilters"
            >
          </div>
          
          <div class="col-md-3">
            <label class="form-label">Đến ngày</label>
            <input
              v-model="filters.to_date"
              type="date"
              class="form-control"
              @change="applyFilters"
            >
          </div>
        </div>
        
        <div class="row mt-3">
          <div class="col-12">
            <button
              class="btn btn-outline-secondary me-2"
              @click="resetFilters"
            >
              <i class="fas fa-undo me-1"></i>
              Đặt lại
            </button>
            <button
              class="btn btn-primary"
              @click="refreshDeposits"
              :disabled="loading"
            >
              <i class="fas fa-sync-alt me-1" :class="{ 'fa-spin': loading }"></i>
              Làm mới
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Deposits Table -->
    <div class="card">
      <div class="card-header">
        <h5 class="card-title mb-0">
          <i class="fas fa-list me-2"></i>
          Danh sách yêu cầu nạp tiền
        </h5>
      </div>
      
      <div class="card-body p-0">
        <!-- Loading State -->
        <div v-if="loading && deposits.length === 0" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
          <p class="mt-2 text-muted">Đang tải danh sách...</p>
        </div>
        
        <!-- Empty State -->
        <div v-else-if="!loading && deposits.length === 0" class="text-center py-5">
          <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
          <h6 class="text-muted">Không có yêu cầu nạp tiền</h6>
          <p class="text-muted">Không tìm thấy yêu cầu nào phù hợp với bộ lọc.</p>
        </div>
        
        <!-- Deposits Table -->
        <div v-else class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>Người dùng</th>
                <th>Số tiền</th>
                <th>Trạng thái</th>
                <th>Thời gian</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="deposit in formattedDeposits"
                :key="deposit.reference_code"
              >
                <td>
                  <div class="d-flex align-items-center">
                    <img
                      :src="deposit.user?.avatar || '/default-avatar.png'"
                      :alt="deposit.user?.name"
                      class="rounded-circle me-2"
                      width="32"
                      height="32"
                    >
                    <div>
                      <div class="fw-semibold">{{ deposit.user?.name }}</div>
                      <small class="text-muted">{{ deposit.user?.email }}</small>
                    </div>
                  </div>
                </td>
                
                <td>
                  <div class="fw-bold text-primary">{{ deposit.amount_formatted }}</div>
                  <small class="text-muted">{{ deposit.reference_code }}</small>
                </td>
                
                <td>
                  <span class="badge" :class="deposit.status_class">
                    {{ deposit.status_text }}
                  </span>
                </td>
                
                <td>
                  <div>{{ deposit.created_at_formatted }}</div>
                  <small v-if="deposit.processed_at_formatted" class="text-muted">
                    Xử lý: {{ deposit.processed_at_formatted }}
                  </small>
                </td>
                
                <td>
                  <div class="btn-group" role="group">
                    <button
                      class="btn btn-sm btn-outline-info"
                      @click="viewDeposit(deposit)"
                      title="Xem chi tiết"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    
                    <button
                      v-if="deposit.status === 'pending'"
                      class="btn btn-sm btn-outline-success"
                      @click="approveDeposit(deposit)"
                      title="Duyệt"
                    >
                      <i class="fas fa-check"></i>
                    </button>
                    
                    <button
                      v-if="deposit.status === 'pending'"
                      class="btn btn-sm btn-outline-danger"
                      @click="rejectDeposit(deposit)"
                      title="Từ chối"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div v-if="pagination.total_pages > 1" class="p-3 border-top">
          <nav aria-label="Deposits pagination">
            <ul class="pagination justify-content-center mb-0">
              <li class="page-item" :class="{ disabled: !pagination.has_prev }">
                <button
                  class="page-link"
                  @click="goToPage(pagination.current_page - 1)"
                  :disabled="!pagination.has_prev"
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
              
              <li class="page-item" :class="{ disabled: !pagination.has_next }">
                <button
                  class="page-link"
                  @click="goToPage(pagination.current_page + 1)"
                  :disabled="!pagination.has_next"
                >
                  <i class="fas fa-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
          
          <div class="text-center text-muted small mt-2">
            Trang {{ pagination.current_page }} / {{ pagination.total_pages }} 
            ({{ pagination.total }} yêu cầu)
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modals -->
    <DepositDetailsModal
      v-if="selectedDeposit"
      :deposit="selectedDeposit"
      :show="showDetailsModal"
      @close="closeDetailsModal"
    />
    
    <DepositActionModal
      v-if="actionDeposit"
      :deposit="actionDeposit"
      :action="currentAction"
      :show="showActionModal"
      @close="closeActionModal"
      @confirm="handleDepositAction"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useDepositStore } from '@/stores/depositStore';
import { useToast } from 'vue-toastification';
import DepositDetailsModal from './DepositDetailsModal.vue';
import DepositActionModal from './DepositActionModal.vue';

export default {
  name: 'AdminDepositManagement',
  components: {
    DepositDetailsModal,
    DepositActionModal
  },
  
  setup() {
    const depositStore = useDepositStore();
    const toast = useToast();
    
    // State
    const selectedDeposit = ref(null);
    const showDetailsModal = ref(false);
    const actionDeposit = ref(null);
    const showActionModal = ref(false);
    const currentAction = ref('');
    const searchTimeout = ref(null);
    
    // Reactive filters
    const filters = ref({
      status: 'all',
      search: '',
      from_date: '',
      to_date: ''
    });
    
    // Computed
    const loading = computed(() => depositStore.loading);
    const deposits = computed(() => depositStore.allDeposits);
    const pagination = computed(() => depositStore.allDepositsPagination);
    const statistics = computed(() => depositStore.formattedStatistics);
    
    const formattedDeposits = computed(() => {
      return deposits.value.map(deposit => depositStore.formatDepositForDisplay(deposit));
    });
    
    const visiblePages = computed(() => {
      const current = pagination.value.current_page;
      const total = pagination.value.total_pages;
      const pages = [];
      
      let start = Math.max(1, current - 2);
      let end = Math.min(total, start + 4);
      
      if (end - start < 4) {
        start = Math.max(1, end - 4);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      return pages;
    });
    
    // Methods
    const loadDeposits = async (params = {}) => {
      try {
        await depositStore.fetchAllDeposits(params);
      } catch (error) {
        toast.error('Không thể tải danh sách yêu cầu nạp tiền');
      }
    };
    
    const applyFilters = () => {
      depositStore.updateFilters({ ...filters.value, page: 1 });
      loadDeposits();
    };
    
    const debounceSearch = () => {
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
      }
      
      searchTimeout.value = setTimeout(() => {
        applyFilters();
      }, 500);
    };
    
    const resetFilters = () => {
      filters.value = {
        status: 'all',
        search: '',
        from_date: '',
        to_date: ''
      };
      depositStore.resetFilters();
      loadDeposits();
    };
    
    const refreshDeposits = async () => {
      await loadDeposits();
      toast.success('Đã làm mới danh sách');
    };
    
    const goToPage = async (page) => {
      if (page < 1 || page > pagination.value.total_pages) return;
      await depositStore.goToPage(page);
    };
    
    const viewDeposit = (deposit) => {
      selectedDeposit.value = deposit;
      showDetailsModal.value = true;
    };
    
    const closeDetailsModal = () => {
      showDetailsModal.value = false;
      selectedDeposit.value = null;
    };
    
    const approveDeposit = (deposit) => {
      actionDeposit.value = deposit;
      currentAction.value = 'approve';
      showActionModal.value = true;
    };
    
    const rejectDeposit = (deposit) => {
      actionDeposit.value = deposit;
      currentAction.value = 'reject';
      showActionModal.value = true;
    };
    
    const closeActionModal = () => {
      showActionModal.value = false;
      actionDeposit.value = null;
      currentAction.value = '';
    };
    
    const handleDepositAction = async (data) => {
      try {
        if (currentAction.value === 'approve') {
          await depositStore.approveDeposit(actionDeposit.value.reference_code, data.note);
          toast.success('Đã duyệt yêu cầu nạp tiền');
        } else if (currentAction.value === 'reject') {
          await depositStore.rejectDeposit(actionDeposit.value.reference_code, data.note);
          toast.success('Đã từ chối yêu cầu nạp tiền');
        }
        
        closeActionModal();
      } catch (error) {
        toast.error(error.message || 'Có lỗi xảy ra khi xử lý yêu cầu');
      }
    };
    
    // Watchers
    watch(
      () => depositStore.filters,
      (newFilters) => {
        filters.value = { ...newFilters };
      },
      { deep: true }
    );
    
    // Lifecycle
    onMounted(() => {
      loadDeposits();
    });
    
    return {
      loading,
      deposits,
      pagination,
      statistics,
      formattedDeposits,
      visiblePages,
      filters,
      selectedDeposit,
      showDetailsModal,
      actionDeposit,
      showActionModal,
      currentAction,
      loadDeposits,
      applyFilters,
      debounceSearch,
      resetFilters,
      refreshDeposits,
      goToPage,
      viewDeposit,
      closeDetailsModal,
      approveDeposit,
      rejectDeposit,
      closeActionModal,
      handleDepositAction
    };
  }
};
</script>

<style scoped>
.admin-deposit-management {
  padding: 1rem;
}

.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.table th {
  font-weight: 600;
  border-bottom: 2px solid #dee2e6;
}

.table td {
  vertical-align: middle;
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

.btn-group .btn {
  border-radius: 0.25rem;
  margin-right: 0.25rem;
}

.btn-group .btn:last-child {
  margin-right: 0;
}

.fw-semibold {
  font-weight: 600;
}

.text-primary {
  color: #007bff !important;
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