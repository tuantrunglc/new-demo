<template>
  <div class="deposit-management-view">
    <div class="container-fluid py-4">
      <!-- Page Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="h4 mb-1">
                <i class="fas fa-money-check-alt me-2 text-primary"></i>
                Quản lý nạp tiền
              </h2>
              <p class="text-muted mb-0">Xem và xử lý các yêu cầu nạp tiền từ người dùng</p>
            </div>
            
            <!-- Quick Actions -->
            <div class="d-flex gap-2">
              <button
                class="btn btn-outline-primary"
                @click="refreshData"
                :disabled="loading"
              >
                <i class="fas fa-sync-alt me-1" :class="{ 'fa-spin': loading }"></i>
                Làm mới
              </button>
              
              <div class="dropdown">
                <button
                  class="btn btn-primary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  <i class="fas fa-download me-1"></i>
                  Xuất báo cáo
                </button>
                <ul class="dropdown-menu">
                  <li>
                    <a class="dropdown-item" href="#" @click="exportReport('today')">
                      <i class="fas fa-calendar-day me-2"></i>
                      Báo cáo hôm nay
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="#" @click="exportReport('week')">
                      <i class="fas fa-calendar-week me-2"></i>
                      Báo cáo tuần này
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="#" @click="exportReport('month')">
                      <i class="fas fa-calendar-alt me-2"></i>
                      Báo cáo tháng này
                    </a>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li>
                    <a class="dropdown-item" href="#" @click="exportReport('custom')">
                      <i class="fas fa-calendar-check me-2"></i>
                      Tùy chỉnh thời gian
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Main Content -->
      <div class="row">
        <div class="col-12">
          <AdminDepositManagement />
        </div>
      </div>
    </div>
    
    <!-- Export Modal -->
    <div
      v-if="showExportModal"
      class="modal fade show"
      style="display: block;"
      tabindex="-1"
      @click.self="showExportModal = false"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-download me-2"></i>
              Xuất báo cáo nạp tiền
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="showExportModal = false"
            ></button>
          </div>
          
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Loại báo cáo</label>
              <select v-model="exportType" class="form-select">
                <option value="today">Hôm nay</option>
                <option value="week">Tuần này</option>
                <option value="month">Tháng này</option>
                <option value="custom">Tùy chỉnh</option>
              </select>
            </div>
            
            <div v-if="exportType === 'custom'" class="row">
              <div class="col-6">
                <label class="form-label">Từ ngày</label>
                <input
                  v-model="exportFromDate"
                  type="date"
                  class="form-control"
                >
              </div>
              <div class="col-6">
                <label class="form-label">Đến ngày</label>
                <input
                  v-model="exportToDate"
                  type="date"
                  class="form-control"
                >
              </div>
            </div>
            
            <div class="mb-3">
              <label class="form-label">Định dạng</label>
              <select v-model="exportFormat" class="form-select">
                <option value="excel">Excel (.xlsx)</option>
                <option value="csv">CSV (.csv)</option>
                <option value="pdf">PDF (.pdf)</option>
              </select>
            </div>
            
            <div class="mb-3">
              <div class="form-check">
                <input
                  id="includeImages"
                  v-model="includeImages"
                  class="form-check-input"
                  type="checkbox"
                >
                <label class="form-check-label" for="includeImages">
                  Bao gồm hình ảnh chứng minh
                </label>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showExportModal = false"
            >
              Hủy
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="handleExport"
              :disabled="exportLoading"
            >
              <span v-if="exportLoading" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="fas fa-download me-1"></i>
              {{ exportLoading ? 'Đang xuất...' : 'Xuất báo cáo' }}
            </button>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show"></div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useDepositStore } from '@/stores/depositStore';
import { useToast } from 'vue-toastification';
import AdminDepositManagement from '@/components/deposits/AdminDepositManagement.vue';

export default {
  name: 'DepositManagementView',
  components: {
    AdminDepositManagement
  },
  
  setup() {
    const depositStore = useDepositStore();
    const toast = useToast();
    
    // State
    const showExportModal = ref(false);
    const exportType = ref('today');
    const exportFormat = ref('excel');
    const exportFromDate = ref('');
    const exportToDate = ref('');
    const includeImages = ref(false);
    const exportLoading = ref(false);
    
    // Computed
    const loading = computed(() => depositStore.loading);
    
    // Methods
    const refreshData = async () => {
      try {
        await depositStore.refreshDeposits();
        toast.success('Đã làm mới dữ liệu');
      } catch (error) {
        toast.error('Không thể làm mới dữ liệu');
      }
    };
    
    const exportReport = (type) => {
      exportType.value = type;
      
      // Set default dates based on type
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      switch (type) {
        case 'today':
          exportFromDate.value = today;
          exportToDate.value = today;
          break;
        case 'week': {
          const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
          exportFromDate.value = weekStart.toISOString().split('T')[0];
          exportToDate.value = today;
          break;
        }
        case 'month': {
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          exportFromDate.value = monthStart.toISOString().split('T')[0];
          exportToDate.value = today;
          break;
        }
        case 'custom':
          exportFromDate.value = '';
          exportToDate.value = '';
          break;
      }
      
      showExportModal.value = true;
    };
    
    const handleExport = async () => {
      if (exportType.value === 'custom' && (!exportFromDate.value || !exportToDate.value)) {
        toast.error('Vui lòng chọn khoảng thời gian');
        return;
      }
      
      exportLoading.value = true;
      
      try {
        // Simulate export process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // In real implementation, this would call an API to generate and download the report
        const filename = `deposit_report_${exportFromDate.value}_${exportToDate.value}.${exportFormat.value}`;
        toast.success(`Báo cáo ${filename} đã được tải xuống`);
        
        showExportModal.value = false;
      } catch (error) {
        toast.error('Không thể xuất báo cáo');
      } finally {
        exportLoading.value = false;
      }
    };
    
    return {
      loading,
      showExportModal,
      exportType,
      exportFormat,
      exportFromDate,
      exportToDate,
      includeImages,
      exportLoading,
      refreshData,
      exportReport,
      handleExport
    };
  }
};
</script>

<style scoped>
.deposit-management-view {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.container-fluid {
  max-width: 1400px;
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

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}

.dropdown-menu {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.15);
}

.dropdown-item {
  padding: 0.5rem 1rem;
  transition: background-color 0.15s ease-in-out;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.modal {
  z-index: 1050;
}

.modal-backdrop {
  z-index: 1040;
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

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

@media (max-width: 768px) {
  .deposit-management-view .container-fluid {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .d-flex.gap-2 {
    flex-direction: column;
    gap: 0.5rem !important;
  }
  
  .btn {
    width: 100%;
  }
}
</style>