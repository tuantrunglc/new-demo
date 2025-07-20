<template>
  <transition name="fade">
    <div class="reward-popup" v-if="show && reward">
      <div class="reward-content" :class="{ 'no-prize': reward.name === 'No Prize' }">
        <div class="reward-icon">
          <i :class="reward.icon"></i>
        </div>
        <h2 class="reward-title" v-if="reward.name === 'No Prize'">Sorry!</h2>
        <h2 class="reward-title" v-else>Congratulations!</h2>
        
        <p class="reward-description" v-if="reward.name === 'No Prize'">
          You didn't win this time
        </p>
        <p class="reward-description" v-else>
          You won: {{ reward.name }}
        </p>
        
        <p>{{ reward.description }}</p>
        
        <button class="close-reward" @click="closePopup" v-if="reward.name === 'No Prize'">
          Try Again
        </button>
        <button class="close-reward" @click="closePopup" v-else>
          Claim Reward
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'RewardPopup',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    reward: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    closePopup() {
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
.reward-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.reward-content {
  background: linear-gradient(135deg, #ffcc00, #ff9900);
  border-radius: 10px;
  padding: 30px;
  text-align: center;
  max-width: 400px;
  animation: popup 0.5s;
}

.reward-content.no-prize {
  background: linear-gradient(135deg, #f5f5f5, #e0e0e0);
}

@keyframes popup {
  0% { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.reward-icon {
  font-size: 3rem;
  margin-bottom: 15px;
  color: var(--dark-color);
}

.no-prize .reward-icon {
  color: #888;
}

.reward-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: var(--dark-color);
}

.reward-description {
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: var(--dark-color);
}

.close-reward {
  background-color: var(--dark-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.no-prize .close-reward {
  background-color: #888;
}

.close-reward:hover {
  background-color: #000;
}

.no-prize .close-reward:hover {
  background-color: #666;
}

/* Transition effects */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>