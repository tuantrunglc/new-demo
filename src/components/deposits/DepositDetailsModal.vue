<template>
  <div
    v-if="show"
    class="modal fade show"
    style="display: block;"
    tabindex="-1"
    @click.self="$emit('close')"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fas fa-receipt me-2"></i>
            Chi tiết yêu cầu nạp tiền
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
          ></button>
        </div>
        
        <div class="modal-body">
          <div v-if="deposit" class="deposit-details">
            <!-- Status Badge -->
            <div class="text-center mb-4">
              <span class="badge fs-6 px-3 py-2" :class="deposit.status_class">
                <i class="fas fa-circle me-2"></i>
                {{ deposit.status_text }}
              </span>
            </div>
            
            <!-- Basic Information -->
            <div class="row mb-4">
              <div class="col-md-6">
                <div class="info-item">
                  <label class="info-label">Mã tham chiếu:</label>
                  <div class="info-value">
                    <code>{{ deposit.reference_code }}</code>
                    <button
                      class="btn btn-sm btn-outline-secondary ms-2"
                      @click="copyToClipboard(deposit.reference_code)"
                      title="Sao chép"
                    >
                      <i class="fas fa-copy"></i>
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="col-md-6">
                <div class="info-item">
                  <label class="info-label">Số tiền:</label>
                  <div class="info-value text-primary fw-bold fs-5">
                    {{ deposit.amount_formatted }}
                  </div>
                </div>
              </div>
            </div>
            
            <div class="row mb-4">
              <div class="col-md-6">
                <div class="info-item">
                  <label class="info-label">Số tài khoản:</label>
                  <div class="info-value">{{ deposit.bank_account }}</div>
                </div>
              </div>
              
              <div class="col-md-6">
                <div class="info-item">
                  <label class="info-label">Thời gian tạo:</label>
                  <div class="info-value">{{ deposit.created_at_formatted }}</div>
                </div>
              </div>
            </div>
            
            <!-- Description -->
            <div v-if="deposit.description" class="mb-4">
              <div class="info-item">
                <label class="info-label">Ghi chú:</label>
                <div class="info-value">{{ deposit.description }}</div>
              </div>
            </div>
            
            <!-- Proof Image -->
            <div class="mb-4">
              <div class="info-item">
                <label class="info-label">Hình ảnh chứng minh:</label>
                <div class="info-value">
                  <div class="proof-image-container">
                    <img
                      :src="deposit.proof_image"
                      :alt="`Proof for ${deposit.reference_code}`"
                      class="proof-image img-thumbnail"
                      @click="showImageModal = true"
                    >
                    <div class="image-overlay">
                      <button
                        class="btn btn-light btn-sm"
                        @click="showImageModal = true"
                      >
                        <i class="fas fa-search-plus me-1"></i>
                        Xem lớn
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Processing Information -->
            <div v-if="deposit.status !== 'pending'" class="processing-info">
              <div class="alert" :class="getProcessingAlertClass(deposit.status)">
                <h6 class="alert-heading">
                  <i class="fas fa-user-shield me-2"></i>
                  Thông tin xử lý
                </h6>
                
                <div class="row">
                  <div class="col-md-6">
                    <div class="info-item">
                      <label class="info-label">Trạng thái:</label>
                      <div class="info-value">{{ deposit.status_text }}</div>
                    </div>
                  </div>
                  
                  <div v-if="deposit.processed_at_formatted" class="col-md-6">
                    <div class="info-item">
                      <label class="info-label">Thời gian xử lý:</label>
                      <div class="info-value">{{ deposit.processed_at_formatted }}</div>
                    </div>
                  </div>
                </div>
                
                <div v-if="deposit.admin_note" class="mt-3">
                  <div class="info-item">
                    <label class="info-label">Ghi chú admin:</label>
                    <div class="info-value">{{ deposit.admin_note }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Pending Status Info -->
            <div v-else class="alert alert-warning">
              <h6 class="alert-heading">
                <i class="fas fa-clock me-2"></i>
                Đang chờ xử lý
              </h6>
              <p class="mb-0">
                Yêu cầu nạp tiền của bạn đang được xem xét. 
                Thời gian xử lý thường từ 5-30 phút trong giờ hành chính.
              </p>
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
            Đóng
          </button>
          
          <button
            v-if="deposit?.proof_image"
            type="button"
            class="btn btn-primary"
            @click="downloadProofImage"
          >
            <i class="fas fa-download me-1"></i>
            Tải ảnh chứng minh
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
          <button
            type="button"
            class="btn btn-primary"
            @click="downloadProofImage"
          >
            <i class="fas fa-download me-1"></i>
            Tải xuống
          </button>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

export default {
  name: 'DepositDetailsModal',
  props: {
    deposit: {
      type: Object,
      required: true
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  
  setup(props) {
    const toast = useToast();
    const showImageModal = ref(false);
    
    // Methods
    const copyToClipboard = async (text) => {
      try {
        await navigator.clipboard.writeText(text);
        toast.success('Đã sao chép mã tham chiếu');
      } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success('Đã sao chép mã tham chiếu');
      }
    };
    
    const downloadProofImage = () => {
      if (!props.deposit?.proof_image) return;
      
      try {
        const link = document.createElement('a');
        link.href = props.deposit.proof_image;
        link.download = `proof_${props.deposit.reference_code}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Đang tải xuống hình ảnh...');
      } catch (error) {
        toast.error('Không thể tải xuống hình ảnh');
      }
    };
    
    const getProcessingAlertClass = (status) => {
      const classes = {
        approved: 'alert-success',
        rejected: 'alert-danger'
      };
      return classes[status] || 'alert-info';
    };
    
    return {
      showImageModal,
      copyToClipboard,
      downloadProofImage,
      getProcessingAlertClass
    };
  }
};
</script>

<style scoped>
.modal {
  z-index: 1050;
}

.modal-backdrop {
  z-index: 1040;
}

.deposit-details {
  font-size: 0.95rem;
}

.info-item {
  margin-bottom: 1rem;
}

.info-label {
  font-weight: 600;
  color: #495057;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  display: block;
}

.info-value {
  color: #212529;
  word-break: break-word;
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

.processing-info {
  border-top: 1px solid #dee2e6;
  padding-top: 1.5rem;
}

.badge {
  font-size: 0.875rem;
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

code {
  background-color: #f8f9fa;
  color: #e83e8c;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
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

.text-primary {
  color: #007bff !important;
}

.fw-bold {
  font-weight: 700 !important;
}

.fs-5 {
  font-size: 1.25rem !important;
}

.fs-6 {
  font-size: 1rem !important;
}
</style>