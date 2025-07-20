<template>
  <div
    v-if="show"
    class="modal fade show"
    style="display: block;"
    tabindex="-1"
    @click.self="$emit('close')"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i :class="actionIcon" class="me-2"></i>
            {{ actionTitle }}
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
          ></button>
        </div>
        
        <div class="modal-body">
          <div v-if="deposit" class="deposit-summary mb-4">
            <div class="alert" :class="actionAlertClass">
              <h6 class="alert-heading mb-3">Thông tin yêu cầu</h6>
              
              <div class="row">
                <div class="col-6">
                  <strong>Người dùng:</strong><br>
                  {{ deposit.user?.name }}<br>
                  <small class="text-muted">{{ deposit.user?.email }}</small>
                </div>
                <div class="col-6">
                  <strong>Số tiền:</strong><br>
                  <span class="fs-5 fw-bold text-primary">
                    {{ deposit.amount_formatted }}
                  </span>
                </div>
              </div>
              
              <div class="row mt-3">
                <div class="col-6">
                  <strong>Mã tham chiếu:</strong><br>
                  <code>{{ deposit.reference_code }}</code>
                </div>
                <div class="col-6">
                  <strong>Thời gian tạo:</strong><br>
                  {{ deposit.created_at_formatted }}
                </div>
              </div>
              
              <div v-if="deposit.description" class="mt-3">
                <strong>Ghi chú:</strong><br>
                {{ deposit.description }}
              </div>
            </div>
          </div>
          
          <!-- Proof Image -->
          <div class="mb-4">
            <label class="form-label fw-bold">Hình ảnh chứng minh:</label>
            <div class="proof-image-container">
              <img
                :src="deposit?.proof_image"
                :alt="`Proof for ${deposit?.reference_code}`"
                class="img-thumbnail proof-image"
                @click="showImageModal = true"
              >
              <div class="image-overlay">
                <button
                  type="button"
                  class="btn btn-light btn-sm"
                  @click="showImageModal = true"
                >
                  <i class="fas fa-search-plus me-1"></i>
                  Xem lớn
                </button>
              </div>
            </div>
          </div>
          
          <!-- Admin Note -->
          <div class="mb-3">
            <label for="adminNote" class="form-label fw-bold">
              Ghi chú admin <span class="text-muted">(tùy chọn)</span>
            </label>
            <textarea
              id="adminNote"
              v-model="adminNote"
              class="form-control"
              rows="3"
              :placeholder="notePlaceholder"
              maxlength="500"
            ></textarea>
            <div class="form-text">
              {{ adminNote.length }}/500 ký tự
            </div>
          </div>
          
          <!-- Confirmation -->
          <div class="alert" :class="confirmationAlertClass">
            <div class="d-flex align-items-center">
              <i :class="actionIcon" class="me-2"></i>
              <div>
                <strong>{{ confirmationText }}</strong>
                <div class="small">{{ confirmationSubtext }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="$emit('close')"
          >
            <i class="fas fa-times me-1"></i>
            Hủy
          </button>
          
          <button
            type="button"
            class="btn"
            :class="actionButtonClass"
            @click="handleConfirm"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
            <i v-else :class="actionIcon" class="me-1"></i>
            {{ loading ? 'Đang xử lý...' : actionButtonText }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Backdrop -->
    <div class="modal-backdrop fade show"></div>
  </div>
  
  <!-- Image Modal -->
  <div
    v-if="showImageModal"
    class="modal fade show"
    style="display: block;"
    tabindex="-1"
    @click.self="showImageModal = false"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Hình ảnh chứng minh</h5>
          <button
            type="button"
            class="btn-close"
            @click="showImageModal = false"
          ></button>
        </div>
        <div class="modal-body text-center">
          <img
            :src="deposit?.proof_image"
            :alt="`Proof for ${deposit?.reference_code}`"
            class="img-fluid"
            style="max-height: 70vh;"
          >
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="showImageModal = false"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'DepositActionModal',
  props: {
    deposit: {
      type: Object,
      required: true
    },
    action: {
      type: String,
      required: true,
      validator: (value) => ['approve', 'reject'].includes(value)
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'confirm'],
  
  setup(props, { emit }) {
    // State
    const adminNote = ref('');
    const loading = ref(false);
    const showImageModal = ref(false);
    
    // Computed
    const isApprove = computed(() => props.action === 'approve');
    
    const actionTitle = computed(() => {
      return isApprove.value ? 'Duyệt yêu cầu nạp tiền' : 'Từ chối yêu cầu nạp tiền';
    });
    
    const actionIcon = computed(() => {
      return isApprove.value ? 'fas fa-check-circle' : 'fas fa-times-circle';
    });
    
    const actionAlertClass = computed(() => {
      return isApprove.value ? 'alert-success' : 'alert-danger';
    });
    
    const confirmationAlertClass = computed(() => {
      return isApprove.value ? 'alert-warning' : 'alert-warning';
    });
    
    const actionButtonClass = computed(() => {
      return isApprove.value ? 'btn-success' : 'btn-danger';
    });
    
    const actionButtonText = computed(() => {
      return isApprove.value ? 'Duyệt yêu cầu' : 'Từ chối yêu cầu';
    });
    
    const notePlaceholder = computed(() => {
      return isApprove.value 
        ? 'Ví dụ: Đã xác nhận chuyển khoản thành công'
        : 'Ví dụ: Không tìm thấy giao dịch chuyển khoản';
    });
    
    const confirmationText = computed(() => {
      return isApprove.value 
        ? 'Bạn có chắc chắn muốn duyệt yêu cầu này?'
        : 'Bạn có chắc chắn muốn từ chối yêu cầu này?';
    });
    
    const confirmationSubtext = computed(() => {
      return isApprove.value 
        ? 'Số tiền sẽ được cộng vào ví của người dùng.'
        : 'Yêu cầu sẽ bị từ chối và không thể hoàn tác.';
    });
    
    // Methods
    const handleConfirm = async () => {
      loading.value = true;
      
      try {
        emit('confirm', {
          action: props.action,
          note: adminNote.value.trim() || (isApprove.value 
            ? 'Đã xác nhận chuyển khoản thành công'
            : 'Không tìm thấy giao dịch chuyển khoản')
        });
      } finally {
        loading.value = false;
      }
    };
    
    return {
      adminNote,
      loading,
      showImageModal,
      isApprove,
      actionTitle,
      actionIcon,
      actionAlertClass,
      confirmationAlertClass,
      actionButtonClass,
      actionButtonText,
      notePlaceholder,
      confirmationText,
      confirmationSubtext,
      handleConfirm
    };
  }
};
</script>

<style scoped>
.modal {
  z-index: 1060;
}

.modal-backdrop {
  z-index: 1050;
}

.deposit-summary {
  border-radius: 0.375rem;
}

.proof-image-container {
  position: relative;
  display: inline-block;
  max-width: 300px;
}

.proof-image {
  max-width: 100%;
  height: auto;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.proof-image:hover {
  opacity: 0.8;
}

.image-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.proof-image-container:hover .image-overlay {
  opacity: 1;
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

.text-primary {
  color: #007bff !important;
}

.fw-bold {
  font-weight: 700 !important;
}

.fs-5 {
  font-size: 1.25rem !important;
}

code {
  background-color: #f8f9fa;
  color: #e83e8c;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  color: #000;
  opacity: 0.5;
}

.btn-close:hover {
  opacity: 0.75;
}
</style>