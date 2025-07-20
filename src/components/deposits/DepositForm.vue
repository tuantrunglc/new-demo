<template>
  <div class="deposit-form">
    <div class="card">
      <div class="card-header">
        <h5 class="card-title mb-0">
          <i class="fas fa-plus-circle me-2"></i>
          Tạo yêu cầu nạp tiền
        </h5>
      </div>
      
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <!-- Amount Input -->
          <div class="mb-3">
            <label for="amount" class="form-label">
              Số tiền nạp <span class="text-danger">*</span>
            </label>
            <div class="input-group">
              <input
                id="amount"
                v-model="form.amount"
                type="number"
                class="form-control"
                :class="{ 'is-invalid': errors.amount }"
                placeholder="Nhập số tiền"
                min="10000"
                max="100000000"
                step="1000"
                required
              >
              <span class="input-group-text">VNĐ</span>
            </div>
            <div v-if="errors.amount" class="invalid-feedback">
              {{ errors.amount[0] }}
            </div>
            <div class="form-text">
              Số tiền tối thiểu: 10,000 VNĐ - Tối đa: 100,000,000 VNĐ
            </div>
          </div>

          <!-- Bank Account Input -->
          <div class="mb-3">
            <label for="bankAccount" class="form-label">
              Số tài khoản đã chuyển <span class="text-danger">*</span>
            </label>
            <input
              id="bankAccount"
              v-model="form.bank_account"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.bank_account }"
              placeholder="Nhập số tài khoản ngân hàng"
              maxlength="50"
              required
            >
            <div v-if="errors.bank_account" class="invalid-feedback">
              {{ errors.bank_account[0] }}
            </div>
          </div>

          <!-- Description Input -->
          <div class="mb-3">
            <label for="description" class="form-label">Ghi chú</label>
            <textarea
              id="description"
              v-model="form.description"
              class="form-control"
              :class="{ 'is-invalid': errors.description }"
              rows="3"
              placeholder="Nhập ghi chú (tùy chọn)"
              maxlength="500"
            ></textarea>
            <div v-if="errors.description" class="invalid-feedback">
              {{ errors.description[0] }}
            </div>
            <div class="form-text">
              {{ form.description?.length || 0 }}/500 ký tự
            </div>
          </div>

          <!-- Proof Image Upload -->
          <div class="mb-3">
            <label for="proofImage" class="form-label">
              Hình ảnh chứng minh <span class="text-danger">*</span>
            </label>
            <input
              id="proofImage"
              ref="fileInput"
              type="file"
              class="form-control"
              :class="{ 'is-invalid': errors.proof_image }"
              accept="image/jpeg,image/jpg,image/png,image/gif"
              @change="handleFileChange"
              required
            >
            <div v-if="errors.proof_image" class="invalid-feedback">
              {{ errors.proof_image[0] }}
            </div>
            <div class="form-text">
              Chấp nhận file: JPG, PNG, GIF. Kích thước tối đa: 5MB
            </div>
            
            <!-- Image Preview -->
            <div v-if="imagePreview" class="mt-3">
              <div class="image-preview">
                <img :src="imagePreview" alt="Preview" class="img-thumbnail" style="max-width: 300px; max-height: 200px;">
                <button
                  type="button"
                  class="btn btn-sm btn-outline-danger mt-2"
                  @click="removeImage"
                >
                  <i class="fas fa-times me-1"></i>
                  Xóa ảnh
                </button>
              </div>
            </div>
          </div>

          <!-- Bank Information -->
          <div class="alert alert-info mb-3">
            <h6 class="alert-heading">
              <i class="fas fa-info-circle me-2"></i>
              Thông tin chuyển khoản
            </h6>
            <p class="mb-2">
              <strong>Ngân hàng:</strong> Vietcombank<br>
              <strong>Số tài khoản:</strong> 1234567890<br>
              <strong>Chủ tài khoản:</strong> CÔNG TY TNHH ABC<br>
              <strong>Nội dung:</strong> NAP TIEN [SỐ ĐIỆN THOẠI]
            </p>
            <small class="text-muted">
              Vui lòng chuyển khoản đúng số tiền và nội dung để được xử lý nhanh chóng.
            </small>
          </div>

          <!-- Submit Button -->
          <div class="d-grid gap-2">
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="loading || !isFormValid"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
              <i v-else class="fas fa-paper-plane me-2"></i>
              {{ loading ? 'Đang xử lý...' : 'Gửi yêu cầu nạp tiền' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive } from 'vue';
import { useDepositStore } from '@/stores/depositStore';
import { depositService } from '@/services/depositService';
import { useToast } from 'vue-toastification';

export default {
  name: 'DepositForm',
  emits: ['success', 'error'],
  
  setup(props, { emit }) {
    const depositStore = useDepositStore();
    const toast = useToast();
    
    // Form data
    const form = reactive({
      amount: '',
      bank_account: '',
      description: '',
      proof_image: ''
    });
    
    // Form state
    const loading = ref(false);
    const errors = ref({});
    const imagePreview = ref('');
    const fileInput = ref(null);
    
    // Computed
    const isFormValid = computed(() => {
      return form.amount && 
             form.bank_account && 
             form.proof_image &&
             form.amount >= 10000 &&
             form.amount <= 100000000;
    });
    
    // Methods
    const handleFileChange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      try {
        // Convert to base64
        const base64 = await depositService.convertImageToBase64(file);
        form.proof_image = base64;
        imagePreview.value = base64;
        
        // Clear any previous errors
        if (errors.value.proof_image) {
          delete errors.value.proof_image;
        }
      } catch (error) {
        toast.error(error.message);
        // Clear the file input
        if (fileInput.value) {
          fileInput.value.value = '';
        }
      }
    };
    
    const removeImage = () => {
      form.proof_image = '';
      imagePreview.value = '';
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    };
    
    const resetForm = () => {
      Object.keys(form).forEach(key => {
        form[key] = '';
      });
      errors.value = {};
      imagePreview.value = '';
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    };
    
    const handleSubmit = async () => {
      if (!isFormValid.value) return;
      
      loading.value = true;
      errors.value = {};
      
      try {
        const response = await depositStore.createDeposit({
          amount: parseFloat(form.amount),
          bank_account: form.bank_account,
          description: form.description || null,
          proof_image: form.proof_image
        });
        
        if (response.success) {
          toast.success('Yêu cầu nạp tiền đã được tạo thành công!');
          emit('success', response.data);
          resetForm();
        }
      } catch (error) {
        console.error('Create deposit error:', error);
        
        if (error.errors) {
          errors.value = error.errors;
        }
        
        toast.error(error.message || 'Có lỗi xảy ra khi tạo yêu cầu nạp tiền');
        emit('error', error);
      } finally {
        loading.value = false;
      }
    };
    
    return {
      form,
      loading,
      errors,
      imagePreview,
      fileInput,
      isFormValid,
      handleFileChange,
      removeImage,
      resetForm,
      handleSubmit
    };
  }
};
</script>

<style scoped>
.deposit-form {
  max-width: 600px;
  margin: 0 auto;
}

.image-preview {
  text-align: center;
}

.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}

.form-control:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}

.alert-info {
  background-color: #d1ecf1;
  border-color: #bee5eb;
  color: #0c5460;
}

.text-danger {
  color: #dc3545 !important;
}

.text-muted {
  color: #6c757d !important;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}
</style>