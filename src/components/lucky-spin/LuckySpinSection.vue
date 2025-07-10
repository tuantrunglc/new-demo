<template>
  <section class="lucky-spin-section py-5">
    <div class="container">
      <div class="text-center mb-5">
        <h2 class="display-5 fw-bold">Thử Vận May!</h2>
        <p class="lead">Quay vòng quay và nhận những phần quà hấp dẫn</p>
      </div>
      
      <div class="row">
        <div class="col-md-6 mb-4 mb-md-0">
          <div class="d-flex flex-column align-items-center">
            <lucky-wheel ref="wheel" @spin-complete="onSpinComplete" />
            <button 
              class="spin-button mt-4" 
              @click="spinWheel" 
              :disabled="isSpinning">
              {{ isSpinning ? 'Đang quay...' : 'Quay Ngay' }}
            </button>
          </div>
        </div>
        
        <div class="col-md-6">
          <spin-history ref="history" />
        </div>
      </div>
    </div>
    
    <reward-popup 
      :show="showReward" 
      :reward="selectedReward" 
      @close="closeReward" 
    />
  </section>
</template>

<script>
import LuckyWheel from './LuckyWheel.vue';
import SpinHistory from './SpinHistory.vue';
import RewardPopup from './RewardPopup.vue';

export default {
  name: 'LuckySpinSection',
  components: {
    LuckyWheel,
    SpinHistory,
    RewardPopup
  },
  data() {
    return {
      isSpinning: false,
      showReward: false,
      selectedReward: null
    }
  },
  methods: {
    spinWheel() {
      if (this.isSpinning) return;
      
      this.isSpinning = true;
      this.$refs.wheel.spinWheel();
    },
    
    onSpinComplete(reward) {
      console.log('Spin complete!', reward);
      this.selectedReward = reward;
      this.showReward = true;
      this.isSpinning = false;
    },
    
    closeReward() {
      this.showReward = false;
      if (this.selectedReward && this.$refs.history) {
        this.$refs.history.addToHistory(this.selectedReward);
      }
    }
  }
}
</script>

<style scoped>
/* Styles are in the global CSS */
</style>