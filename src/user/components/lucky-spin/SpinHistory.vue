<template>
  <div class="spin-history">
    <h4 class="mb-3">Spin History</h4>
    <div v-if="history.length === 0" class="text-center py-3">
      No spin history yet. Try your luck!
    </div>
    <div v-else>
      <div v-for="(item, index) in history" :key="index" class="spin-history-item d-flex justify-content-between align-items-center">
        <div>
          <div class="fw-bold">{{ item.itemLabel }}</div>
          <div class="small">{{ formatDate(item.date) }}</div>
        </div>
        <div>
          <span class="badge bg-success">Available</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userSpins } from '../../data/lucky-spin';

export default {
  name: 'SpinHistory',
  data() {
    return {
      history: userSpins.length > 0 ? userSpins[0].history : []
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
        date: new Date().toISOString(),
        itemId: reward.id,
        itemLabel: reward.label
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