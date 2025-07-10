<template>
  <div class="spin-history">
    <h4 class="mb-3">Lịch Sử Quay Thưởng</h4>
    <div v-if="history.length === 0" class="text-center py-3">
      Chưa có lịch sử quay thưởng. Hãy thử vận may của bạn!
    </div>
    <div v-else>
      <div v-for="item in history" :key="item.id" class="spin-history-item d-flex justify-content-between align-items-center">
        <div>
          <div class="fw-bold">{{ item.reward }}</div>
          <div class="small">{{ formatDate(item.date) }}</div>
        </div>
        <div>
          <span v-if="item.used" class="badge bg-secondary">Đã dùng</span>
          <span v-else class="badge bg-success">Khả dụng</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { spinHistory } from '../../data/lucky-spin';

export default {
  name: 'SpinHistory',
  data() {
    return {
      history: spinHistory
    }
  },
  methods: {
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    addToHistory(reward) {
      if (!reward) return;
      
      console.log('Adding to history:', reward);
      
      const newHistoryItem = {
        id: Date.now(), // Use timestamp as unique ID
        date: new Date().toISOString().split('T')[0],
        reward: reward.name,
        used: false
      };
      
      // Add to beginning of array
      this.history.unshift(newHistoryItem);
      
      // Keep only the last 5 items
      if (this.history.length > 5) {
        this.history = this.history.slice(0, 5);
      }
    }
  }
}
</script>

<style scoped>
/* Styles are in the global CSS */
</style>