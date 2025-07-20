<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
    <!-- Header -->
    <div class="bg-white bg-opacity-10 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <button @click="$router.go(-1)" class="flex items-center text-white hover:text-yellow-300 transition-colors">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Quay lại
          </button>
          <h1 class="text-xl font-bold text-white">🎰 Vòng quay may mắn</h1>
          <div class="w-20"></div>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="text-center text-white mb-12">
        <h1 class="text-4xl md:text-6xl font-bold mb-4">
          🎰 Vòng quay may mắn
        </h1>
        <p class="text-xl md:text-2xl text-gray-200 mb-8">
          Quay để nhận những phần thưởng hấp dẫn!
        </p>
        <div class="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 inline-block">
          <div class="text-sm text-gray-200 mb-2">Số lượt quay còn lại</div>
          <div class="text-3xl font-bold text-yellow-400">{{ remainingSpins }}</div>
        </div>
      </div>

      <!-- Lucky Spin Component -->
      <div class="mb-12">
        <lucky-spin-section />
      </div>

      <!-- Spin History -->
      <div class="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 mb-8">
        <h2 class="text-2xl font-bold text-white mb-6">📜 Lịch sử quay</h2>
        <div class="space-y-4">
          <div 
            v-for="spin in spinHistory" 
            :key="spin.id"
            class="bg-white bg-opacity-20 rounded-lg p-4 flex items-center justify-between"
          >
            <div class="flex items-center space-x-4">
              <div class="text-2xl">{{ spin.reward.icon }}</div>
              <div>
                <div class="text-white font-semibold">{{ spin.reward.name }}</div>
                <div class="text-gray-300 text-sm">{{ formatDateTime(spin.timestamp) }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-yellow-400 font-bold">{{ spin.reward.value }}</div>
              <div class="text-gray-300 text-sm">{{ spin.status }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Rewards Info -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div class="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center">
          <div class="text-3xl mb-4">🎁</div>
          <h3 class="text-white font-semibold mb-2">Phần thưởng đa dạng</h3>
          <p class="text-gray-300 text-sm">Tiền mặt, voucher giảm giá, sản phẩm miễn phí</p>
        </div>
        <div class="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center">
          <div class="text-3xl mb-4">⚡</div>
          <h3 class="text-white font-semibold mb-2">Cơ hội hàng ngày</h3>
          <p class="text-gray-300 text-sm">Nhận lượt quay miễn phí mỗi ngày</p>
        </div>
        <div class="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center">
          <div class="text-3xl mb-4">🏆</div>
          <h3 class="text-white font-semibold mb-2">Giải thưởng lớn</h3>
          <p class="text-gray-300 text-sm">Cơ hội trúng những phần thưởng giá trị cao</p>
        </div>
      </div>

      <!-- How to Play -->
      <div class="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
        <h2 class="text-2xl font-bold text-white mb-6">🎮 Cách chơi</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div class="flex items-start space-x-3">
              <div class="bg-yellow-500 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
              <div>
                <h4 class="text-white font-semibold">Nhận lượt quay</h4>
                <p class="text-gray-300 text-sm">Đăng nhập hàng ngày để nhận lượt quay miễn phí</p>
              </div>
            </div>
            <div class="flex items-start space-x-3">
              <div class="bg-yellow-500 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
              <div>
                <h4 class="text-white font-semibold">Quay vòng quay</h4>
                <p class="text-gray-300 text-sm">Nhấn nút quay và chờ kết quả</p>
              </div>
            </div>
          </div>
          <div class="space-y-4">
            <div class="flex items-start space-x-3">
              <div class="bg-yellow-500 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
              <div>
                <h4 class="text-white font-semibold">Nhận thưởng</h4>
                <p class="text-gray-300 text-sm">Phần thưởng sẽ được tự động thêm vào tài khoản</p>
              </div>
            </div>
            <div class="flex items-start space-x-3">
              <div class="bg-yellow-500 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">4</div>
              <div>
                <h4 class="text-white font-semibold">Sử dụng thưởng</h4>
                <p class="text-gray-300 text-sm">Dùng phần thưởng để mua sắm hoặc rút tiền</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LuckySpinSection from '../components/lucky-spin/LuckySpinSection.vue';

export default {
  name: 'LuckySpin',
  components: {
    LuckySpinSection
  },
  data() {
    return {
      remainingSpins: 3,
      spinHistory: [
        {
          id: 1,
          reward: {
            icon: '💰',
            name: 'Tiền mặt',
            value: '50,000 VND'
          },
          timestamp: '2024-01-15T10:30:00Z',
          status: 'Đã nhận'
        },
        {
          id: 2,
          reward: {
            icon: '🎫',
            name: 'Voucher giảm giá',
            value: '10%'
          },
          timestamp: '2024-01-14T15:45:00Z',
          status: 'Đã sử dụng'
        },
        {
          id: 3,
          reward: {
            icon: '🎁',
            name: 'Sản phẩm miễn phí',
            value: 'Tai nghe Bluetooth'
          },
          timestamp: '2024-01-13T09:15:00Z',
          status: 'Đang giao'
        }
      ]
    }
  },
  methods: {
    formatDateTime(dateTime) {
      return new Date(dateTime).toLocaleString('vi-VN')
    }
  }
}
</script>