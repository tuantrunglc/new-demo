<template>
  <div class="spin-wheel-container">
    <!-- Pointer at the top -->
    <div class="wheel-pointer"></div>
    
    <!-- Wheel -->
    <div class="spin-wheel" ref="wheel">
      <canvas ref="wheelCanvas" width="300" height="300"></canvas>
    </div>
  </div>
</template>

<script>
import { spinRewards } from '../../data/lucky-spin';

export default {
  name: 'LuckyWheel',
  data() {
    return {
      rewards: spinRewards,
      isSpinning: false,
      selectedReward: null,
      canvas: null,
      ctx: null,
      currentRotation: 0
    }
  },
  mounted() {
    this.canvas = this.$refs.wheelCanvas;
    this.ctx = this.canvas.getContext('2d');
    this.drawWheel();
  },
  methods: {
    drawWheel() {
      const ctx = this.ctx;
      const canvas = this.canvas;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = canvas.width / 2 - 10;
      const rewards = this.rewards;
      const totalRewards = rewards.length;
      const arc = Math.PI * 2 / totalRewards;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw wheel segments
      for (let i = 0; i < totalRewards; i++) {
        const angle = i * arc;
        ctx.beginPath();
        ctx.fillStyle = rewards[i].color;
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, angle, angle + arc);
        ctx.lineTo(centerX, centerY);
        ctx.fill();
        
        // Add border to segments
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
        
        // Draw text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#000';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(rewards[i].name, radius - 20, 5);
        ctx.restore();
      }
      
      // Draw center circle
      ctx.beginPath();
      ctx.fillStyle = '#fff';
      ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#000';
      ctx.stroke();
    },
    
    spinWheel() {
      if (this.isSpinning) return;
      
      this.isSpinning = true;
      
      // Randomly select a reward based on probability
      const random = Math.random();
      let cumulativeProbability = 0;
      let selectedIndex = 0;
      
      for (let i = 0; i < this.rewards.length; i++) {
        cumulativeProbability += this.rewards[i].probability;
        if (random < cumulativeProbability) {
          selectedIndex = i;
          break;
        }
      }
      
      this.selectedReward = this.rewards[selectedIndex];
      
      // Calculate rotation angle
      const totalRewards = this.rewards.length;
      const arc = 360 / totalRewards;
      // Add to current rotation to ensure continuous spinning in the same direction
      this.currentRotation += 1800 + (totalRewards - selectedIndex - 1) * arc;
      
      // Animate the wheel
      const wheel = this.$refs.wheel;
      wheel.style.transform = `rotate(${this.currentRotation}deg)`;
      
      // Emit event when spinning is complete
      setTimeout(() => {
        this.isSpinning = false;
        this.$emit('spin-complete', this.selectedReward);
      }, 5000);
    }
  }
}
</script>

<style scoped>
.spin-wheel-container {
  position: relative;
  width: 300px;
  height: 300px;
  margin: 30px auto;
}

.spin-wheel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  transition: transform 5s cubic-bezier(0.17, 0.67, 0.83, 0.67);
  z-index: 1;
}

.wheel-pointer {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 30px solid var(--primary-color);
  z-index: 2;
}
</style>