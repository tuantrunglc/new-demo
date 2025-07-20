<template>
  <div class="deposit-view">
    <div class="container-fluid py-4">
      <!-- Page Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="h4 mb-1">
                <i class="fas fa-wallet me-2 text-primary"></i>
                Nạp tiền vào ví
              </h2>
              <p class="text-muted mb-0">Quản lý yêu cầu nạp tiền và xem lịch sử giao dịch</p>
            </div>
            
            <!-- Wallet Balance -->
            <div class="text-end">
              <div class="card bg-primary text-white">
                <div class="card-body py-2 px-3">
                  <div class="d-flex align-items-center">
                    <i class="fas fa-coins me-2"></i>
                    <div>
                      <small>Số dư ví</small>
                      <div class="fw-bold">{{ formatCurrency(walletBalance) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tabs -->
      <div class="row">
        <div class="col-12">
          <ul class="nav nav-tabs mb-4" id="depositTabs" role="tablist">
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                :class="{ active: activeTab === 'create' }"
                @click="activeTab = 'create'"
                type="button"
              >
                <i class="fas fa-plus-circle me-2"></i>
                Tạo yêu cầu nạp tiền
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                :class="{ active: activeTab === 'history' }"
                @click="activeTab = 'history'"
                type="button"
              >
                <i class="fas fa-history me-2"></i>
                Lịch sử nạp tiền
                <span v-if="pendingCount > 0" class="badge bg-warning text-dark ms-1">
                  {{ pendingCount }}
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Create Deposit Tab -->
        <div
          v-show="activeTab === 'create'"
          class="tab-pane fade"
          :class="{ 'show active': activeTab === 'create' }"
        >
          <div class="row justify-content-center">
            <div class="col-lg-8">
              <DepositForm
                @success="handleDepositSuccess"
                @error="handleDepositError"
              />
            </div>
          </div>
        </div>
        
        <!-- History Tab -->
        <div
          v-show="activeTab === 'history'"
          class="tab-pane fade"
          :class="{ 'show active': activeTab === 'history' }"
        >
          <div class="row justify-content-center">
            <div class="col-lg-10">
              <DepositHistory ref="depositHistory" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useDepositStore } from '@/stores/depositStore';
import { depositService } from '@/services/depositService';
import { useToast } from 'vue-toastification';
import DepositForm from '@/components/deposits/DepositForm.vue';
import DepositHistory from '@/components/deposits/DepositHistory.vue';

export default {
  name: 'DepositView',
  components: {
    DepositForm,
    DepositHistory
  },
  
  setup() {
    const userStore = useUserStore();
    const depositStore = useDepositStore();
    const toast = useToast();
    
    // State
    const activeTab = ref('create');
    const depositHistory = ref(null);
    
    // Computed
    const walletBalance = computed(() => {
      return userStore.currentUser?.wallet_balance || 0;
    });
    
    const pendingCount = computed(() => {
      return depositStore.userDeposits.filter(d => d.status === 'pending').length;
    });
    
    // Methods
    const formatCurrency = (amount) => {
      return depositService.formatCurrency(amount);
    };
    
    const handleDepositSuccess = (deposit) => {
      toast.success(`Yêu cầu nạp tiền ${formatCurrency(deposit.amount)} đã được tạo thành công!`);
      
      // Switch to history tab
      activeTab.value = 'history';
      
      // Refresh history if component is available
      if (depositHistory.value) {
        depositHistory.value.refreshHistory();
      }
    };
    
    const handleDepositError = (error) => {
      console.error('Deposit error:', error);
    };
    
    const loadUserData = async () => {
      try {
        // Load user profile to get wallet balance
        await userStore.fetchProfile();
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };
    
    // Lifecycle
    onMounted(() => {
      loadUserData();
      
      // Set active tab from query params
      const urlParams = new URLSearchParams(window.location.search);
      const tab = urlParams.get('tab');
      if (tab && ['create', 'history'].includes(tab)) {
        activeTab.value = tab;
      }
    });
    
    return {
      activeTab,
      depositHistory,
      walletBalance,
      pendingCount,
      formatCurrency,
      handleDepositSuccess,
      handleDepositError
    };
  }
};
</script>

<style scoped>
.deposit-view {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.nav-tabs {
  border-bottom: 2px solid #dee2e6;
}

.nav-tabs .nav-link {
  border: none;
  border-bottom: 3px solid transparent;
  background: none;
  color: #6c757d;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  transition: all 0.2s ease;
}

.nav-tabs .nav-link:hover {
  border-color: transparent;
  color: #007bff;
  background-color: rgba(0, 123, 255, 0.1);
}

.nav-tabs .nav-link.active {
  color: #007bff;
  border-bottom-color: #007bff;
  background-color: transparent;
}

.card.bg-primary {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  border: none;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 123, 255, 0.3);
}

.badge.bg-warning {
  background-color: #ffc107 !important;
}

.text-primary {
  color: #007bff !important;
}

.container-fluid {
  max-width: 1200px;
}

@media (max-width: 768px) {
  .deposit-view .container-fluid {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .nav-tabs .nav-link {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
  
  .card.bg-primary .card-body {
    padding: 0.75rem;
  }
}
</style>